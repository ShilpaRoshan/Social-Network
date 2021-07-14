const defaultImage = "../avatar.png";
export default function ProfilePicture({
    firstName,
    lastName,
    profileUrl,
    onClick,
}) {
    return (
        <img
            className="profile-picture"
            src={profileUrl || defaultImage}
            alt={`${firstName} ${lastName}`}
            onClick={onClick}
        ></img>
    );
}
