// AI-assisted: see AI-ATTRIBUTION.md
import { UserDto } from "../../dto/UserDto";
import { TweeterResponse } from "./TweeterResponse";

export interface LoginResponse extends TweeterResponse {
  readonly user: UserDto | null;
  readonly token: string | null;
}
