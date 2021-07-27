import { Component } from "react";
import ProfilePicture from "./ProfilePicture.js";
import ProfilePictureUploader from "./ProfilePictureUploade.js";
import Profile from "./Profile";
import { BrowserRouter, Route, Link, Switch } from "react-router-dom";
import OtherProfile from "./OtherProfile";
import FindPeople from "./FindPeople";
import Logout from "./Logout";
import Friends from "./Friends";
import Chat from "./Chat";
import axios from "../axios";

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: "",
            lastName: "",
            profileUrl: "",
            bio: "",
            showModal: false,
        };
        this.onProfilePictureClick = this.onProfilePictureClick.bind(this);
        this.onUpload = this.onUpload.bind(this);
        this.onModalClose = this.onModalClose.bind(this);
        this.onBioChange = this.onBioChange.bind(this);
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
                    bio: response.data.bio,
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
    onBioChange(newBio) {
        console.log("[App:onBioChange]", newBio);
        axios
            .put("/api/user", { bio: newBio })
            .then(() => {
                this.setState({ bio: newBio });
            })
            .catch((error) => {
                console.log("[App-onBioChange]", error);
            });
    }
    render() {
        return (
            <BrowserRouter>
                <div className="app">
                    <header>
                        <h4 className="logo-app">Logo</h4>

                        <nav>
                            <ul className="nav-links">
                                <li>
                                    <Link to="/" className="link-to">
                                        Home
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/users" className="link-to">
                                        Find People
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/friends" className="link-to">
                                        Friends
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/chat" className="link-to">
                                        Chat
                                    </Link>
                                </li>
                                <li>
                                    <Logout />
                                </li>
                            </ul>
                        </nav>

                        <ProfilePicture
                            firstName={this.state.firstName}
                            lastName={this.state.lastName}
                            profileUrl={this.state.profileUrl}
                            onClick={this.onProfilePictureClick}
                            className="picture-resize"
                        />
                    </header>

                    {this.state.showModal && (
                        <ProfilePictureUploader
                            onUpload={this.onUpload}
                            onModalClose={this.onModalClose}
                        />
                    )}
                    <Switch>
                        <Route exact path="/">
                            <Profile
                                firstName={this.state.firstName}
                                lastName={this.state.lastName}
                                profileUrl={this.state.profileUrl}
                                bio={this.state.bio}
                                onBioChange={this.onBioChange}
                            />
                        </Route>
                        <Route path="/users/:id" component={OtherProfile} />
                        <Route path="/users">
                            <FindPeople></FindPeople>
                        </Route>
                        <Route path="/friends">
                            <Friends></Friends>
                        </Route>
                        <Route path="/chat">
                            <Chat></Chat>
                        </Route>
                    </Switch>
                </div>
            </BrowserRouter>
        );
    }
}
