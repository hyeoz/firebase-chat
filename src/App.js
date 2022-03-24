import "./App.css";
// !MM 에서 사용하는 v5 사용!
import { Route, Switch } from "react-router-dom";
import Chatpage from "./components/ChatPage/Chatpage";
import LoginPage from "./components/LoginPage/LoginPage";
import RegisterPage from "./components/RegisterPage/RegisterPage";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { getUser } from "./firebase";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUser, clearUser } from "./redux/actions/user_action";

function App() {
  const history = useHistory();
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.user.isLoading);

  useEffect(() => {
    onAuthStateChanged(getUser, (user) => {
      // console.log(user);
      if (user) {
        history.push("/");
        // 스토어에 저장
        dispatch(setUser(user));
      } else {
        history.push("/register");
        dispatch(clearUser());
      }
    });
  }, [dispatch, history]);

  if (isLoading) {
    return <div>로딩중입니다...</div>;
  } else {
    return (
      <Switch>
        <Route exact path="/" component={Chatpage} />
        <Route exact path="/login" component={LoginPage} />
        <Route exact path="/register" component={RegisterPage} />
      </Switch>
    );
  }
}

export default App;
