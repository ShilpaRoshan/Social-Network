import { Component } from "react";
import ProfilePicture from "./ProfilePicture.js";
import ProfilePictureUploader from "./ProfilePictureUploade.js";
import axios from "../axios";

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            first_name: "",
            last_name: "",
            profile_url: "",
        };
        this.onProfilePictureClick = this.onProfilePictureClick.bind(this);
        this.onUpload = this.onUpload.bind(this);
    }
    componentDidMount() {
        axios
            .get("/api/user", this.state)
            .then((response) => {
                console.log("[componentDidMount-App]", response.data);
                this.setState({ ...response.data });
            })
            .catch((error) => {
                console.log(
                    "[/api/user-componentDidMount]",
                    error.response.data
                );
            });
    }
    onProfilePictureClick() {
        console.log("[App]onProfilePictureClick", this);
        this.setState({ showModal: true });
    }

    onUpload(newProfileUrl) {
        this.setState({ profile_url: newProfileUrl });
        console.log("[profile_url-[App]]", this.state.profile_url);
    }

    onModalClose() {
        this.setState({ showModal: false });
    }
    render() {
        return (
            <div className="app">
                <header>
                    <span className="logo">Logo</span>
                    <ProfilePicture
                        first_name={this.state.first_name}
                        last_name={this.state.last_name}
                        profile_url={this.state.profile_url}
                        onClick={this.onProfilePictureClick}
                    />
                </header>
                {this.state.showModal && <ProfilePictureUploader />}
            </div>
        );
    }
}
