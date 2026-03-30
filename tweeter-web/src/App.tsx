import "./App.css";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Login from "./components/authentication/login/Login";
import Register from "./components/authentication/register/Register";
import MainLayout from "./components/mainLayout/MainLayout";
import Toaster from "./components/toaster/Toaster";
import { useUserInfo } from "./components/userInfo/UserInfoHooks";
import { FolloweePresenter } from "./presenter/FolloweePresenter";
import { FollowerPresenter } from "./presenter/FollowerPresenter";
import { StoryPresenter } from "./presenter/StoryPresenter";
import { FeedPresenter } from "./presenter/FeedPresenter";
import {
  PagedItemPresenter,
  PagedItemView,
} from "./presenter/PagedItemPresenter";
import { Status, User } from "tweeter-shared";
import StatusItem from "./components/statusItem/StatusItem";
import UserItem from "./components/userItem/UserItem";
import ItemScroller from "./components/mainLayout/ItemScroller";
import { StatusService } from "./model.service/StatusService";
import { FollowService } from "./model.service/FollowService";

const App = () => {
  const { currentUser, authToken } = useUserInfo();

  const isAuthenticated = (): boolean => {
    return !!currentUser && !!authToken;
  };

  return (
    <div>
      <Toaster position="top-right" />
      <BrowserRouter>
        {isAuthenticated() ? (
          <AuthenticatedRoutes />
        ) : (
          <UnauthenticatedRoutes />
        )}
      </BrowserRouter>
    </div>
  );
};

const AuthenticatedRoutes = () => {
  const { displayedUser } = useUserInfo();
  const statusItemComponent = (
    item: Status,
    featurePath: string,
  ): JSX.Element => {
    return <StatusItem status={item} featurePath={featurePath} />;
  };
  const userItemComponent = (item: User, featurePath: string): JSX.Element => {
    return <UserItem user={item} featurePath={featurePath} />;
  };
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route
          index
          element={<Navigate to={`/feed/${displayedUser!.alias}`} />}
        />
        <Route
          path="feed/:displayedUser"
          element={
            <ItemScroller<
              Status,
              StatusService,
              PagedItemPresenter<Status, StatusService>
            >
              itemComponentFactory={statusItemComponent}
              key={`feed-${displayedUser!.alias}`}
              presenterFactory={(view: PagedItemView<Status>) =>
                new FeedPresenter(view)
              }
              featureUrl="feed"
            />
          }
        />
        <Route
          path="story/:displayedUser"
          element={
            <ItemScroller<
              Status,
              StatusService,
              PagedItemPresenter<Status, StatusService>
            >
              key={`story-${displayedUser!.alias}`}
              presenterFactory={(view: PagedItemView<Status>) =>
                new StoryPresenter(view)
              }
              featureUrl="story"
              itemComponentFactory={statusItemComponent}
            />
          }
        />
        <Route
          path="followees/:displayedUser"
          element={
            <ItemScroller<
              User,
              FollowService,
              PagedItemPresenter<User, FollowService>
            >
              key={`followees-${displayedUser!.alias}`}
              featureUrl="/followees"
              itemComponentFactory={userItemComponent}
              presenterFactory={(view: PagedItemView<User>) =>
                new FolloweePresenter(view)
              }
            />
          }
        />
        <Route
          path="followers/:displayedUser"
          element={
            <ItemScroller<
              User,
              FollowService,
              PagedItemPresenter<User, FollowService>
            >
              itemComponentFactory={userItemComponent}
              key={`followers-${displayedUser!.alias}`}
              featureUrl="/followers"
              presenterFactory={(view: PagedItemView<User>) =>
                new FollowerPresenter(view)
              }
            />
          }
        />
        <Route path="logout" element={<Navigate to="/login" />} />
        <Route
          path="*"
          element={<Navigate to={`/feed/${displayedUser!.alias}`} />}
        />
      </Route>
    </Routes>
  );
};

const UnauthenticatedRoutes = () => {
  const location = useLocation();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="*" element={<Login originalUrl={location.pathname} />} />
    </Routes>
  );
};

export default App;
