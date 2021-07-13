import { HashRouter, Route } from "react-router-dom";
import Registration from "./Registraton";
import Login from "./Login";
import ResetPassword from "./ResetPassword";

export default function Welcome() {
    return (
        <div className="welcome">
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
    );
}
