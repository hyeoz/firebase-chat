import { SET_CURRENT_CHAT_ROOM } from "./types";

export const setCurrentChatRoom = (currnetChatroom) => {
  return {
    type: SET_CURRENT_CHAT_ROOM,
    payload: currnetChatroom,
  };
};
