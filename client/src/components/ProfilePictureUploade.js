import { Component } from "react";
import axios from "../axios";

export default class ProfilePictureUploader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            file: null,
        };
        this.onFormSubmit = this.onFormSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
    }
    onFormSubmit(event) {
        event.preventDefault();
        axios.post("/api/upload_picture", this.state).then((response) => {
            console.log("[ProfilePictureUploader-imageurl]", response.data);
            console.log(
                "[ProfilePictureUploader-imageurl]",
                response.data.profile_url
            );
            this.props.onUpload(response.data.profile_url);
        });
    }

    onChange(event) {
        console.log("[file-image]", event.target.files[0]);
        this.setState({ file: event.target.files[0] });
    }

    render() {
        return (
            <div className="profile-picture-uploader">
                <div className="modal-content">
                    <button
                        className="modal-close"
                        onClick={this.props.onModalClose}
                    >
                        X
                    </button>
                    <form onSubmit={this.onFormSubmit}>
                        <h2>Upload your picture</h2>
                        <input type="file" onChange={this.onChange}></input>
                        <button type="submit">Upload</button>
                    </form>
                </div>
            </div>
        );
    }
}
