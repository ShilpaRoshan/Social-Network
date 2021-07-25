import { HashRouter, Route } from "react-router-dom";
import Registration from "./Registraton";
import Login from "./Login";
import ResetPassword from "./ResetPassword";
const logo = "../social-network.jpg";

export default function Welcome() {
    return (
        <>
            <h1>Social Network</h1>
            <div className="welcome">
                <img className="logo" src={logo}></img>
                <HashRouter>
                    <Route path="/" exact>
                        <Registration />
                    </Route>
                    <Route path="/login">
                        <Login />
                    </Route>
                    <Route path="/api/password/reset/start">
                        <ResetPassword />
                    </Route>
                </HashRouter>
            </div>
        </>
    );
}
