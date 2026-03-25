import { useNavigate } from "react-router-dom";
import { useUserInfo, useUserInfoActions } from "./userInfo/UserInfoHooks";
import { useMessageActions } from "./toaster/MessageHooks";
import { UseNavigationPresenter } from "../presenter/UseNavigationPresenter";
import { useRef } from "react";


export const userUserNavigation = ()  => {
    const { displayErrorMessage } = useMessageActions();
    const { setDisplayedUser } = useUserInfoActions();
    const { displayedUser, authToken } = useUserInfo();
    const navigate = useNavigate();

    const presenterRef = useRef<UseNavigationPresenter | null>(null);
      if (!presenterRef.current) {
          presenterRef.current = new UseNavigationPresenter();
      }

    const navigateToUser = async (event: React.MouseEvent): Promise<void> => {
        event.preventDefault();
    
        try {
          const alias = presenterRef.current!.extractAlias(event.target.toString());
    
          const toUser = await presenterRef.current!.getUser(authToken!, alias);
    
          if (toUser) {
            if (!toUser.equals(displayedUser!)) {
              setDisplayedUser(toUser);
              const featureUrl = event.target.toString().split("/").at(-2);
              navigate(`/${featureUrl}/${toUser.alias}`);
            }
          }
        } catch (error) {
          displayErrorMessage(`Failed to get user because of exception: ${error}`);
        }
      };
    

      return {navigateToUser};
}