// AI-assisted: see AI-ATTRIBUTION.md
import { Link } from "react-router-dom";
import { Status, Type } from "tweeter-shared";
import { userUserNavigation } from "../UserNavigationHook";

interface Props {
  status: Status;
  featurePath: string;
}

const Post = (props: Props) => {
  const { navigateToUser } = userUserNavigation();

  return (
    <>
      {props.status.segments.map((segment, index) =>
        segment.type === Type.alias ? (
          // A mention always opens that user's story. The path must start
          // with "/" so it isn't resolved relative to the current page.
          <Link
            key={index}
            to={`/story/${segment.text}`}
            onClick={navigateToUser}
          >
            {segment.text}
          </Link>
        ) : segment.type === Type.url ? (
          <a
            key={index}
            href={segment.text}
            target="_blank"
            rel="noopener noreferrer"
          >
            {segment.text}
          </a>
        ) : segment.type === Type.newline ? (
          <br key={index} />
        ) : (
          segment.text
        )
      )}
    </>
  );
};

export default Post;
