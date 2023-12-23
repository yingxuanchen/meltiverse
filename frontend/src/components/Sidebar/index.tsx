import MaterialList from "./MaterialList";
import { Box, Drawer, Tab, Tabs } from "@mui/material";
import TagList from "./TagList";
import { SyntheticEvent, useContext, useState } from "react";
import { contentStore } from "../../store/contentStore";
import { sidebarStore } from "../../store/sidebarStore";
import useWindowDimensions from "../../hooks/useWindowDimensions";

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
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs centered onChange={handleChangeTab} value={tabIndex}>
          <Tab label="Materials" />
          <Tab label="Tags" />
        </Tabs>
      </Box>
      {tabIndex === 0 ? <MaterialList /> : <TagList />}
    </Drawer>
  );
};

export default Sidebar;
