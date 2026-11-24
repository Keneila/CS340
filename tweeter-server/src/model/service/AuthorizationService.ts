// AI-assisted: see AI-ATTRIBUTION.md
import { AuthTokenDAO } from "../dao/AuthTokenDAO";
import { DAOFactory } from "../dao/DAOFactory";
import { Service } from "./Service";

// How long a token may go unused before it expires, in seconds. All token
// timestamps (lastUsed) are stored in epoch seconds, as DynamoDB TTL expects.
export const AUTH_TOKEN_TIMEOUT_SECONDS = 60 * 60; // 60 minutes

// Checks auth tokens for the other services. A failed check throws an
// "[unauthorized]" error, which API Gateway maps to a 401 response.
export class AuthorizationService extends Service {
  private readonly authTokenDAO: AuthTokenDAO;

  public constructor(daoFactory: DAOFactory) {
    super(daoFactory);
    this.authTokenDAO = daoFactory.getAuthTokenDAO();
  }

  // Confirms the token exists and has not expired, records this use of it so
  // the session stays active, and returns the alias of the user it belongs to.
  public async authenticate(token: string): Promise<string> {
    const record = await this.authTokenDAO.getAuthToken(token);
    if (record === null) {
      throw new Error("[unauthorized] Invalid auth token");
    }

    const now = Math.floor(Date.now() / 1000);
    if (now - record.lastUsed > AUTH_TOKEN_TIMEOUT_SECONDS) {
      await this.authTokenDAO.deleteAuthToken(token);
      throw new Error("[unauthorized] Auth token has expired");
    }

    await this.authTokenDAO.updateLastUsed(
      token,
      now,
      now + AUTH_TOKEN_TIMEOUT_SECONDS,
    );
    return record.alias;
  }
}
