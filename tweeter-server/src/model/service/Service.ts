// AI-assisted: see AI-ATTRIBUTION.md
import { DAOFactory } from "../dao/DAOFactory";

// Base class for all services. Services get their DAOs from the factory
// passed in, so they never call `new` on a DAO or know which database is used.
export abstract class Service {
  public constructor(protected readonly daoFactory: DAOFactory) {}
}
