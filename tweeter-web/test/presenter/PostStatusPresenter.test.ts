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
  PostStatusView,
  PostStatusPresenter,
} from "../../src/presenter/PostStatusPresenter";
import { AuthToken } from "tweeter-shared/dist/model/domain/AuthToken";
import { UserService } from "../../src/model.service/UserService";
import { User } from "tweeter-shared/dist/model/domain/User";
import { Status } from "tweeter-shared/dist/model/domain/Status";

describe("PostStatusPresenter", () => {
  let mockPostStatusView: PostStatusView;
  let postStatusPresenter: PostStatusPresenter;
  const authToken = new AuthToken("abc123", Date.now());
  const u = new User("first", "last", "@alias", "imageUrl");
  let mockUserService: UserService;
  beforeEach(() => {
    mockPostStatusView = mock<PostStatusView>();
    const mockPostStatusViewInstance = instance(mockPostStatusView);
    when(mockPostStatusView.displayInfoMessage(anything(), 0)).thenReturn(
      "message123",
    );
    const postStatusPresenterSpy = spy(
      new PostStatusPresenter(mockPostStatusViewInstance),
    );

    postStatusPresenter = instance(postStatusPresenterSpy);

    mockUserService = mock<UserService>();

    when(postStatusPresenterSpy.userService).thenReturn(
      instance(mockUserService),
    );
    when(mockPostStatusView.post).thenReturn("This is a test post");
  });

  it("tells the view to display posting status message", async () => {
    await postStatusPresenter.submitPostCode(
      authToken,
      new User("first", "last", "@alias", "imageUrl"),
    );
    verify(
      mockPostStatusView.displayInfoMessage("Posting status...", 0),
    ).once();
  });

  it("calls postStatus on the user service with the correct string and authtoken", async () => {
    await postStatusPresenter.submitPostCode(authToken, u);
    verify(mockUserService.postStatus(authToken, anything())).once();

    let [capturedAuthToken, capturedStatus] = capture(
      mockUserService.postStatus,
    ).last();
    expect(capturedAuthToken).toEqual(authToken);
    expect(capturedStatus.post).toEqual("This is a test post");
  });

  it("tells the view to clear the info message that was displayed previously, clear the post, and display a status posted message when successful", async () => {
    await postStatusPresenter.submitPostCode(authToken, u);
    verify(mockPostStatusView.deleteMessage("message123")).once();
    verify(mockPostStatusView.setPost("")).once();
    verify(
      mockPostStatusView.displayInfoMessage("Status posted!", 2000),
    ).once();
    verify(mockPostStatusView.displayErrorMessage(anything())).never();
  });

  it("tells the view to clear the info message and display an error message but does not tell it to clear the post or display a status posted message when not successful", async () => {
    let error = new Error("an Error occurred");
    when(mockUserService.postStatus(anything(), anything())).thenThrow(error);
    await postStatusPresenter.submitPostCode(authToken, u);
    verify(
      mockPostStatusView.displayErrorMessage(
        "Failed to post the status because of exception: Error: an Error occurred",
      ),
    ).once();

    verify(mockPostStatusView.deleteMessage(anything())).once();
    verify(mockPostStatusView.setPost("")).never();
    verify(
      mockPostStatusView.displayInfoMessage("Status posted!", 2000),
    ).never();
  });
});
