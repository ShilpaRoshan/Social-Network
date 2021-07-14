const aws = require("aws-sdk");
const fs = require("fs");

let secrets;
if (process.env.NODE_ENV == "production") {
    secrets = process.env; // in prod the secrets are environment variables
} else {
    secrets = require("./secrets"); // in dev they are in secrets.json which is listed in .gitignore
}

const s3 = new aws.S3({
    accessKeyId: secrets.AWS_KEY,
    secretAccessKey: secrets.AWS_SECRET,
});

const s3Upload = (request, response, next) => {
    console.log("[request.body]", request.body);
    console.log("[request.file]", request.file);
    if (!request.file) {
        console.log("No req.file!");
        return response.sendStatus(500);
    }
    const { filename, mimetype, size, path } = request.file;

    s3.putObject({
        Bucket: "spicedling",
        ACL: "public-read",
        Key: filename,
        Body: fs.createReadStream(path),
        ContentType: mimetype,
        ContentLength: size,
    })
        .promise()
        .then(() => next())
        .catch((error) => {
            console.log(error);
            response.sendStatus(500);
        });
};
module.exports = { s3Upload };
