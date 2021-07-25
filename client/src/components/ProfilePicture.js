const defaultImage = "../avatar.png";
export default function ProfilePicture({
    firstName,
    lastName,
    profileUrl,
    onClick,
    className,
}) {
    return (
        <div className="profile-picture">
            <img
                className={className}
                src={profileUrl || defaultImage}
                alt={`${firstName} ${lastName}`}
                onClick={onClick}
            ></img>
        </div>
    );
}
