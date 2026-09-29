import {
  verify,
  anything,
  instance,
  mock,
  spy,
  when,
  capture,
} from "@typestrong/ts-mockito";
import {
  LogoutPresenter,
  LogoutView,
} from "../../src/presenter/LogoutPresenter";
import { AuthToken } from "tweeter-shared/dist/model/domain/AuthToken";
import { UserService } from "../../src/model.service/UserService";

describe("AppNavbarPresenter", () => {
  let mockLogoutPresenterView: LogoutView;
  let logoutPresenter: LogoutPresenter;
  const authToken = new AuthToken("abc123", Date.now());
  let mockUserService: UserService;
  beforeEach(() => {
    mockLogoutPresenterView = mock<LogoutView>();
    const mockLogoutPresenterViewInstance = instance(mockLogoutPresenterView);
    when(mockLogoutPresenterView.displayInfoMessage(anything(), 0)).thenReturn(
      "message123",
    );
    const logoutPresenterSpy = spy(
      new LogoutPresenter(mockLogoutPresenterViewInstance),
    );

    logoutPresenter = instance(logoutPresenterSpy);

    mockUserService = mock<UserService>();

    when(logoutPresenterSpy.userService).thenReturn(instance(mockUserService));
  });

  it("tells the view to display logging out message", async () => {
    await logoutPresenter.logOut(authToken);
    verify(
      mockLogoutPresenterView.displayInfoMessage("Logging Out...", 0),
    ).once();
  });

  it("calls logout on the user service with the correct authtoken", async () => {
    await logoutPresenter.logOut(authToken);
    verify(mockUserService.logout(authToken)).once();

    let [capturedAuthToken] = capture(mockUserService.logout).last();
    expect(capturedAuthToken).toEqual(authToken);
  });

  it("tells the view to clear the info message that was displayed previously, clear the user info, and navigate to the login page when successful", async () => {
    await logoutPresenter.logOut(authToken);
    verify(mockLogoutPresenterView.deleteMessage("message123")).once();
    verify(mockLogoutPresenterView.clearUserInfo()).once();
    verify(mockLogoutPresenterView.navigate("/login")).once();
    verify(mockLogoutPresenterView.displayErrorMessage(anything())).never();
  });

  it("tells the view to display an error message and does not tell it to clear the info message, clear the user info or navigate to the login page when not successful", async () => {
    let error = new Error("an Error occurred");
    when(mockUserService.logout(anything())).thenThrow(error);
    await logoutPresenter.logOut(authToken);
    verify(
      mockLogoutPresenterView.displayErrorMessage(
        "Failed to log user out because of exception: Error: an Error occurred",
      ),
    ).once();

    verify(mockLogoutPresenterView.deleteMessage(anything())).never();
    verify(mockLogoutPresenterView.clearUserInfo()).never();
    verify(mockLogoutPresenterView.navigate("/login")).never();
  });
});
