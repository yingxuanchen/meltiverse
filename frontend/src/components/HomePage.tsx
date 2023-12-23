import Sidebar from "./Sidebar";
import Body from "./Body";
import { Fragment } from "react";

const HomePage = () => {
  return (
    <Fragment>
      <Sidebar />
      <Body />
    </Fragment>
  );
};

export default HomePage;
