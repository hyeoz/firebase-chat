import React from "react";
import MainPanel from "./MainPanel/MainPanel";
import SidePanel from "./SidePanel/SidePanel";

export default function Chatpage() {
  return (
    <div style={{ display: "flex" }}>
      <div style={{ width: "300px" }}>
        <SidePanel />
      </div>
      <div style={{ width: "100%" }}>
        <MainPanel />
      </div>
    </div>
  );
}
