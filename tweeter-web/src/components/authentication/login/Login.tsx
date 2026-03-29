import "./Login.css";
import "bootstrap/dist/css/bootstrap.css";
import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthenticationFormLayout from "../AuthenticationFormLayout";
import AuthenticationFields from "../AuthenticationFields";
import { useMessageActions } from "../../toaster/MessageHooks";
import { useUserInfoActions } from "../../userInfo/UserInfoHooks";
import { LoginPresenter, LoginView } from "../../../presenter/LoginPresenter";

interface Props {
  originalUrl?: string;
}

const Login = (props: Props) => {
  const [alias, setAlias] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { displayErrorMessage } = useMessageActions();

  const listener: LoginView = {
    navigate: useNavigate(),
    displayErrorMessage: displayErrorMessage,
    setIsLoading: setIsLoading,
    updateUserInfo: useUserInfoActions().updateUserInfo,
  };

  const presenterRef = useRef<LoginPresenter | null>(null);
  if (!presenterRef.current) {
    presenterRef.current = new LoginPresenter(listener);
  }

  const inputFieldFactory = () => {
    return (
      <>
        <AuthenticationFields
          checkSubmitButtonStatus={() =>
            presenterRef.current!.checkSubmitButtonStatus(alias, password)
          }
          doFunction={() =>
            presenterRef.current!.doLogin(
              alias,
              password,
              rememberMe,
              props.originalUrl ? props.originalUrl : "",
            )
          }
          setAlias={setAlias}
          setPassword={setPassword}
        />
      </>
    );
  };

  const switchAuthenticationMethodFactory = () => {
    return (
      <div className="mb-3">
        Not registered? <Link to="/register">Register</Link>
      </div>
    );
  };

  return (
    <AuthenticationFormLayout
      headingText="Please Sign In"
      submitButtonLabel="Sign in"
      oAuthHeading="Sign in with:"
      inputFieldFactory={inputFieldFactory}
      switchAuthenticationMethodFactory={switchAuthenticationMethodFactory}
      setRememberMe={setRememberMe}
      submitButtonDisabled={() =>
        presenterRef.current!.checkSubmitButtonStatus(alias, password)
      }
      isLoading={isLoading}
      submit={() =>
        presenterRef.current!.doLogin(
          alias,
          password,
          rememberMe,
          props.originalUrl ? props.originalUrl : "",
        )
      }
    />
  );
};

export default Login;
