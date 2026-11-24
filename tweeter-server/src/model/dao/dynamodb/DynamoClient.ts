// AI-assisted: see AI-ATTRIBUTION.md
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

// Lambda sets AWS_REGION automatically. The fallback matches samconfig.toml
// so scripts run from your machine (e.g. to fill tables) use the same region.
const REGION = process.env.AWS_REGION ?? "us-east-2";

// One shared document client for every DynamoDB DAO. It is created once per
// Lambda container and reused across warm invocations, as the 4A FAQ
// recommends. Only the lib-dynamodb document client should be used for
// commands, so plain JavaScript values go in and come out.
export const dynamoClient: DynamoDBDocumentClient = DynamoDBDocumentClient.from(
  new DynamoDBClient({ region: REGION }),
  {
    marshallOptions: {
      // Skip undefined fields instead of throwing when writing an item.
      removeUndefinedValues: true,
    },
  },
);

// Waits ms milliseconds. Used to back off before retrying the items or keys
// a batch request left unprocessed.
export const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));
