import { useContext, useEffect, useState } from "react";
import YouTube, { YouTubeEvent, YouTubeProps } from "react-youtube";
import { mediaStore } from "../../store/mediaStore";
import { getYoutubeVideoId } from "../../utils/utils";

const YoutubeContainer = () => {
  const { state, dispatch } = useContext(mediaStore);
  const [player, setPlayer] = useState<any>(null);
  const [videoId, setVideoId] = useState<string>("");

  useEffect(() => {
    if (state.url) {
      setVideoId(getYoutubeVideoId(state.url));
    }
  }, [state.url]);

  useEffect(() => {
    if (player && state.seconds !== -1) {
      player.seekTo(state.seconds);
    }
  }, [player, state]);

  const onPlayerReady: YouTubeProps["onReady"] = (event: YouTubeEvent) => {
    setPlayer(event.target);
  };

  const opts: YouTubeProps["opts"] = {
    // height: "390",
    // width: "640",
    width: "100%",
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 0,
      start: 0.1,
    },
  };

  return videoId ? (
    <YouTube videoId={videoId} opts={opts} onReady={onPlayerReady} />
  ) : (
    <div>Please select a Youtube video</div>
  );
};

export default YoutubeContainer;
