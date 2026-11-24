// AI-assisted: see AI-ATTRIBUTION.md
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { StatusDto } from "tweeter-shared";
import { StoryDAO } from "../StoryDAO";
import { UserDAO } from "../UserDAO";
import { dynamoClient } from "./DynamoClient";
import { DynamoPagedDAO } from "./DynamoPagedDAO";

// Table and attribute names; these must match the story table in template.yaml.
const TABLE_NAME = "story";
const AUTHOR_ALIAS = "author_alias";
const TIMESTAMP = "timestamp";
const POST = "post";

// Story items store only the author's alias, not their name or image, so the
// author is looked up through the UserDAO passed in (one lookup per page,
// since every status in a story has the same author).
export class DynamoStoryDAO extends DynamoPagedDAO implements StoryDAO {
  public constructor(private readonly userDAO: UserDAO) {
    super();
  }

  public async putStatus(status: StatusDto): Promise<void> {
    await dynamoClient.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: {
          [AUTHOR_ALIAS]: status.user.alias,
          [TIMESTAMP]: status.timestamp,
          [POST]: status.post,
        },
      }),
    );
  }

  public async getPageOfStory(
    authorAlias: string,
    pageSize: number,
    lastItem: StatusDto | null,
  ): Promise<[statuses: StatusDto[], hasMore: boolean]> {
    const [posts, hasMore] = await this.getPage(
      {
        tableName: TABLE_NAME,
        partitionKey: AUTHOR_ALIAS,
        partitionValue: authorAlias,
        pageSize,
        lastKey:
          lastItem === null
            ? null
            : { [AUTHOR_ALIAS]: authorAlias, [TIMESTAMP]: lastItem.timestamp },
        descending: true, // newest first
      },
      (item) => ({
        post: item[POST] as string,
        timestamp: Number(item[TIMESTAMP]),
      }),
    );

    if (posts.length === 0) {
      return [[], hasMore];
    }

    const author = await this.userDAO.getUser(authorAlias);
    if (author === null) {
      throw new Error(
        `[internal-server-error] Story author ${authorAlias} does not exist`,
      );
    }

    return [posts.map((post) => ({ ...post, user: author })), hasMore];
  }
}
