import ReactDOM from "react-dom";
import axios from "axios";
import Welcome from "./components/Welcome";

//ReactDOM.render(<HelloWorld />, document.querySelector("main"));

// function HelloWorld() {
//     return <div>Hello, World!</div>;
// }
axios.get("/user/id.json").then(function ({ data }) {
    console.log("[userId]", data.userId);
    if (!data.userId) {
        ReactDOM.render(<Welcome />, document.querySelector("main"));
    } else {
        ReactDOM.render(
            <img src="/logo.gif" alt="logo" />,
            document.querySelector("main")
        );
    }
});
