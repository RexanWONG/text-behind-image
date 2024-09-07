import { removeBackground } from '@imgly/background-removal-node'

export async function removeImageBackground(imgSource) {
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