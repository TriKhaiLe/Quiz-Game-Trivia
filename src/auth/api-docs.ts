/*
 * =================================================================
 * API DOCUMENTATION for .NET SERVER
 * =================================================================
 *
 * This document describes the API endpoints required for user profile management.
 *
 * ---
 * ## **Authentication**
 * ---
 * Authentication is handled by a separate service (e.g., Supabase), which provides a JWT.
 * This JWT MUST be included in the Authorization header for all requests to this .NET API.
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
 */
export {};
