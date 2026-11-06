import { MemoryRouter } from "react-router";
import PostStatus from "../../../src/components/postStatus/PostStatus";
import { useUserInfo } from "../../../src/components/userInfo/UserInfoHooks";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { instance, mock, verify } from "@typestrong/ts-mockito";
import "@testing-library/jest-dom";
import { AuthToken } from "tweeter-shared/dist/model/domain/AuthToken";
import { User } from "tweeter-shared/dist/model/domain/User";
import { PostStatusPresenter } from "../../../src/presenter/PostStatusPresenter";

jest.mock("../../../src/components/userInfo/UserInfoHooks", () => ({
  ...jest.requireActual("../../../src/components/userInfo/UserInfoHooks"),
  __esModule: true,
  useUserInfo: jest.fn(),
}));

describe("PostStaus Component", () => {
  const mockUser = mock<User>();
  const mockUserInstance = instance(mockUser);
  const mockAuthToken = mock<AuthToken>();
  const mockAuthTokenInstance = instance(mockAuthToken);
  beforeAll(() => {
    (useUserInfo as jest.Mock).mockReturnValue({
      currentUser: mockUserInstance,
      authToken: mockAuthTokenInstance,
    });
  });

  it("starts with the post and clear buttons disabled", async () => {
    const { postStatusButton, clearButton } = renderPostStatusAndGetElements();
    expect(postStatusButton).toBeDisabled();
    expect(clearButton).toBeDisabled();
  });

  it("both buttons enabled with text field has text", async () => {
    const { user, postStatusTextArea, postStatusButton, clearButton } =
      renderPostStatusAndGetElements();
    await user.type(postStatusTextArea, "Hello World");
    expect(postStatusButton).toBeEnabled();
    expect(clearButton).toBeEnabled();
  });

  it("both buttons disabled with text field has text", async () => {
    const { user, postStatusTextArea, postStatusButton, clearButton } =
      renderPostStatusAndGetElements();
    await user.type(postStatusTextArea, "Hello World");
    expect(postStatusButton).toBeEnabled();
    expect(clearButton).toBeEnabled();
    await user.clear(postStatusTextArea);
    expect(postStatusButton).toBeDisabled();
    expect(clearButton).toBeDisabled();
  });

  it("calls postStatus method with correct parameters when the post button is pressed", async () => {
    const mockPresenter = mock<PostStatusPresenter>();
    const mockPresenterInstance = instance(mockPresenter);
    const { user, postStatusTextArea, postStatusButton } =
      renderPostStatusAndGetElements(mockPresenterInstance);
    await user.type(postStatusTextArea, "Hello World");
    await user.click(postStatusButton);
    verify(
      mockPresenter.submitPostCode(mockAuthTokenInstance, mockUserInstance),
    ).once();
  });
});

function renderPostStatus(presenter?: PostStatusPresenter) {
  return render(
    <MemoryRouter>
      <PostStatus presenter={presenter} />
    </MemoryRouter>,
  );
}

function renderPostStatusAndGetElements(mockPresenter?: PostStatusPresenter) {
  const user = userEvent.setup();
  renderPostStatus(mockPresenter);
  const postStatusTextArea = screen.getByPlaceholderText(
    "What's on your mind?",
  );
  const postStatusButton = screen.getByRole("button", { name: /Post/i });
  const clearButton = screen.getByRole("button", { name: /Clear/i });
  return { user, postStatusTextArea, postStatusButton, clearButton };
}
