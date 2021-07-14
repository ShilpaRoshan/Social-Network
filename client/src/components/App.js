import { Component } from "react";
import ProfilePicture from "./ProfilePicture.js";
import ProfilePictureUploader from "./ProfilePictureUploade.js";
import axios from "../axios";

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: "",
            lastName: "",
            profileUrl: "",
            showModal: false,
        };
        this.onProfilePictureClick = this.onProfilePictureClick.bind(this);
        this.onUpload = this.onUpload.bind(this);
        this.onModalClose = this.onModalClose.bind(this);
    }
    componentDidMount() {
        axios
            .get("/api/user", this.state)
            .then((response) => {
                console.log("[componentDidMount-App]", response.data);
                this.setState({
                    firstName: response.data.firstName,
                    lastName: response.data.lastName,
                    profileUrl: response.data.profileUrl,
                });
            })
            .catch((error) => {
                console.log(
                    "[/api/user-componentDidMount]",
                    error.response.data
                );
            });
    }
    onProfilePictureClick() {
        console.log("[App]onProfilePictureClick", this.state);
        this.setState({ showModal: true });
    }

    onUpload(newProfileUrl) {
        console.log("[profile_url-[App]]", this.state.profileUrl);
        this.setState({ profileUrl: newProfileUrl, showModal: false });
    }

    onModalClose() {
        console.log("hello");
        this.setState({ showModal: false });
    }
    render() {
        return (
            <div className="app">
                <header>
                    <span className="logo">Logo</span>
                    <ProfilePicture
                        firstName={this.state.firstName}
                        lastName={this.state.lastName}
                        profileUrl={this.state.profileUrl}
                        onClick={this.onProfilePictureClick}
                    />
                </header>
                {this.state.showModal && (
                    <ProfilePictureUploader
                        onUpload={this.onUpload}
                        onModalClose={this.onModalClose}
                    />
                )}
            </div>
        );
    }
}
