import { Component } from "react";
import { Link } from "react-router-dom";
import axios from "../axios";

export default class Registration extends Component {
    constructor(props) {
        super(props);
        this.state = {
            first_name: null,
            last_name: null,
            email: null,
            password: null,
        };
        this.onFormSubmit = this.onFormSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
    }
    //form submit handler
    onFormSubmit(event) {
        event.preventDefault();
        axios
            .post("/api/register", this.state)
            .then((response) => {
                console.log("[response-in-onFormSubmit]", response);
                window.location = "/";
            })
            .catch((error) => {
                console.log(
                    "[registration-component-error]",
                    error.response.data
                );
                this.setState({ error: error.response.data.error });
            });
    }

    onChange(event) {
        // console.log(
        //     "[event.target.name]",
        //     ([event.target.name] = event.target.value)
        // );
        this.setState({
            [event.target.name]: event.target.value,
        });
    }
    render() {
        return (
            <div className="registration">
                <form
                    onSubmit={this.onFormSubmit}
                    className="registration-form"
                >
                    <h2 className="registration-header">Register Yourself!!</h2>
                    <label htmlFor="first_name" className="label">
                        First Name
                    </label>
                    <input
                        type="text"
                        name="first_name"
                        placeholder="First Name"
                        required
                        onChange={this.onChange}
                        className="input-value"
                    />

                    <label htmlFor="last_name" className="label">
                        Last Name
                    </label>
                    <input
                        type="text"
                        name="last_name"
                        placeholder="Last Name"
                        required
                        onChange={this.onChange}
                        className="input-value"
                    />

                    <label htmlFor="email" className="label">
                        E-mail
                    </label>
                    <input
                        type="email"
                        name="email"
                        placeholder="E-mail"
                        required
                        onChange={this.onChange}
                        className="input-value"
                    />

                    <label htmlFor="password" className="label">
                        Password
                    </label>
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        required
                        onChange={this.onChange}
                        className="input-value"
                    />
                    <div className="button-container">
                        <button type="submit" className="register-button">
                            Register
                        </button>
                        <Link to="/login" className="login-link">
                            LogIn
                        </Link>
                    </div>
                </form>
                {/* {this.state.errorMessage && (
                    <p className="error">{this.state.errorMessage}</p>
                )} */}
            </div>
        );
    }
}
