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
            />
            <h2>
                {firstName} {lastName}
            </h2>
            <BioEditor bio={bio} onBioChange={onBioChange}></BioEditor>
        </div>
    );
}
