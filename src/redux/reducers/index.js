import { combineReducers } from "redux";
import user from "./user_reducer";
import chatroom from "./chatroom_reducer";

const rootReducer = combineReducers({
  user,
  chatroom,
});

export default rootReducer;
