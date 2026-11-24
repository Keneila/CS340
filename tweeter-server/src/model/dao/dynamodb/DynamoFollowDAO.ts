// AI-assisted: see AI-ATTRIBUTION.md
import { DeleteCommand, GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { FollowDAO } from "../FollowDAO";
import { dynamoClient } from "./DynamoClient";
import { DynamoPagedDAO } from "./DynamoPagedDAO";

// Table, index, and attribute names; these must match the follow table in
// template.yaml.
const TABLE_NAME = "follow";
// Same items keyed the other way round (followee first), for follower lists.
const INDEX_NAME = "follow_index";
const FOLLOWER_ALIAS = "follower_alias";
const FOLLOWEE_ALIAS = "followee_alias";

export class DynamoFollowDAO extends DynamoPagedDAO implements FollowDAO {
  public async putFollow(
    followerAlias: string,
    followeeAlias: string,
  ): Promise<void> {
    await dynamoClient.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: this.toKey(followerAlias, followeeAlias),
      }),
    );
  }

  public async deleteFollow(
    followerAlias: string,
    followeeAlias: string,
  ): Promise<void> {
    await dynamoClient.send(
      new DeleteCommand({
        TableName: TABLE_NAME,
        Key: this.toKey(followerAlias, followeeAlias),
      }),
    );
  }

  public async isFollower(
    followerAlias: string,
    followeeAlias: string,
  ): Promise<boolean> {
    const response = await dynamoClient.send(
      new GetCommand({
        TableName: TABLE_NAME,
        Key: this.toKey(followerAlias, followeeAlias),
      }),
    );
    return response.Item !== undefined;
  }

  // Queries the table: everyone followerAlias follows.
  public async getPageOfFolloweeAliases(
    followerAlias: string,
    pageSize: number,
    lastFolloweeAlias: string | null,
  ): Promise<[aliases: string[], hasMore: boolean]> {
    return this.getPageOfAliases(
      FOLLOWER_ALIAS,
      followerAlias,
      FOLLOWEE_ALIAS,
      pageSize,
      lastFolloweeAlias,
    );
  }

  // Queries the index: everyone who follows followeeAlias.
  public async getPageOfFollowerAliases(
    followeeAlias: string,
    pageSize: number,
    lastFollowerAlias: string | null,
  ): Promise<[aliases: string[], hasMore: boolean]> {
    return this.getPageOfAliases(
      FOLLOWEE_ALIAS,
      followeeAlias,
      FOLLOWER_ALIAS,
      pageSize,
      lastFollowerAlias,
      INDEX_NAME,
    );
  }

  // Returns one page of the sortKey aliases under partitionValue, starting
  // after lastAlias. Both key attributes of the table and the index are the
  // same two aliases, so { partitionKey, sortKey } is a complete start key
  // for either.
  private async getPageOfAliases(
    partitionKey: string,
    partitionValue: string,
    sortKey: string,
    pageSize: number,
    lastAlias: string | null,
    indexName?: string,
  ): Promise<[aliases: string[], hasMore: boolean]> {
    return this.getPage(
      {
        tableName: TABLE_NAME,
        indexName,
        partitionKey,
        partitionValue,
        pageSize,
        lastKey:
          lastAlias === null
            ? null
            : { [partitionKey]: partitionValue, [sortKey]: lastAlias },
      },
      (item) => item[sortKey] as string,
    );
  }

  private toKey(
    followerAlias: string,
    followeeAlias: string,
  ): Record<string, string> {
    return {
      [FOLLOWER_ALIAS]: followerAlias,
      [FOLLOWEE_ALIAS]: followeeAlias,
    };
  }
}
