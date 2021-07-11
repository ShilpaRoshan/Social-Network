import { HashRouter, Route } from "react-router-dom";
import Registration from "./Registraton";
import Login from "./Login";

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
            </HashRouter>
        </div>
    );
}
