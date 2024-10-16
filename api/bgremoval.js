// Importing necessary modules
const { removeBackground } = require('@imgly/background-removal-node');
const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');

// Function to remove background from an image
async function removeImageBackground(imgSource) {
    try {
        // Removing background
        const blob = await removeBackground(imgSource);

        // Converting Blob to buffer
        const buffer = Buffer.from(await blob.arrayBuffer());

        // Generating data URL
        const dataURL = `data:image/png;base64,${buffer.toString("base64")}`;
        
        // Returning the data URL
        return dataURL;
    } catch (error) {
        // Handling errors
        throw new Error('Error removing background: ' + error);
    }
}

// Function to add text to an image
async function addTextToImage(imagePath, textParams) {
    const image = await loadImage(imagePath);
    const canvas = createCanvas(image.width, image.height);
    const ctx = canvas.getContext('2d');

    ctx.drawImage(image, 0, 0);

    ctx.font = `${textParams.fontWeight} ${textParams.fontSize}px ${textParams.fontFamily}`;
    ctx.fillStyle = textParams.color;
    ctx.globalAlpha = textParams.opacity;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const x = canvas.width * (textParams.left + 50) / 100;
    const y = canvas.height * (50 - textParams.top) / 100;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((textParams.rotation * Math.PI) / 180);

    if (textParams.shadowSize > 0) {
        ctx.shadowColor = textParams.shadowColor;
        ctx.shadowBlur = textParams.shadowSize;
        ctx.shadowOffsetX = textParams.shadowSize;
        ctx.shadowOffsetY = textParams.shadowSize;
    }

    ctx.fillText(textParams.text, 0, 0);
    ctx.restore();

    return canvas.toBuffer('image/png');
}

// Function to preview an image
async function previewImage(originalImagePath, removedBgImagePath, textParams) {
    const originalImage = await loadImage(originalImagePath);
    const removedBgImage = await loadImage(removedBgImagePath);

    const canvas = createCanvas(originalImage.width, originalImage.height);
    const ctx = canvas.getContext('2d');

    // Draw original image with text
    const imageWithText = await addTextToImage(originalImagePath, textParams);
    const imageWithTextLoaded = await loadImage(imageWithText);
    ctx.drawImage(imageWithTextLoaded, 0, 0);

    // Draw removed background image on top
    ctx.globalCompositeOperation = 'source-atop';
    ctx.drawImage(removedBgImage, 0, 0);

    return canvas.toBuffer('image/png');
}

// Example usage
async function main() {
    try {
        // Path to the input image
        const imgSource = 'sample.png';

        // Removing background from the input image
        const resultDataURL = await removeImageBackground(imgSource);

        // Writing the result to a file (optional)
        fs.writeFileSync('output.png', resultDataURL.split(';base64,').pop(), { encoding: 'base64' });

        // Logging success message
        console.log('Background removed successfully.');
    } catch (error) {
        // Logging error message
        console.error('Error:', error.message);
    }
}

// Calling the main function
// main();

module.exports = { removeImageBackground, addTextToImage, previewImage };
