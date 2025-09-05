/*
 * =================================================================
 * API DOCUMENTATION for .NET SERVER
 * =================================================================
 *
 * This document describes the API endpoints required for user profile management
 * and quiz sharing.
 *
 * ---
 * ## **Authentication**
 * ---
 * Authentication is handled by a separate service (e.g., Supabase), which provides a JWT.
 * This JWT MUST be included in the Authorization header for all requests to this .NET API
 * where user-specific data is required.
 *
 * **Authorization Header Format**: `Authorization: Bearer <SUPABASE_JWT>`
 *
 *
 * ---
 * ## **User Profile API**
 * ---
 *
 * ### **1. Get User Profile**
 *
 * Retrieves the profile for the currently authenticated user, identified by the JWT.
 *
 * - **Endpoint**: `GET /api/profile`
 * - **Request**:
 *   - **Method**: `GET`
 *   - **Headers**:
 *     - `Authorization`: `Bearer <SUPABASE_JWT>` (Required)
 * - **Response**:
 *   - **Success (200 OK)**:
 *     ```json
 *     {
 *       "username": "string",
 *       "avatarId": "string" // e.g., "avatar-1"
 *     }
 *     ```
 *   - **Not Found (404 Not Found)**:
 *     - Indicates the user has authenticated but hasn't completed profile setup yet.
 *     ```json
 *     {
 *       "error": "Profile not found for this user."
 *     }
 *     ```
 *
 * ### **2. Create or Update User Profile**
 *
 * Creates or updates the profile for the currently authenticated user. This is used
 * for both the initial profile setup and any subsequent updates.
 *
 * - **Endpoint**: `PUT /api/profile`
 * - **Request**:
 *   - **Method**: `PUT`
 *   - **Headers**:
 *     - `Authorization`: `Bearer <SUPABASE_JWT>` (Required)
 *     - `Content-Type`: `application/json`
 *   - **Body**:
 *     ```json
 *     {
 *       "username": "string",
 *       "avatarId": "string" // e.g., "avatar-1"
 *     }
 *     ```
 * - **Response**:
 *   - **Success (200 OK or 201 Created)**:
 *     ```json
 *     {
 *       "username": "string",
 *       "avatarId": "string"
 *     }
 *     ```
 *   - **Bad Request (400 Bad Request)**:
 *     - Sent if validation fails (e.g., username is missing or invalid).
 *     ```json
 *     {
 *       "errors": {
 *         "username": ["The username field is required."],
 *         "avatarId": ["The avatarId field is required."]
 *       }
 *     }
 *     ```
 *
 * ---
 * ## **Quiz Sharing API**
 * ---
 * Endpoints for sharing and retrieving quizzes.
 *
 * ### **1. Share a Quiz (JSON API)**
 *
 * Creates a permanent, shareable record of a generated quiz. Returns an ID.
 *
 * - **Endpoint**: `POST /api/quizzes/share`
 * - **Request**:
 *   - **Method**: `POST`
 *   - **Headers**:
 *     - `Content-Type`: `application/json`
 *   - **Body**:
 *     ```json
 *     {
 *       "topic": "string",
 *       "difficulty": "number",
 *       "currentQuestionIndex": "number",
 *       "questions": [
 *         {
 *           "question": "string",
 *           "options": ["string", "string", "string", "string"],
 *           "correctAnswer": "string"
 *         }
 *       ]
 *     }
 *     ```
 * - **Response**:
 *   - **Success (201 Created)**:
 *     ```json
 *     {
 *       "id": "string"
 *     }
 *     ```
 *   - **Bad Request (400 Bad Request)**: If validation fails.
 *
 * ### **2. Get a Shared Quiz (JSON API)**
 *
 * Retrieves a previously shared quiz by its ID. Used by the frontend app after redirect.
 *
 * - **Endpoint**: `GET /api/quizzes/{id}`
 * - **Request**:
 *   - **Method**: `GET`
 * - **Response**:
 *   - **Success (200 OK)**:
 *     ```json
 *     {
 *       "topic": "string",
 *       "difficulty": "number",
 *       "startIndex": "number",
 *       "questions": [
 *         {
 *           "question": "string",
 *           "options": ["string", "string", "string", "string"],
 *           "correctAnswer": "string"
 *         }
 *       ]
 *     }
 *     ```
 *   - **Not Found (404 Not Found)**:
 *     ```json
 *     {
 *       "error": "Quiz not found."
 *     }
 *     ```
 *
 * ### **3. Quiz Preview & Redirect (HTML API)**
 *
 * **IMPORTANT:** This endpoint is for social media crawlers and user redirection. It returns HTML.
 *
 * - **Endpoint**: `GET /share/{id}`
 * - **Request**:
 *   - **Method**: `GET`
 * - **Response**:
 *   - **Success (200 OK)**:
 *     - **Content-Type**: `text/html`
 *     - **Body**: An HTML document structured like this:
 *     ```html
 *     <!DOCTYPE html>
 *     <html>
 *     <head>
 *       <meta charset="utf-8" />
 *       <title>Bạn có dám thử? Trắc nghiệm về [Topic]</title>
 *
 *       <!-- Open Graph / Facebook -->
 *       <meta property="og:type" content="website" />
 *       <meta property="og:url" content="https://your-backend-api.com/share/{id}" />
 *       <meta property="og:title" content="Thử thách kiến thức của bạn về [Topic]!" />
 *       <meta property="og:description" content="Bạn bè đã thách đố bạn với bộ 5 câu hỏi về [Topic]. Nhấn để chơi ngay!" />
 *       <meta property="og:image" content="https://your-domain.com/social-preview-image.png" />
 *
 *       <!-- Twitter -->
 *       <meta property="twitter:card" content="summary_large_image" />
 *       <meta property="twitter:url" content="https://your-backend-api.com/share/{id}" />
 *       <meta property="twitter:title" content="Thử thách kiến thức của bạn về [Topic]!" />
 *       <meta property="twitter:description" content="Bạn bè đã thách đố bạn với bộ 5 câu hỏi về [Topic]. Nhấn để chơi ngay!" />
 *       <meta property="twitter:image" content="https://your-domain.com/social-preview-image.png" />
 *
 *       <!-- Fallback redirect for non-JS clients -->
 *       <meta http-equiv="refresh" content="0; url=https://your-frontend-app-url.com/#/quiz/{id}" />
 *     </head>
 *     <body>
 *       <p>Đang chuyển hướng đến trò chơi...</p>
 *       <script type="text/javascript">
 *         // JS-based redirect
 *         window.location.href = "https://your-frontend-app-url.com/#/quiz/{id}";
 *       </script>
 *     </body>
 *     </html>
 *     ```
 *   - **Not Found (404 Not Found)**: A simple 404 HTML page.
 *
 * ---
 * ## **Quiz Result Sharing API**
 * ---
 * Endpoints for sharing and retrieving quiz results.
 *
 * ### **1. Share a Quiz Result (JSON API)**
 *
 * Creates a permanent, shareable record of a quiz result.
 *
 * - **Endpoint**: `POST /api/results/share`
 * - **Request**:
 *   - **Method**: `POST`
 *   - **Headers**:
 *     - `Content-Type`: `application/json`
 *   - **Body**:
 *     ```json
 *     {
 *       "topic": "string",
 *       "difficulty": "number",
 *       "userAnswers": ["string"],
 *       "questions": [
 *         {
 *           "question": "string",
 *           "options": ["string", "string", "string", "string"],
 *           "correctAnswer": "string"
 *         }
 *       ]
 *     }
 *     ```
 * - **Response**:
 *   - **Success (201 Created)**:
 *     ```json
 *     {
 *       "id": "string"
 *     }
 *     ```
 *
 * ### **2. Get a Shared Quiz Result (JSON API)**
 *
 * Retrieves a previously shared quiz result by its ID.
 *
 * - **Endpoint**: `GET /api/results/{id}`
 * - **Request**:
 *   - **Method**: `GET`
 * - **Response**:
 *   - **Success (200 OK)**:
 *     ```json
 *     {
 *       "topic": "string",
 *       "difficulty": "number",
 *       "userAnswers": ["string"],
 *       "questions": [
 *         {
 *           "question": "string",
 *           "options": ["string", "string", "string", "string"],
 *           "correctAnswer": "string"
 *         }
 *       ]
 *     }
 *     ```
 *   - **Not Found (404 Not Found)**:
 *     ```json
 *     {
 *       "error": "Quiz result not found."
 *     }
 *     ```
 *
 * ### **3. Result Preview & Redirect (HTML API)**
 *
 * Returns HTML with OG tags for social media previews.
 *
 * - **Endpoint**: `GET /share-result/{id}`
 * - **Request**:
 *   - **Method**: `GET`
 * - **Response**:
 *   - **Success (200 OK)**:
 *     - **Content-Type**: `text/html`
 *     - **Body**: An HTML document similar to the quiz share endpoint, but with result-specific text.
 *       Example OG Title: "Mình đã đạt [Score]/[Total] điểm trong bài trắc nghiệm về [Topic]! Bạn có thể làm tốt hơn không?"
 *       The `meta refresh` and JS redirect should point to `https://your-frontend-app-url.com/#/result/{id}`.
 *
 */
export {};
