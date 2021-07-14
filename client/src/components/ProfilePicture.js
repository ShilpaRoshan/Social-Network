export default function ProfilePicture({ first_name, last_name, profile_url }) {
    return (
        <img
            className="profile-picture"
            src={profile_url}
            alt={`${first_name} ${last_name}`}
        ></img>
    );
}
