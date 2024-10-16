    # API Documentation

    This document provides information on how to run the API endpoints for the Text Behind Image project. The API is built using Express.js and runs separately from the Next.js application to handle image processing tasks.

    ## Why a Separate API?

    While Next.js provides API routes, there are several reasons for implementing a separate Express.js API for this project:

    1. **Performance**: Image processing tasks can be computationally intensive. By offloading these tasks to a separate API, we prevent blocking the main Next.js server, ensuring better performance for other parts of the application.

    2. **Scalability**: A separate API allows for independent scaling of the image processing service, which can be crucial as the application grows.

    3. **File System Access**: Next.js API routes have limitations when it comes to file system operations, especially in serverless environments. A separate Express.js API provides more flexibility for file handling, which is essential for image processing tasks.

    4. **Long-Running Processes**: Some image processing tasks may take longer than the typical timeout limits set by serverless functions or Next.js API routes. A separate API allows for better handling of these long-running processes.

    5. **Dependency Management**: The image processing libraries used (like `@imgly/background-removal-node` and `canvas`) may have specific system requirements that are easier to manage in a separate Node.js environment.

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
    ```json
    {
      "success": true,
      "removedBgImagePath": "/uploads/bg_removed_[filename].png",
      "originalImagePath": "/uploads/[filename]"
    }
    ```

    ### 2. Preview Image API

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
    The API will return the preview image file directly.

    ## Reasons for Implementing Two Separate API Endpoints

    1. **Modularity**: Separating the background removal and text addition processes allows for better code organization and maintenance.

    2. **Flexibility**: Users can remove backgrounds without necessarily adding text, providing more options for image processing.

    3. **Performance Optimization**: By caching or saving the background-removed images, we can reduce processing time for subsequent text additions or modifications.

    4. **Resource Management**: Background removal is typically more resource-intensive than text addition. Separating these processes allows for better resource allocation and potential optimization of each task independently.

    5. **Error Handling**: With separate endpoints, it's easier to identify and handle errors specific to each process, improving the overall reliability of the application.

    6. **Future Scalability**: This architecture makes it easier to add new features or modify existing ones without affecting the entire image processing pipeline.
