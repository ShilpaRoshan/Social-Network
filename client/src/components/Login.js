import { Component } from "react";
import { Link } from "react-router-dom";
import axios from "../axios";

export default class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: null,
            password: null,
            error: null,
        };
        this.onFormSubmit = this.onFormSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
    }
    //event handlers
    onFormSubmit(event) {
        event.preventDefault();
        axios
            .post("/api/login", this.state)
            .then((response) => {
                console.log("response-in-login", response);
                window.location = "/";
            })
            .catch((error) => {
                //console.log("[login-error]", error.response.data);
                this.setState({ error: error.response.data.error });
            });
    }

    onChange(event) {
        // console.log(
        //     "[onChange-event]",
        //     ([event.target.name] = event.target.value)
        // );
        this.setState({
            [event.target.name]: event.target.value,
        });
    }

    render() {
        return (
            <div className="Login">
                <h1>Login</h1>
                <form onSubmit={this.onFormSubmit}>
                    <label htmlFor="email">E-mail</label>
                    <input
                        type="email"
                        name="email"
                        placeholder="E-mail"
                        required
                        onChange={this.onChange}
                    />

                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        required
                        onChange={this.onChange}
                    />
                    <div>
                        <button type="submit">Login</button>
                        <Link to="/api/password/reset/start">
                            Forgot Password Click here!!
                        </Link>
                    </div>
                </form>
                {this.state.errorMessage && (
                    <p className="error">{this.state.errorMessage}</p>
                )}
            </div>
        );
    }
}
