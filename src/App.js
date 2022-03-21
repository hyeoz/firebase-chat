import "./App.css";
// !MM 에서 사용하는 v5 사용!
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import Chatpage from "./components/ChatPage/Chatpage";
import LoginPage from "./components/LoginPage/LoginPage";
import RegisterPage from "./components/RegisterPage/RegisterPage";

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Chatpage} />
        <Route exact path="/login" component={LoginPage} />
        <Route exact path="/register" component={RegisterPage} />
      </Switch>
    </Router>
  );
}

export default App;
