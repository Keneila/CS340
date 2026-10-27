import { MemoryRouter } from "react-router-dom";
import Login from "../../../../src/components/authentication/login/Login";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { instance, mock, verify } from "@typestrong/ts-mockito";
import { LoginPresenter } from "../../../../src/presenter/LoginPresenter";
import "@testing-library/jest-dom";

library.add(fab);

describe("Login Component", () => {
  it("starts with the sign in button disabled", () => {
    const { signInButton } = renderLoginAndGetElement("/");
    expect(signInButton).toBeDisabled();
  });

  it("enables the sign in button when both alias and password are filled", async () => {
    const { user, signInButton, aliasField, passwordField } =
      renderLoginAndGetElement("/");
    await user.type(aliasField, "testuser");
    await user.type(passwordField, "testpassword");
    expect(signInButton).toBeEnabled();
  });

  it("disables the sign in button when alias is filled but password is empty", async () => {
    const { user, signInButton, aliasField, passwordField } =
      renderLoginAndGetElement("/");
    await user.type(aliasField, "testuser");
    await user.type(passwordField, "testpassword");
    expect(signInButton).toBeEnabled();

    await user.clear(passwordField);
    expect(signInButton).toBeDisabled();

    await user.clear(aliasField);
    await user.type(passwordField, "testpassword");
    expect(signInButton).toBeDisabled();
  });

  it("calls the presenter's login method with correct parameters when the sign in button is pressed", async () => {
    const mockPresenter = mock<LoginPresenter>();
    const mockPresenterInstance = instance(mockPresenter);

    const originalUrl = "/original-url";
    const alias = "testuser";
    const password = "testpassword";
    const { user, signInButton, aliasField, passwordField } =
      renderLoginAndGetElement(originalUrl, mockPresenterInstance);
    await user.type(aliasField, alias);
    await user.type(passwordField, password);
    await user.click(signInButton);
    verify(mockPresenter.doSignIn(alias, password, false, originalUrl)).once();
  });
});

function renderLogin(originalUrl: string, presenter?: LoginPresenter) {
  return render(
    <MemoryRouter>
      {!!presenter ? (
        <Login originalUrl={originalUrl} presenter={presenter} />
      ) : (
        <Login originalUrl={originalUrl} />
      )}
    </MemoryRouter>,
  );
}

function renderLoginAndGetElement(
  originalUrl: string,
  presenter?: LoginPresenter,
) {
  const user = userEvent.setup();

  renderLogin(originalUrl, presenter);

  const signInButton = screen.getByRole("button", { name: /Sign in/i });
  const aliasField = screen.getByLabelText("alias");
  const passwordField = screen.getByLabelText("password");

  return { user, signInButton, aliasField, passwordField };
}
