import { Component } from "react";
export default class BioEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isEditing: false,
            draftText: "",
        };
        this.onSubmit = this.onSubmit.bind(this);
        this.onEditButtonClick = this.onEditButtonClick.bind(this);
        this.onInput = this.onInput.bind(this);
    }
    onSubmit(event) {
        event.preventDefault();
        this.setState({
            isEditing: false,
        });
        this.props.onBioChange(this.state.draftText);
    }
    onEditButtonClick() {
        console.log("hello you can edit your bio!!");
        this.setState({
            isEditing: true,
            draftText: this.props.bio,
        });
    }
    onInput(event) {
        console.log("[text-area-values]", event.target.value);
        this.setState({
            draftText: event.target.value,
        });
    }
    renderEditMode() {
        return (
            <div>
                <form className="bio-edit" onSubmit={this.onSubmit}>
                    <textarea
                        className="bio-textarea"
                        name="bio-edit"
                        onInput={this.onInput}
                        defaultValue={this.props.bio}
                    ></textarea>
                    <button type="submit" className="save-button">
                        Save
                    </button>
                </form>
            </div>
        );
    }
    renderDisplayMode() {
        return (
            <div className="bio-edit-add-button-container">
                <p className="bio-para">{this.props.bio}</p>
                <button
                    onClick={this.onEditButtonClick}
                    className="edit-add-button"
                >
                    {this.props.bio ? "Edit Bio" : "Add Bio"}
                </button>
            </div>
        );
    }
    render() {
        return (
            <div className="bio-editor">
                {this.state.isEditing
                    ? this.renderEditMode()
                    : this.renderDisplayMode()}
            </div>
        );
    }
}
