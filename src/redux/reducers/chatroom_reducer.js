import { SET_CURRENT_CHAT_ROOM } from "../actions/types";

const initialChatroomState = {
  currentChatroom: null,
};

// eslint-disable-next-line import/no-anonymous-default-export
export default (state = initialChatroomState, action) => {
  switch (action.type) {
    case SET_CURRENT_CHAT_ROOM:
      return {
        ...state,
        currentChatroom: action.payload,
      };
    default:
      return state;
  }
};
