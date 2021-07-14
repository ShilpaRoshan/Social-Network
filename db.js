const spicedPg = require("spiced-pg");
const { hashPassword } = require("./hashPassword");
const database = "socialnetwork";
console.log(`Connecting to database ${database}`);

function getDataBaseURL() {
    if (process.env.DATABASE_URL) {
        return process.env.DATABASE_URL;
    }
    const { username, password } = require("./secrets.json");
    return `postgres:${username}:${password}@localhost:5432/${database}`;
}
const db = spicedPg(getDataBaseURL());

//used in registration
function createUser({ first_name, last_name, email, password_hash }) {
    return db
        .query(
            "INSERT INTO users (first_name, last_name, email, password_hash) VALUES ($1, $2, $3, $4) RETURNING *",
            [first_name, last_name, email, password_hash]
        )
        .then((result) => {
            return result.rows[0];
        });
}
//to use in login
function getUserByEmail(email) {
    return db
        .query(`SELECT * FROM users WHERE email LIKE $1`, [email])
        .then((result) => {
            console.log("[getUserByEmail-db-file]", result.rows[0]);
            return result.rows[0];
        });
}
//for storing OTP
function createOneTimePassword({ email, code }) {
    return db
        .query(
            `INSERT INTO reset_password (email, code) VALUES ($1, $2) RETURNING *`,
            [email, code]
        )
        .then((result) => {
            return result.rows[0];
        });
}
//filtering by email to use in password verification
function getCodeByEmail({ email, code }) {
    return db
        .query(
            `SELECT * FROM reset_password WHERE CURRENT_TIMESTAMP - created_at < INTERVAL '10 minutes' AND email LIKE $1 AND code LIKE $2`,
            [email, code]
        )
        .then((result) => {
            return result.rows[0];
        });
}
//to use in password verification and update the password
function updatePassword({ password, email }) {
    return hashPassword(password).then((password_hash) => {
        return db
            .query(
                `UPDATE users SET password_hash = $1 WHERE email = $2 RETURNING * `,
                [password_hash, email]
            )
            .then((result) => {
                console.log("[update the password]", result);
                return result.rows[0];
            });
    });
}

function getUserById(id) {
    return db
        .query(`SELECT * FROM users WHERE id = $1`, [id])
        .then((result) => {
            return result.rows[0];
        });
}

function updateUserProfile({ profileUrl, id }) {
    return db
        .query(`UPDATE users SET profile_url = $1 WHERE id = $2 RETURNING *`, [
            profileUrl,
            id,
        ])
        .then((result) => {
            return result.rows[0];
        });
}

module.exports = {
    createUser,
    getUserByEmail,
    createOneTimePassword,
    getCodeByEmail,
    updatePassword,
    getUserById,
    updateUserProfile,
};
