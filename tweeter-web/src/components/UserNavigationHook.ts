import { useNavigate } from "react-router-dom";
import { useUserInfo, useUserInfoActions } from "./userInfo/UserInfoHooks";
import { useMessageActions } from "./toaster/MessageHooks";
import { AuthToken } from "tweeter-shared/dist/model/domain/AuthToken";
import { User } from "tweeter-shared/dist/model/domain/User";
import { FakeData } from "tweeter-shared/dist/util/FakeData";


export const userUserNavigation = ()  => {
    const { displayErrorMessage } = useMessageActions();
    const { setDisplayedUser } = useUserInfoActions();
    const { displayedUser, authToken } = useUserInfo();
    const navigate = useNavigate();

    const navigateToUser = async (event: React.MouseEvent): Promise<void> => {
        event.preventDefault();
    
        try {
          const alias = extractAlias(event.target.toString());
    
          const toUser = await getUser(authToken!, alias);
    
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
    
      const extractAlias = (value: string): string => {
        const index = value.indexOf("@");
        return value.substring(index);
      };
    
      const getUser = async (
        authToken: AuthToken,
        alias: string
      ): Promise<User | null> => {
        // TODO: Replace with the result of calling server
        return FakeData.instance.findUserByAlias(alias);
      };

      return {navigateToUser};
}