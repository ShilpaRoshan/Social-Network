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
    updateUserBio,
    getMostRecentUsers,
    getUserBySearch,
    getUserRelationship,
    addFriendRequest,
    updateFriendship,
    deleteFriendship,
    getFriendsAndWannabes,
    addChatMessage,
    getChatHistory,
} = require("../db");

const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server, {
    allowRequest: (req, callback) =>
        callback(null, req.headers.referer.startsWith("http://localhost:3000")),
});
const cookieSessionMiddleware = cookieSession({
    secret: `I'm always angry.`,
    maxAge: 1000 * 60 * 60 * 24 * 90,
});
app.use(cookieSessionMiddleware);

io.use(function (socket, next) {
    console.log("[hello-in-io-use]");
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});

app.use(compression());

//middleware for the request.body
app.use(express.urlencoded({ extended: false }));
//middleware for the json(request.body)
app.use(express.json());
// //cookie-session middleware
// app.use(
//     cookieSession({
//         secret: `I'm always angry.`,
//         maxAge: 1000 * 60 * 60 * 24 * 14,
//     })
// );

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
    console.log("[id.json]", request.session.userId);
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
            console.log("[user-id-in-login..]", request.session.userId);
            request.session.userId = user.id;
            response.json(user);
        })
        .catch((error) => {
            console.log("[/api/login-error]", error);
            response.json({ error: errorMessage });
            response.statusCode = 400;
        });
});

app.post("/api/logout", (request, response) => {
    console.log("[logout]");
    request.session.userId = null;
    response.statusCode = 200;
    response.json({ message: "logout successful" });
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
            //console.log("[user-getUserById]", user);
            response.json({
                userId: user.id,
                firstName: user.first_name,
                lastName: user.last_name,
                profileUrl: user.profile_url,
                bio: user.bio,
            });
        })
        .catch((error) => {
            console.log("[error-in-getUserById]", error);
            response.statusCode = 500;
        });
});

app.put("/api/user", (request, response) => {
    const { bio } = request.body;
    const id = request.session.userId;
    updateUserBio({ bio, id })
        .then((result) => {
            if (!result) {
                response.statusCode = 400;
                response.json({
                    message: "Something went wrong while updating bio",
                });
                return;
            }
            console.log("[updateUserBio-bio & id]", result.bio, result.id);
            response.json({ bio });
        })
        .catch((error) => {
            console.log("[error-in-updateUserBio]", error);
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
app.get("/api/user/:id", (request, response) => {
    const id = request.params.id;
    getUserById(id).then((result) => {
        console.log("[result-/api/user/:id]", result);
        if (!result) {
            response.statusCode = 404;
            response.json({ message: "Not found" });
            return;
        }
        response.json({
            id: result.id,
            firstName: result.first_name,
            lastName: result.last_name,
            profileUrl: result.profile_url,
            bio: result.bio,
        });
    });
});

app.get("/api/users/most-recent", (request, response) => {
    getMostRecentUsers().then((user) => {
        console.log("[getMostRecentUsers]", user);
        response.json(user);
    });
});
app.get("/api/users/search", (request, response) => {
    const { value } = request.query;
    console.log("[/api/users/search-query]", request.query);
    console.log("[/api/users/search-query]", value);

    getUserBySearch(value).then((user) => {
        response.json(user);
    });
});

app.get("/api/user/:id/relationship", (request, response) => {
    const firstId = request.session.userId;
    const secondId = request.params.id;
    console.log("[firstId-in-getUserRelationship]", firstId);
    console.log("[secondId-in-getUserRelationship]", secondId);
    getUserRelationship({
        firstId: request.session.userId,
        secondId: request.params.id,
    }).then((friendship) => {
        console.log("[friendship-before]", friendship);
        if (!friendship) {
            response.statusCode = 404;
            response.json({ message: "No relationship" });
            return;
        }
        console.log("[friendship]", friendship);
        response.json(friendship);
    });
});

app.post("/api/user/:id/relationship", (request, response) => {
    // const firstId = request.session.userId;
    // const secondId = request.params.id;
    console.log("[senderId-in-post]", request.session.userId);
    console.log("[receiverId]-in-post", request.params.id);

    addFriendRequest({
        senderId: request.session.userId,
        receiverId: request.params.id,
    }).then((friend) => {
        console.log("[addFriendRequest-friend]", friend);
        response.json(friend);
    });
});

app.put("/api/user/:id/relationship", (request, response) => {
    const firstId = request.session.userId;
    const secondId = request.params.id;
    console.log("[firstId-in-post]", firstId);
    console.log("[secondId]-in-post", secondId);

    updateFriendship({
        senderId: request.session.userId,
        receiverId: request.params.id,
    }).then((friend) => {
        console.log("[updateFriendship-friend-server]", friend);
        response.json(friend);
    });
});

app.delete("/api/user/:id/relationship", (request, response) => {
    const firstId = request.session.userId;
    const secondId = request.params.id;
    console.log("[firstId-in-delete]", firstId);
    console.log("[secondId-in-delete]", secondId);

    deleteFriendship({
        firstId: request.session.userId,
        secondId: request.params.id,
    })
        .then((friend) => {
            console.log("[deleteFriendship-friend-server]", friend);
            response.json(friend);
        })
        .catch((error) => {
            console.log("[deleteFriendship-friend-server-error]", error);
        });
});

app.get("/api/friends_and_wannabes", (request, response) => {
    console.log("request.session in server", request.session);
    getFriendsAndWannabes({ ...request.session })
        .then((result) => {
            console.log("[getFriendsAndWannabes-result]", result);
            response.json(result);
        })
        .catch((error) => {
            console.log("[getFriendsAndWannabes]", error);
        });
});

io.on("connection", (socket) => {
    const id = socket.request.session.userId;
    console.log(
        `[socket.io] incoming connectionwith id ${socket.id}, and userId : ${id}`
    );
    if (!id) {
        return socket.disconnect(true);
    }
    //from sender-client only
    getChatHistory().then((messages) => {
        console.log("[messages-server-getChatHistory]", messages);
        socket.emit("chatMessages", messages);
    });
    //eventListener,can be called on client to execute on server
    socket.on("chatMessage", (newMessage) => {
        const id = socket.request.session.userId;
        console.log("[sender_id,newMessage]", id, newMessage);
        addChatMessage({ message: newMessage, id })
            .then((messageId) => {
                console.log("[addMessage]", messageId);
                getUserById(id).then((user) => {
                    console.log("[id-user-addChatMessage]", user);
                    const newMessageInfo = {
                        first_name: user.first_name,
                        last_name: user.last_name,
                        profile_url: user.profile_url,
                        created_at: user.created_at,
                        message: newMessage,
                        id: messageId,
                    };
                    io.emit("chatMessage", newMessageInfo);
                });
            })
            .catch((error) => {
                console.log("[Error-in-socket-addChatMessage]", error);
            });
    });
});

app.get("*", function (request, response) {
    response.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

server.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});
