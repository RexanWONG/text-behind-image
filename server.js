const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { removeImageBackground, addTextToImage, previewImage } = require('./api/bgremoval');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(bodyParser.json());

const port = process.env.PORT || 3000;

// 1. Remove background API
app.post('/api/remove-background', upload.single('image'), async (req, res) => {
    try {
        const imagePath = req.file.path;
        const resultDataURL = await removeImageBackground(imagePath);
        const outputPath = path.join('uploads', `bg_removed_${req.file.filename}.png`);
        
        fs.writeFileSync(outputPath, resultDataURL.split(';base64,').pop(), { encoding: 'base64' });
        
        res.json({ success: true, removedBgImagePath: outputPath, originalImagePath: imagePath });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// 2. Add text to image API
app.post('/api/add-text', async (req, res) => {
    try {
        const { imagePath, textParams } = req.body;
        const resultBuffer = await addTextToImage(imagePath, textParams);
        const outputPath = path.join('uploads', `text_added_${path.basename(imagePath)}`);
        
        fs.writeFileSync(outputPath, resultBuffer);
        
        res.json({ success: true, imagePath: outputPath });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// 3. Preview image API
app.post('/api/preview-image', async (req, res) => {
    try {
        const { originalImagePath, removedBgImagePath, textParams } = req.body;
        const finalBuffer = await previewImage(originalImagePath, removedBgImagePath, textParams);

        const finalPath = path.join('uploads', `preview_${path.basename(originalImagePath)}.png`);
        fs.writeFileSync(finalPath, finalBuffer);

        res.sendFile(finalPath, { root: __dirname });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

module.exports = app;
