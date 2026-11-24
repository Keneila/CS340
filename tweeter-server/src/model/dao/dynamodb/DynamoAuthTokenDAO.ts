// AI-assisted: see AI-ATTRIBUTION.md
import {
  DeleteCommand,
  GetCommand,
  PutCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { AuthTokenDAO, AuthTokenRecord } from "../AuthTokenDAO";
import { dynamoClient } from "./DynamoClient";

// Table and attribute names; these must match the authtoken table in template.yaml.
const TABLE_NAME = "authtoken";
const TOKEN = "token";
const ALIAS = "alias";
const LAST_USED = "last_used";
// The table's TTL attribute: DynamoDB deletes the item some time after this
// epoch-seconds time passes.
const EXPIRES_AT = "expires_at";

export class DynamoAuthTokenDAO implements AuthTokenDAO {
  public async putAuthToken(
    token: string,
    alias: string,
    timestamp: number,
    expiresAt: number,
  ): Promise<void> {
    await dynamoClient.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: {
          [TOKEN]: token,
          [ALIAS]: alias,
          [LAST_USED]: timestamp,
          [EXPIRES_AT]: expiresAt,
        },
      }),
    );
  }

  public async getAuthToken(token: string): Promise<AuthTokenRecord | null> {
    const response = await dynamoClient.send(
      new GetCommand({
        TableName: TABLE_NAME,
        Key: { [TOKEN]: token },
        // Strongly consistent, so a token is found even on the request made
        // right after login, and a logged-out token is never found.
        ConsistentRead: true,
      }),
    );

    const item = response.Item;
    if (!item) {
      return null;
    }

    return {
      token: item[TOKEN] as string,
      alias: item[ALIAS] as string,
      lastUsed: Number(item[LAST_USED]),
    };
  }

  public async updateLastUsed(
    token: string,
    timestamp: number,
    expiresAt: number,
  ): Promise<void> {
    try {
      await dynamoClient.send(
        new UpdateCommand({
          TableName: TABLE_NAME,
          Key: { [TOKEN]: token },
          UpdateExpression: "SET #lastUsed = :lastUsed, #expiresAt = :expiresAt",
          // Don't recreate a token that was deleted (e.g. logged out) since
          // it was read.
          ConditionExpression: "attribute_exists(#token)",
          // "token" is a DynamoDB reserved word, so every name goes through
          // a # placeholder.
          ExpressionAttributeNames: {
            "#token": TOKEN,
            "#lastUsed": LAST_USED,
            "#expiresAt": EXPIRES_AT,
          },
          ExpressionAttributeValues: {
            ":lastUsed": timestamp,
            ":expiresAt": expiresAt,
          },
        }),
      );
    } catch (error) {
      // The token is gone, so there is nothing to refresh.
      if ((error as Error).name !== "ConditionalCheckFailedException") {
        throw error;
      }
    }
  }

  public async deleteAuthToken(token: string): Promise<void> {
    await dynamoClient.send(
      new DeleteCommand({
        TableName: TABLE_NAME,
        Key: { [TOKEN]: token },
      }),
    );
  }
}
