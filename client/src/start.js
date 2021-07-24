import ReactDOM from "react-dom";
import axios from "./axios";
import Welcome from "./components/Welcome";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import reduxPromise from "redux-promise";
import { composeWithDevTools } from "redux-devtools-extension";
import reducer from "./Reducer/reducer";
import App from "./components/App";
import { init } from "./socket";
//store
const store = createStore(
    reducer,
    composeWithDevTools(applyMiddleware(reduxPromise))
);

axios.get("/user/id.json").then((response) => {
    console.log("[userId]", response.data.id);
    //user logged-in
    if (response.data.id) {
        ReactDOM.render(
            <Provider store={store}>
                <App />
            </Provider>,
            document.querySelector("main")
        );
        init(store);
        return;
    }
    //user logged out
    ReactDOM.render(<Welcome />, document.querySelector("main"));
});
