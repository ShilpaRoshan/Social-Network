import { Component } from "react";
import axios from "../axios";
import { Link } from "react-router-dom";

export default class ResetPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            step: 1,
            error: null,
            email: null,
        };
        this.onFormSubmitStepOne = this.onFormSubmitStepOne.bind(this);
        this.onFormSubmitStepTwo = this.onFormSubmitStepTwo.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    onFormSubmitStepOne(event) {
        event.preventDefault();
        axios
            .post("/api/password/reset/start", this.state)
            .then((response) => {
                console.log("[reset-password-step1]", response.data);
                this.setState({ step: 2 });
            })
            .catch((error) => {
                console.log(
                    "[error-in-reset-password-step1]",
                    error.response.data
                );
                this.setState({ error: error.response.data.message });
            });
    }

    onFormSubmitStepTwo(event) {
        event.preventDefault();
        axios
            .post("/api/password/reset/verify", this.state)
            .then((response) => {
                console.log("[reset-password-step2]", response.data);
                this.setState({ step: 3 });
            })
            .catch((error) => {
                console.log(
                    "[error-in-reset-password-step2]",
                    error.response.data.message
                );
                this.setState({ error: error.response.data.message });
            });
    }
    onChange(event) {
        this.setState({
            [event.target.name]: event.target.value,
        });
    }

    render() {
        if (this.state.step == 1) {
            return (
                <div className="reset-password-step-1">
                    <h3>Welcome to reset-password page!!</h3>
                    <p>Please enter email address with which you registered.</p>
                    <div className="step1-container">
                        <form onSubmit={this.onFormSubmitStepOne}>
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                name="email"
                                placeholder="E-mail"
                                required
                                onChange={this.onChange}
                            />
                            <div>
                                <button type="submit">Submit</button>
                                {this.state.error && (
                                    <p className="error">{this.state.error}</p>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            );
        }
        if (this.state.step == 2) {
            return (
                <div className="reset-password-step-2">
                    <h3>Welcome to reset-password page(step-2)!!</h3>
                    <p>Please enter the code you received.</p>
                    <div className="step2-container">
                        <form onSubmit={this.onFormSubmitStepTwo}>
                            <label htmlFor="code">OTP</label>
                            <input
                                type="text"
                                name="code"
                                placeholder="One-Time-Password"
                                required
                                onChange={this.onChange}
                            />
                            <p>Please enter the New Password</p>
                            <label htmlFor="password">New Password</label>
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                required
                                onChange={this.onChange}
                            />
                            <div>
                                <button type="submit">Submit</button>
                                {this.state.error && (
                                    <p className="error">{this.state.error}</p>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            );
        }

        if (this.state.step == 3) {
            return (
                <div className="reset-password-step-3">
                    <h3>Welcome to reset-password page(step-3)!!</h3>
                    <h2>Password reset was scuccessful!!</h2>
                    <div>
                        <Link to="/login">Click here to Log in!</Link>
                    </div>
                </div>
            );
        }
    }
}
