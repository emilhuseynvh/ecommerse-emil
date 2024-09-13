const { S3Client, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const multer = require('multer');
const multerS3 = require('multer-s3');

const AWS_REGION = process.env.AWS_REGION;
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;

if (!AWS_REGION || !AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY) {
    throw new Error("AWS environment variables are not set.");
}

const s3 = new S3Client({
    region: AWS_REGION,
    credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY,
    }
});

const deleteImage = async (req, res) => {
    const { filename } = req.params;
    if (!filename || typeof filename !== 'string') {
        return res.status(400).json({ error: "Filename must be provided as a string." });
    }

    try {
        const deleteParams = {
            Bucket: "telefonclubb",
            Key: filename
        };

        await s3.send(new DeleteObjectCommand(deleteParams));

        console.log(`Successfully deleted image: ${filename}`);
        res.status(200).json({ message: `Successfully deleted image: ${filename}` });
    } catch (error) {
        if (error instanceof Error) {
            console.error("Error deleting image:", error.message);
            res.status(500).json({ error: `Failed to delete image: ${error.message}` });
        } else {
            console.error("Unknown error deleting image:", error);
            res.status(500).json({ error: "An unknown error occurred." });
        }
    }
};

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'telefonclubb',
        key: function (req, file, cb) {
            cb(null, `${Date.now()}-${file.originalname}`);
        }
    })
});

module.exports = { deleteImage, upload };
