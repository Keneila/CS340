import { useNavigate } from "react-router-dom";
import { useUserInfo, useUserInfoActions } from "./userInfo/UserInfoHooks";
import { useMessageActions } from "./toaster/MessageHooks";
import {
  UseNavigationPresenter,
  UseNavigationView,
} from "../presenter/UseNavigationPresenter";
import { useRef } from "react";

export const userUserNavigation = () => {
  const { displayErrorMessage } = useMessageActions();
  const { setDisplayedUser } = useUserInfoActions();
  const { displayedUser, authToken } = useUserInfo();
  const navigate = useNavigate();

  const listener: UseNavigationView = {
    navigate: useNavigate(),
    setDisplayedUser: setDisplayedUser,
    displayErrorMessage: displayErrorMessage,
  };

  const presenterRef = useRef<UseNavigationPresenter | null>(null);
  if (!presenterRef.current) {
    presenterRef.current = new UseNavigationPresenter(listener);
  }

  const navigateToUser = async (event: React.MouseEvent): Promise<void> => {
    event.preventDefault();
    presenterRef.current!.navigateToUser(
      authToken!,
      displayedUser!,
      event.target.toString(),
    );
  };

  return { navigateToUser };
};
