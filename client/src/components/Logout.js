import { Component } from "react";
import axios from "../axios";

export default class Logout extends Component {
    constructor() {
        super();
        this.onFormSubmit = this.onFormSubmit.bind(this);
    }
    onFormSubmit(event) {
        event.preventDefault();
        axios.post("/api/logout").then(() => (window.location = "/"));
    }

    render() {
        return (
            <div className="logout">
                <form onSubmit={this.onFormSubmit}>
                    <button type="submit">Logout</button>
                </form>
            </div>
        );
    }
}
