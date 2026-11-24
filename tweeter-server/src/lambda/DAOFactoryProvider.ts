// AI-assisted: see AI-ATTRIBUTION.md
import { DAOFactory } from "../model/dao/DAOFactory";
import { DynamoDAOFactory } from "../model/dao/dynamodb/DynamoDAOFactory";

// The one place that chooses which database the server uses. Every lambda
// gets its factory from here, so switching databases is a one-line change.
// The factory is created once per Lambda container and reused across warm
// invocations.
const daoFactory: DAOFactory = new DynamoDAOFactory();

export const getDAOFactory = (): DAOFactory => daoFactory;
