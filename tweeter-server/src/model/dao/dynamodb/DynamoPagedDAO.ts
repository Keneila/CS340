// AI-assisted: see AI-ATTRIBUTION.md
import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { dynamoClient } from "./DynamoClient";

// Describes one page to read from a table (or one of its indexes): every
// item under one partition key value, in sort-key order.
export interface PageQuery {
  readonly tableName: string;
  // Set to query a global secondary index instead of the table itself.
  readonly indexName?: string;
  readonly partitionKey: string;
  readonly partitionValue: string;
  readonly pageSize: number;
  // The full key of the last item on the previous page (partition key, sort
  // key, and for an index the table's keys too), or null for the first page.
  readonly lastKey: Record<string, unknown> | null;
  // True to read in descending sort-key order (e.g. newest statuses first).
  readonly descending?: boolean;
}

// Base class for DynamoDB DAOs that return pages of items. Subclasses
// describe the query and how to turn each item into a result; the query,
// start key, and hasMore logic live here once.
export abstract class DynamoPagedDAO {
  // Returns one page of results and whether more exist after it. Asks for
  // one extra item so hasMore is exact: it is true only if at least one more
  // item exists, so the client never loads an empty last page.
  protected async getPage<T>(
    query: PageQuery,
    toResult: (item: Record<string, unknown>) => T,
  ): Promise<[results: T[], hasMore: boolean]> {
    const response = await dynamoClient.send(
      new QueryCommand({
        TableName: query.tableName,
        IndexName: query.indexName,
        KeyConditionExpression: "#partitionKey = :partitionValue",
        ExpressionAttributeNames: { "#partitionKey": query.partitionKey },
        ExpressionAttributeValues: { ":partitionValue": query.partitionValue },
        Limit: query.pageSize + 1,
        ExclusiveStartKey: query.lastKey ?? undefined,
        ScanIndexForward: !query.descending,
      }),
    );

    const items = response.Items ?? [];
    const results = items.slice(0, query.pageSize).map(toResult);
    return [results, items.length > query.pageSize];
  }
}
