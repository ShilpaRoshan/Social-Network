const express = require("express");
const compression = require("compression");
const path = require("path");
const cookieSession = require("cookie-session");
const { hashPassword } = require("../hashPassword.js");
const { createUser } = require("../db");

const app = express();
app.use(compression());

app.use(express.static(path.join(__dirname, "..", "client", "public")));
//middleware for the request.body
app.use(express.urlencoded({ extended: false }));
//middleware for the json(request.body)
app.use(express.json());

app.use(
    cookieSession({
        secret: `I'm always angry.`,
        maxAge: 1000 * 60 * 60 * 24 * 14,
    })
);

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

//register page
app.post("/api/register", (request, response) => {
    const { first_name, last_name, email, password } = request.body;
    let message;
    if (!first_name || !last_name || !email || !password) {
        message = `Please fill in the details`;
    }
    if (message) {
        response.render("/api/register", { message });
    }
    //if values are present
    hashPassword(request.body.password).then((password_hash) => {
        console.log("password_hash", password_hash);
        return createUser({ first_name, last_name, email, password_hash }).then(
            (user) => {
                console.log("[user-id]", request.session.user_id);
                request.session.user_id = user.id;
                console.log("[user-json]", response.json(user));
                response.json(user);
            }
        );
    });
});

app.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});
