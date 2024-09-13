const express = require('express');
const auth = require('../middlewares/auth.middleware');
const { deleteImage, upload } = require('../middlewares/upload.middleware');

const router = express.Router();

router.post('/upload', auth, upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded.' });
    }

    res.status(200).json({
        message: 'File uploaded successfully.',
        file: req.file
    });
});

router.delete('/delete/:filename', auth, deleteImage);

module.exports = router;
