const express = require("express");
const compression = require("compression");
const path = require("path");
const cookieSession = require("cookie-session");
const cryptoRandomString = require("crypto-random-string");
const { hashPassword } = require("../hashPassword.js");
const { login } = require("../login.js");
const { sendEmail } = require("../ses");
const csurf = require("csurf");
const { s3Upload } = require("../s3");
const { uploader } = require("./upload");
const {
    createUser,
    createOneTimePassword,
    getCodeByEmail,
    getUserByEmail,
    updatePassword,
    getUserById,
    updateUserProfile,
} = require("../db");

const app = express();

app.use(compression());

//middleware for the request.body
app.use(express.urlencoded({ extended: false }));
//middleware for the json(request.body)
app.use(express.json());
//cookie-session middleware
app.use(
    cookieSession({
        secret: `I'm always angry.`,
        maxAge: 1000 * 60 * 60 * 24 * 14,
    })
);
//csurf middle ware
app.use(csurf());

app.use(function (req, res, next) {
    res.cookie("mytoken", req.csrfToken());
    next();
});
//middle ware of path
app.use(express.static(path.join(__dirname, "..", "client", "public")));

app.get("/user/id.json", function (request, response) {
    response.json({
        id: request.session.userId,
    });
    console.log("[id.json]");
});

//register page
app.post("/api/register", (request, response) => {
    let emailTaken;
    const { first_name, last_name, email, password } = request.body;
    //console.log("[request-body]", request.body);

    if (!first_name || !last_name || !email || !password) {
        //response.sendStatus(500);
        response.json({ emailTaken: "Please fill in valid details!!" });
    } else {
        hashPassword(password).then((password_hash) => {
            console.log("password_hash", password_hash);
            return createUser({
                first_name,
                last_name,
                email,
                password_hash,
            })
                .then((user) => {
                    //console.log("[User]", user);
                    //console.log("[user-id]", request.session.userId);
                    request.session.userId = user.id;
                    //console.log("hello", user.id);
                    response.json(user);
                })
                .catch((error) => {
                    if (error.constraint === "users_email_key") {
                        console.log("[error-in-createUser]", error);
                        response.json({ errorMessage: emailTaken });
                        return;
                    }
                    console.log("[error-in register]", error);
                });
        });
    }
    //if values are present
});
// //faking login
// function login({ email, password }) {
//     return Promise.resolve({ id: 1 });
// }
//login page
app.post("/api/login", (request, response) => {
    const { email, password } = request.body;
    let errorMessage;
    if (!email || !password) {
        response.json({ errorMessage: "Wrong Credentials" });
        return;
    }
    login(email, password)
        .then((user) => {
            console.log("[user-in-login]", user);
            console.log("[user-id-in-login]", request.session.userId);
            request.session.userId = user.id;
            response.json(user);
        })
        .catch((error) => {
            console.log("[/api/login-error]", error);
            response.json({ error: errorMessage });
            response.statusCode = 400;
        });
});

//password reset part-1
app.post("/api/password/reset/start", (request, response) => {
    const { email } = request.body;
    const code = cryptoRandomString({ length: 6 });
    getUserByEmail(email)
        .then((foundUser) => {
            if (!foundUser) {
                response.statusCode = 400;
                response.json({ message: "Please Register!!" });
                return;
            }
            console.log("[hello]", code);
            sendEmail(email, code);
            createOneTimePassword({ email, code })
                .then(() => {
                    console.log("[email]", email);
                    response.statusCode = 200;
                    response.json({ message: "Success!!" });
                })
                .catch((error) => {
                    console.log("[error-in-createOneTimePassword]", error);
                    response.statusCode = 500;
                });
        })
        .catch((error) => {
            console.log("[error-in-getUserByEmail]", error);
            response.statusCode = 500;
        });
});

//verfication
app.post("/api/password/reset/verify", (request, response) => {
    console.log("[request-body-/api/password/reset/verify]", request.body);
    const { email, password } = request.body;
    getCodeByEmail({ ...request.body })
        .then((result) => {
            if (!result) {
                response.statusCode = 400;
                response.json({ message: "Something went wrong!!" });
                return;
            }
            if (result.code === request.body.code) {
                updatePassword({ password, email })
                    .then(() => {
                        console.log("[RESET SUCCESSFULL!!]");
                        response.statusCode = 200;
                        response.json({ message: "Successful!!" });
                    })
                    .catch((error) => {
                        console.log("[error-in-updatePassword]", error);
                        response.statusCode = 500;
                    });
            }
        })
        .catch((error) => {
            console.log("[error-in-getCodeByEmail]", error);
            response.statusCode = 500;
        });
});

app.get("/api/user", (request, response) => {
    const id = request.session.userId;
    getUserById(id)
        .then((user) => {
            if (!user) {
                response.statusCode = 400;
                response.json({ message: "Something went wrong" });
                return;
            }
            console.log("[user-getUserById]", user);
            response.json({
                userId: user.id,
                firstName: user.first_name,
                lastName: user.last_name,
                profileUrl: user.profile_url,
            });
        })
        .catch((error) => {
            console.log("[error-in-getUserById]", error);
            response.statusCode = 500;
        });
});

app.post(
    "/api/upload_picture",
    uploader.single("file"),
    s3Upload,
    (request, response) => {
        const id = request.session.userId;
        const { filename } = request.file;
        const profileUrl = `https://s3.amazonaws.com/spicedling/${filename}`;
        updateUserProfile({ profileUrl, id })
            .then((result) => {
                if (!result) {
                    response.statusCode = 400;
                    response.json({ message: "Something went wrong!!" });
                    return;
                }
                console.log(
                    "[profilePicURL-updateUserProfile]",
                    result.profileUrl
                );
                console.log("[is-updateUserProfile]", result.id);
                response.json({ profileUrl });
            })
            .catch((error) => {
                console.log("[error-in-updateUserProfile]", error);
                response.statusCode = 500;
            });
    }
);

app.get("*", function (request, response) {
    response.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

app.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});
