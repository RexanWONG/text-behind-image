    # API Documentation

    This document provides information on how to run the API endpoints for the Text Behind Image project. The API is built using Express.js and runs separately from the Next.js application to handle image processing tasks.

    ## Why a Separate API?

    A separate Express.js API is implemented for this project to address limitations in the current browser-based implementation:

    1. **Offload Computation**: The current implementation relies on the browser for all computation, which can be resource-intensive. A separate API allows these tasks to be performed server-side.

    2. **Performance**: Image processing is computationally expensive. An API offloads this work from the client, improving overall application performance.

    3. **Scalability**: A dedicated API enables independent scaling of image processing services as the application grows.

    4. **Broader Compatibility**: Server-side processing ensures the application works across various devices and browsers, regardless of their computational capabilities.

    5. **Resource Management**: Certain image processing libraries and operations are better suited for a controlled server environment than a browser context.

    ## Running the API

    To start the API server:

    1. Navigate to the project root directory.
    2. Run the following command:

    ```
    npm run api
    ```

    3. The API server will start running on `http://localhost:3000` (or the port specified in your environment variables).

    ## API Endpoints

    We have implemented two separate API endpoints for our image processing tasks:

    1. **Remove Background**: This endpoint removes the background from an uploaded image.
    2. **Preview Image**: This endpoint adds text to an image with a removed background and generates a preview.

    The reason for implementing two separate endpoints is to allow for more flexibility and better performance. By separating the background removal and text addition processes, we can:

    - Allow users to remove backgrounds without necessarily adding text.
    - Cache or save the background-removed images for future use.
    - Reduce processing time when users want to change only the text without re-processing the background removal.

    ### 1. Remove Background API

    **Endpoint**: `/api/remove-background`

    **Method**: POST

    **Content-Type**: multipart/form-data

    **Sample cURL Request**:
    ```bash
    curl -X POST \
      http://localhost:3000/api/remove-background \
      -H 'Content-Type: multipart/form-data' \
      -F 'image=@/path/to/your/image.jpeg'
    ```

    **Expected Response**:

    The API will save the image to the `uploads` directory and return the path to the removed background image.
    ```json
    {
      "success": true,
      "removedBgImagePath": "/uploads/bg_removed_[filename].png",
      "originalImagePath": "/uploads/[filename]"
    }
    ```

    ### 2. Preview Image API

    The Preview Image API is used to add text to an image with a removed background.

    **Endpoint**: `/api/preview-image`

    **Method**: POST

    **Content-Type**: application/json

    **Sample cURL Request**:
    ```bash
    curl -X POST \
      http://localhost:3000/api/preview-image \
      -H 'Content-Type: application/json' \
      -d '{
        "originalImagePath": "path_to_your_root_directory/uploads/[filename]",
        "removedBgImagePath": "path_to_your_root_directory/uploads/bg_removed_[filename].png",
        "textParams": {
          "text": "Sample Text",
          "fontFamily": "Arial",
          "fontSize": 100,
          "fontWeight": 650,
          "color": "#ea4500",
          "top": 10,
          "left": 2,
          "rotation": -15,
          "opacity": 1,
          "shadowColor": "rgba(10, 10, 0, 0.5)",
          "shadowSize": 10
        }
      }'
    ```

    **Expected Response**:
    The API will save the preview image to the `uploads` directory without returning the path to the preview image.


    ## Reason for Implementing Two Separate API Endpoints

    The main reason for separating background removal and text addition is flexibility. This allows users to make multiple attempts at formatting text without needing to remove the background each time, significantly improving efficiency and user experience.
