import { Component } from "react";
import axios from "axios";

export default class Registration extends Component {
    constructor(props) {
        super(props);
        this.state = {
            frist_name: null,
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
                window.location("/");
            })
            .catch((error) => {
                console.log("[registration-component-error]", error);
                this.setState({ error: error });
            });
    }

    onChange(event) {
        console.log(
            "[event.target.name]",
            ([event.target.name] = event.target.value)
        );
        this.setState({
            [event.target.name]: event.target.value,
        });
    }
    render() {
        return (
            <div className="Registration">
                <h1>Registration</h1>
                <form onSubmit={this.onFormSubmit}>
                    <label htmlFor="first_name">First Name</label>
                    <input
                        type="text"
                        name="first_name"
                        placeholder="First Name"
                        required
                        onChange={this.onChange}
                    />

                    <label htmlFor="last_name">Last Name</label>
                    <input
                        type="text"
                        name="last_name"
                        placeholder="Last Name"
                        required
                        onChange={this.onChange}
                    />

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

                    <button type="submit">Register</button>
                </form>
            </div>
        );
    }
}
