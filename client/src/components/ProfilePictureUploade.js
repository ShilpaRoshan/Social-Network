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
        const data = new FormData();
        data.append("file", this.state.file);
        axios.post("/api/upload_picture", data).then((response) => {
            console.log("[ProfilePictureUploader-imageurl]", response.data);
            console.log(
                "[ProfilePictureUploader-imageurl]",
                response.data.profileUrl
            );
            this.props.onUpload(response.data.profileUrl);
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
