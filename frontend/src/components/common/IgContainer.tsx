import { InstagramEmbed } from "react-social-media-embed";
import { mediaStore } from "../../store/mediaStore";
import { useContext, useEffect, useState } from "react";

const IgContainer = () => {
  const { state, dispatch } = useContext(mediaStore);
  const [url, setUrl] = useState<string>("");

  useEffect(() => {
    if (state.url && !url) {
      setUrl(state.url);
    } else if (state.url && state.url !== url) {
      setUrl("");
    }
  }, [state.url, url]);

  return url === "" ? (
    <h4>reloading...</h4>
  ) : (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <InstagramEmbed url={url} width="75%" />
    </div>
  );
};

export default IgContainer;
