import { Component } from "react";
import axios from "../axios";

const defaultImage = "../avatar.png";
export default class OtherProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: "",
            firstName: "",
            lastName: "",
            profileUrl: "",
            bio: "",
        };
    }
    componentDidMount() {
        const id = this.props.match.params.id;
        axios.get("/api/user" + id).then((response) => {
            if (!response.data) {
                this.props.history.push("/");
                return;
            }
            this.setState({
                id: response.data.id,
                firstName: response.data.firstName,
                lastName: response.data.lastName,
                profileUrl: response.data.profileUrl,
                bio: response.data.bio,
            });
        });
    }

    render() {
        return (
            <div className="other-profile">
                <img
                    src={this.state.profileUrl || defaultImage}
                    alt={`${this.state.firstName} ${this.state.lastName}`}
                ></img>
                <h3>
                    {this.state.firstName} {this.state.lastName}
                </h3>
                <p>{this.state.bio}</p>
            </div>
        );
    }
}
