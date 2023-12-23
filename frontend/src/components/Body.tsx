import { useContext } from "react";
import { contentStore } from "../store/contentStore";
import ViewMaterial from "./Material/ViewMaterial";
import ViewTag from "./Tag/ViewTag";
import ViewTagTimestamps from "./Material/ViewTagTimestamps";
import { Box, Grid } from "@mui/material";

const Body = () => {
  const { state } = useContext(contentStore);

  return (
    <Box sx={{ marginRight: "1em" }}>
      {state.contentType === null && <h4>Please select a Material or Tag</h4>}
      <Grid container spacing={2}>
        <Grid item xs={6}>
          {state.contentType === "VIEW_MATERIAL" && state.materialId && (
            <ViewTagTimestamps materialId={state.materialId} />
          )}
          {state.contentType === "VIEW_TAG" && state.tagId && (
            <ViewTag tagId={state.tagId} />
          )}
        </Grid>
        <Grid item xs={6}>
          {state.materialId ? (
            <ViewMaterial materialId={state.materialId} />
          ) : (
            <h4>Please select a Material</h4>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default Body;
