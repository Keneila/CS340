// AI-assisted: see AI-ATTRIBUTION.md

// The tags template.yaml's error responses look for in an error message.
// This must match the selection patterns there.
const ERROR_TAG = /bad-request|unauthorized|internal-server-error/;

// Wraps a Lambda handler so every error it throws carries a tag. Tagged
// errors pass through unchanged. Untagged ones (e.g. DynamoDB throttling or
// a network failure) are logged and re-thrown as "[internal-server-error]".
// Without a tag, API Gateway would fall back to its 200 response and the
// client would treat the error as a success.
export const withErrorHandling = <REQ, RES>(
  handler: (request: REQ) => Promise<RES>,
): ((request: REQ) => Promise<RES>) => {
  return async (request: REQ): Promise<RES> => {
    try {
      return await handler(request);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (ERROR_TAG.test(message)) {
        throw error;
      }

      console.error("Untagged error:", error);
      throw new Error(`[internal-server-error] ${message}`);
    }
  };
};
