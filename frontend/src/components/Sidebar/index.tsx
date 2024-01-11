import MaterialList from "./MaterialList";
import { Box, Drawer, Grid, IconButton, Tab, Tabs } from "@mui/material";
import TagList from "./TagList";
import { SyntheticEvent, useContext, useState } from "react";
import { contentStore } from "../../store/contentStore";
import { sidebarStore } from "../../store/sidebarStore";
import useWindowDimensions from "../../hooks/useWindowDimensions";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

const Sidebar = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const { state: sidebarState, dispatch: sidebarDispatch } =
    useContext(sidebarStore);
  const { state: contentState } = useContext(contentStore);
  const { height, width } = useWindowDimensions();

  const handleChangeTab = (event: SyntheticEvent, tabIndex: number) => {
    setTabIndex(tabIndex);
  };

  const handleCloseDrawer = () => {
    if (contentState.contentType !== null) {
      sidebarDispatch({
        type: "CLOSE",
      });
    }
  };

  return (
    <Drawer
      sx={{
        display: "block",
        "& .MuiDrawer-paper": {
          boxSizing: "border-box",
          width: width < 700 ? width : 700,
        },
      }}
      open={sidebarState.open}
      onClose={handleCloseDrawer}
    >
      {/* <Box sx={{ borderBottom: 1, borderColor: "divider" }}> */}
      <Grid container alignItems="center">
        <Grid item xs={1}></Grid>
        <Grid item xs={10}>
          <Tabs centered onChange={handleChangeTab} value={tabIndex}>
            <Tab label="Tags" />
            <Tab label="Materials" />
          </Tabs>
        </Grid>
        <Grid item xs={1}>
          <IconButton onClick={handleCloseDrawer}>
            <ChevronLeftIcon />
          </IconButton>
        </Grid>
      </Grid>
      {/* </Box> */}
      {tabIndex === 0 ? <TagList /> : <MaterialList />}
    </Drawer>
  );
};

export default Sidebar;
