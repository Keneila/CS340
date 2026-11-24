// AI-assisted: see AI-ATTRIBUTION.md
import {
  BatchGetCommand,
  GetCommand,
  PutCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { UserDto } from "tweeter-shared";
import { UserDAO } from "../UserDAO";
import { dynamoClient, sendInChunksWithRetry } from "./DynamoClient";

// Table and attribute names; these must match the user table in template.yaml.
const TABLE_NAME = "user";
const ALIAS = "alias";
const FIRST_NAME = "first_name";
const LAST_NAME = "last_name";
const IMAGE_URL = "image_url";
const PASSWORD_HASH = "password_hash";
const FOLLOWER_COUNT = "follower_count";
const FOLLOWEE_COUNT = "followee_count";

// DynamoDB allows at most 100 keys in one BatchGet request.
const BATCH_GET_LIMIT = 100;

// The attributes that make up a UserDto. "alias" is written as #alias so it
// can't clash with a DynamoDB reserved word. The password hash is never read
// here, so it is never returned along with a user.
const USER_PROJECTION = `#alias, ${FIRST_NAME}, ${LAST_NAME}, ${IMAGE_URL}`;
const USER_PROJECTION_NAMES = { "#alias": ALIAS };

export class DynamoUserDAO implements UserDAO {
  public async putUser(user: UserDto, passwordHash: string): Promise<void> {
    await dynamoClient.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: {
          [ALIAS]: user.alias,
          [FIRST_NAME]: user.firstName,
          [LAST_NAME]: user.lastName,
          [IMAGE_URL]: user.imageUrl,
          [PASSWORD_HASH]: passwordHash,
          [FOLLOWER_COUNT]: 0,
          [FOLLOWEE_COUNT]: 0,
        },
      }),
    );
  }

  public async getUser(alias: string): Promise<UserDto | null> {
    const response = await dynamoClient.send(
      new GetCommand({
        TableName: TABLE_NAME,
        Key: { [ALIAS]: alias },
        ProjectionExpression: USER_PROJECTION,
        ExpressionAttributeNames: USER_PROJECTION_NAMES,
      }),
    );
    return response.Item ? this.toUserDto(response.Item) : null;
  }

  // Returns the users in the same order as aliases. BatchGet returns items in
  // any order and may leave some keys unprocessed, which are retried with a
  // growing delay.
  public async getUsers(aliases: string[]): Promise<UserDto[]> {
    // BatchGet rejects duplicate keys, so each alias is requested once.
    const keys = [...new Set(aliases)].map((alias) => ({ [ALIAS]: alias }));
    const usersByAlias = new Map<string, UserDto>();

    await sendInChunksWithRetry<Record<string, unknown>>(
      keys,
      BATCH_GET_LIMIT,
      async (chunk) => {
        const response = await dynamoClient.send(
          new BatchGetCommand({
            RequestItems: {
              [TABLE_NAME]: {
                Keys: chunk,
                ProjectionExpression: USER_PROJECTION,
                ExpressionAttributeNames: USER_PROJECTION_NAMES,
              },
            },
          }),
        );

        for (const item of response.Responses?.[TABLE_NAME] ?? []) {
          const user = this.toUserDto(item);
          usersByAlias.set(user.alias, user);
        }

        return response.UnprocessedKeys?.[TABLE_NAME]?.Keys ?? [];
      },
    );

    return aliases.flatMap((alias) => {
      const user = usersByAlias.get(alias);
      return user ? [user] : [];
    });
  }

  public async getPasswordHash(alias: string): Promise<string | null> {
    const item = await this.getAttribute(alias, PASSWORD_HASH);
    return item ? (item[PASSWORD_HASH] as string) : null;
  }

  public async getFollowerCount(alias: string): Promise<number> {
    return this.getCount(alias, FOLLOWER_COUNT);
  }

  public async getFolloweeCount(alias: string): Promise<number> {
    return this.getCount(alias, FOLLOWEE_COUNT);
  }

  public async changeFollowerCount(alias: string, delta: number): Promise<void> {
    await this.changeCount(alias, FOLLOWER_COUNT, delta);
  }

  public async changeFolloweeCount(alias: string, delta: number): Promise<void> {
    await this.changeCount(alias, FOLLOWEE_COUNT, delta);
  }

  // Reads one attribute of a user's item. Returns undefined if the user
  // doesn't exist.
  private async getAttribute(
    alias: string,
    attribute: string,
  ): Promise<Record<string, unknown> | undefined> {
    const response = await dynamoClient.send(
      new GetCommand({
        TableName: TABLE_NAME,
        Key: { [ALIAS]: alias },
        ProjectionExpression: attribute,
      }),
    );
    return response.Item;
  }

  // Returns 0 if the user doesn't exist.
  private async getCount(alias: string, attribute: string): Promise<number> {
    const item = await this.getAttribute(alias, attribute);
    return item ? Number(item[attribute] ?? 0) : 0;
  }

  // Adds delta in a single atomic update, so two follows at the same time
  // can't overwrite each other's count. The condition stops the update from
  // creating an empty item if the user doesn't exist.
  private async changeCount(
    alias: string,
    attribute: string,
    delta: number,
  ): Promise<void> {
    await dynamoClient.send(
      new UpdateCommand({
        TableName: TABLE_NAME,
        Key: { [ALIAS]: alias },
        UpdateExpression: `ADD ${attribute} :delta`,
        ConditionExpression: "attribute_exists(#alias)",
        ExpressionAttributeNames: { "#alias": ALIAS },
        ExpressionAttributeValues: { ":delta": delta },
      }),
    );
  }

  private toUserDto(item: Record<string, unknown>): UserDto {
    return {
      alias: item[ALIAS] as string,
      firstName: item[FIRST_NAME] as string,
      lastName: item[LAST_NAME] as string,
      imageUrl: item[IMAGE_URL] as string,
    };
  }
}
