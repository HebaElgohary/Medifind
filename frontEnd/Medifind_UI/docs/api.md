# API Documentation

## Authentication

### Login
- **Endpoint**: `/api/auth/login`
- **Method**: POST
- **Description**: Authenticate user and get JWT token
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response**:
  ```json
  {
    "token": "jwt_token",
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "role": "user_role"
    }
  }
  ```

### Register
- **Endpoint**: `/api/auth/register`
- **Method**: POST
- **Description**: Register new user
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123",
    "name": "User Name",
    "role": "donor|recipient"
  }
  ```
- **Response**:
  ```json
  {
    "message": "User registered successfully",
    "user": {
      "id": "user_id",
      "email": "user@example.com"
    }
  }
  ```

## Medicine Management

### Get All Medicines
- **Endpoint**: `/api/medicines`
- **Method**: GET
- **Description**: Get list of all medicines
- **Query Parameters**:
  - `page`: Page number
  - `limit`: Items per page
  - `search`: Search term
  - `filter`: Filter criteria
- **Response**:
  ```json
  {
    "medicines": [
      {
        "id": "medicine_id",
        "name": "Medicine Name",
        "description": "Description",
        "quantity": 100,
        "expiryDate": "2024-12-31"
      }
    ],
    "total": 100,
    "page": 1,
    "limit": 10
  }
  ```

### Add Medicine
- **Endpoint**: `/api/medicines`
- **Method**: POST
- **Description**: Add new medicine
- **Request Body**:
  ```json
  {
    "name": "Medicine Name",
    "description": "Description",
    "quantity": 100,
    "expiryDate": "2024-12-31"
  }
  ```
- **Response**:
  ```json
  {
    "message": "Medicine added successfully",
    "medicine": {
      "id": "medicine_id",
      "name": "Medicine Name"
    }
  }
  ```

## Donor Management

### Get Donor Profile
- **Endpoint**: `/api/donors/profile`
- **Method**: GET
- **Description**: Get donor profile information
- **Response**:
  ```json
  {
    "id": "donor_id",
    "name": "Donor Name",
    "email": "donor@example.com",
    "contact": "1234567890",
    "address": "Donor Address"
  }
  ```

### Update Donor Profile
- **Endpoint**: `/api/donors/profile`
- **Method**: PUT
- **Description**: Update donor profile
- **Request Body**:
  ```json
  {
    "name": "Updated Name",
    "contact": "9876543210",
    "address": "Updated Address"
  }
  ```
- **Response**:
  ```json
  {
    "message": "Profile updated successfully",
    "profile": {
      "id": "donor_id",
      "name": "Updated Name"
    }
  }
  ```

## Request Management

### Create Request
- **Endpoint**: `/api/requests`
- **Method**: POST
- **Description**: Create new medicine request
- **Request Body**:
  ```json
  {
    "medicineId": "medicine_id",
    "quantity": 10,
    "urgency": "high|medium|low",
    "notes": "Additional notes"
  }
  ```
- **Response**:
  ```json
  {
    "message": "Request created successfully",
    "request": {
      "id": "request_id",
      "status": "pending"
    }
  }
  ```

### Get Request Status
- **Endpoint**: `/api/requests/:id`
- **Method**: GET
- **Description**: Get request status and details
- **Response**:
  ```json
  {
    "id": "request_id",
    "medicineId": "medicine_id",
    "quantity": 10,
    "status": "pending|approved|rejected",
    "createdAt": "2024-01-01T00:00:00Z"
  }
  ```

## Error Handling

### Error Responses
All API endpoints may return the following error responses:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Error message",
    "details": "Additional error details"
  }
}
```

### Common Error Codes
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `500`: Internal Server Error

## Rate Limiting

### Limits
- 100 requests per minute per IP
- 1000 requests per hour per user

### Headers
- `X-RateLimit-Limit`: Maximum requests per time window
- `X-RateLimit-Remaining`: Remaining requests in current window
- `X-RateLimit-Reset`: Time until rate limit resets

## Authentication Headers

### Required Headers
```http
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

## WebSocket Events

### Real-time Updates
- **Event**: `medicine_update`
- **Event**: `request_status_change`
- **Event**: `donation_update`

### Event Format
```json
{
  "event": "event_name",
  "data": {
    // Event specific data
  }
}
```

## API Versioning

### Version Header
```http
Accept: application/vnd.medifind.v1+json
```

### Current Version
- Version: 1.0.0
- Base URL: `/api/v1`

## Pagination

### Query Parameters
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `sort`: Sort field
- `order`: Sort order (asc|desc)

### Response Headers
- `X-Total-Count`: Total number of items
- `X-Total-Pages`: Total number of pages
- `X-Current-Page`: Current page number 