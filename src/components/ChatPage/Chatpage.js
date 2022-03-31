import React from "react";
import { useSelector } from "react-redux";
import MainPanel from "./MainPanel/MainPanel";
import SidePanel from "./SidePanel/SidePanel";

export default function Chatpage() {
  const currentChatroom = useSelector(
    (state) => state.chatroom.currentChatroom
  );

  return (
    <div style={{ display: "flex" }}>
      <div style={{ width: "300px" }}>
        <SidePanel />
      </div>
      <div style={{ width: "100%" }}>
        {/* key 값을 주어야 파이어베이스에서 인식한다고 하네용 */}
        <MainPanel key={currentChatroom?.id} />
      </div>
    </div>
  );
}
