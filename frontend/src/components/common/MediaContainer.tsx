import { useContext, useEffect, useState } from "react";
import { mediaStore } from "../../store/mediaStore";
import YoutubeContainer from "./YoutubeContainer";
import IgContainer from "./IgContainer";

enum MediaType {
  Youtube,
  Ig,
}

const MediaContainer = () => {
  const { state, dispatch } = useContext(mediaStore);
  const [mediaType, setMediaType] = useState<MediaType | null>(null);

  useEffect(() => {
    if (state.url?.includes("youtube") || state.url?.includes("youtu.be")) {
      setMediaType(MediaType.Youtube);
    } else if (state.url?.includes("instagram")) {
      setMediaType(MediaType.Ig);
    }
  }, [state.url]);

  return mediaType === MediaType.Youtube ? (
    <YoutubeContainer />
  ) : mediaType === MediaType.Ig ? (
    <IgContainer />
  ) : (
    <h4>Not able to display media</h4>
  );
};

export default MediaContainer;
