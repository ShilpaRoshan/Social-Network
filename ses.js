const aws = require("aws-sdk");

let secrets;
if (process.env.NODE_ENV == "production") {
    secrets = process.env; // in prod the secrets are environment variables
} else {
    secrets = require("./secrets"); // in dev they are in secrets.json which is listed in .gitignore
}

const ses = new aws.SES({
    accessKeyId: secrets.AWS_KEY,
    secretAccessKey: secrets.AWS_SECRET,
    region: "eu-west-1",
});

exports.sendEmail = (to, code) => {
    return ses
        .sendEmail({
            Source: "Funky Chicken <periwinkle.charger@spicedling.email>",
            Destination: {
                ToAddresses: [to],
            },
            Message: {
                Body: {
                    Text: {
                        Data: `<p>Hello, Please copy paste the code ${code} .</p>`,
                    },
                },
                Subject: {
                    Data: "Reset The password",
                },
            },
        })
        .promise()
        .then(() => {
            console.log("[code]", code);
        });
};
