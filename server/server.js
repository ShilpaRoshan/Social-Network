const express = require("express");
const compression = require("compression");
const path = require("path");
const cookieSession = require("cookie-session");
const { hashPassword } = require("../hashPassword.js");
const { createUser } = require("../db");

const app = express();
app.use(compression());

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
app.use(express.static(path.join(__dirname, "..", "client", "public")));

app.get("/user/id.json", function (request, response) {
    response.json({
        id: request.session.userId,
    });
});

//register page
app.post("/api/register", (request, response) => {
    const { first_name, last_name, email, password } = request.body;
    console.log("[request-body]", request.body);

    if (!first_name || !last_name || !email || !password) {
        //response.sendStatus(500);
        response.json({ error: "Please fill in valid details!!" });
    } else {
        hashPassword(password).then((password_hash) => {
            console.log("password_hash", password_hash);
            return createUser({
                first_name,
                last_name,
                email,
                password_hash,
            }).then((user) => {
                console.log("[user-id]", request.session.userId);
                request.session.userId = user.id;

                response.json(user);
            });
        });
    }
    //if values are present
});

app.get("*", function (request, response) {
    response.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

app.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});
