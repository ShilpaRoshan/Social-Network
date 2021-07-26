import ProfilePicture from "./ProfilePicture";
import BioEditor from "./BioEditor";

export default function Profile({
    firstName,
    lastName,
    profileUrl,
    bio,
    onBioChange,
}) {
    return (
        <div className="profile">
            <ProfilePicture
                firstName={firstName}
                lastName={lastName}
                profileUrl={profileUrl}
                className="bigProfilepic"
            />
            <h2 className="user-name">
                {firstName} {lastName}
            </h2>

            <BioEditor bio={bio} onBioChange={onBioChange}></BioEditor>
        </div>
    );
}
