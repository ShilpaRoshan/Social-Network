export default function ProfilePicture({
    firstName,
    lastName,
    profileUrl,
    onClick,
}) {
    return (
        <img
            className="profile-picture"
            src={`${profileUrl}`}
            alt={`${firstName} ${lastName}`}
            onClick={onClick}
        ></img>
    );
}
