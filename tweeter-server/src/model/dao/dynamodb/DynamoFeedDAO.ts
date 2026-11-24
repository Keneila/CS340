// AI-assisted: see AI-ATTRIBUTION.md
import {
  BatchWriteCommand,
  BatchWriteWriteRequest,
} from "@aws-sdk/lib-dynamodb";
import { StatusDto, UserDto } from "tweeter-shared";
import { FeedDAO } from "../FeedDAO";
import { UserDAO } from "../UserDAO";
import { dynamoClient } from "./DynamoClient";
import { DynamoPagedDAO } from "./DynamoPagedDAO";

// Table and attribute names; these must match the feed table in template.yaml.
const TABLE_NAME = "feed";
const RECEIVER_ALIAS = "receiver_alias";
// Sort key "<timestamp>#<author_alias>": unique even if two followees post in
// the same millisecond, and sorts in time order because millisecond
// timestamps are all 13 digits.
const TIME_AUTHOR = "time_author";
const AUTHOR_ALIAS = "author_alias";
const POST = "post";
const TIMESTAMP = "timestamp";

// DynamoDB allows at most 25 items in one BatchWrite request.
const BATCH_WRITE_LIMIT = 25;

const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

const toTimeAuthor = (timestamp: number, authorAlias: string): string =>
  `${timestamp}#${authorAlias}`;

// Feed items store only the author's alias, not their name or image, so the
// authors are looked up through the UserDAO passed in (one batch lookup per
// page).
export class DynamoFeedDAO extends DynamoPagedDAO implements FeedDAO {
  public constructor(private readonly userDAO: UserDAO) {
    super();
  }

  // Writes one feed item per receiver, 25 per BatchWrite request. Items
  // DynamoDB leaves unprocessed (e.g. when write capacity is exceeded) are
  // retried with a growing delay until all are written.
  public async putFeedItems(
    receiverAliases: string[],
    status: StatusDto,
  ): Promise<void> {
    const timeAuthor = toTimeAuthor(status.timestamp, status.user.alias);
    // BatchWrite rejects two writes to the same key in one request.
    const requests: BatchWriteWriteRequest[] = [
      ...new Set(receiverAliases),
    ].map((receiverAlias) => ({
      PutRequest: {
        Item: {
          [RECEIVER_ALIAS]: receiverAlias,
          [TIME_AUTHOR]: timeAuthor,
          [AUTHOR_ALIAS]: status.user.alias,
          [POST]: status.post,
          [TIMESTAMP]: status.timestamp,
        },
      },
    }));

    for (let start = 0; start < requests.length; start += BATCH_WRITE_LIMIT) {
      let pending = requests.slice(start, start + BATCH_WRITE_LIMIT);
      let attempt = 0;

      while (pending.length > 0) {
        const response = await dynamoClient.send(
          new BatchWriteCommand({ RequestItems: { [TABLE_NAME]: pending } }),
        );

        pending = response.UnprocessedItems?.[TABLE_NAME] ?? [];
        if (pending.length > 0) {
          await sleep(50 * 2 ** attempt);
          attempt++;
        }
      }
    }
  }

  public async getPageOfFeed(
    receiverAlias: string,
    pageSize: number,
    lastItem: StatusDto | null,
  ): Promise<[statuses: StatusDto[], hasMore: boolean]> {
    const [posts, hasMore] = await this.getPage(
      {
        tableName: TABLE_NAME,
        partitionKey: RECEIVER_ALIAS,
        partitionValue: receiverAlias,
        pageSize,
        lastKey:
          lastItem === null
            ? null
            : {
                [RECEIVER_ALIAS]: receiverAlias,
                [TIME_AUTHOR]: toTimeAuthor(
                  lastItem.timestamp,
                  lastItem.user.alias,
                ),
              },
        descending: true, // newest first
      },
      (item) => ({
        authorAlias: item[AUTHOR_ALIAS] as string,
        post: item[POST] as string,
        timestamp: Number(item[TIMESTAMP]),
      }),
    );

    if (posts.length === 0) {
      return [[], hasMore];
    }

    const authors = await this.userDAO.getUsers(
      posts.map((post) => post.authorAlias),
    );
    const authorsByAlias = new Map<string, UserDto>(
      authors.map((author) => [author.alias, author]),
    );

    const statuses = posts.map((post) => {
      const author = authorsByAlias.get(post.authorAlias);
      if (author === undefined) {
        throw new Error(
          `[internal-server-error] Feed author ${post.authorAlias} does not exist`,
        );
      }
      return { post: post.post, user: author, timestamp: post.timestamp };
    });

    return [statuses, hasMore];
  }
}
