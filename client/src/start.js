import ReactDOM from "react-dom";
import axios from "./axios";
import Welcome from "./components/Welcome";

//ReactDOM.render(<HelloWorld />, document.querySelector("main"));

// function HelloWorld() {
//     return <div>Hello, World!</div>;
// }
//
axios.get("/user/id.json").then((response) => {
    console.log("[userId]", response.data.id);
    if (response.data.id) {
        ReactDOM.render(
            <div className="app">Welcome Back!</div>,
            document.querySelector("main")
        );

        return;
    }
    ReactDOM.render(<Welcome />, document.querySelector("main"));
});
