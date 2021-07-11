const { compare } = require("bcryptjs");
const { getUserByEmail } = require("./db");

function login(email, password) {
    return getUserByEmail(email).then((foundUser) => {
        console.log("[loginfile-getUserByEmail]", foundUser);
        if (!foundUser) {
            return null;
        }
        return compare(password, foundUser.password_hash).then((match) => {
            console.log("[login-file-compare-match]", match);
            if (!match) {
                return null;
            }
            console.log("[founduser]", foundUser);
            return foundUser;
        });
    });
}

module.exports = {
    login,
};
