# Refresh your access token

Generates and returns for user new access token

**URL** : `/auth/refresh`

**Method** : `POST`

**Auth required** : YES

**Roles required** : USER

**Cookie** : This endpoint logs out the currently authenticated user.
No request body or payload is required — the user’s active session is identified automatically through the authentication cookie.

**Cookie Example**

```http
POST /auth/logout HTTP/1.1
Host: api.example.com
Cookie: refresh_token=abcdef123456
```

- IMPORTANT!!!! - if you add to request Authorization Header there will be an unauthorized exception.

## Success Response

**Condition** : If you are logged in

**Code** : `200 OK`

**Content example**

```json
{
  "token": "access token"
}
```

**Cookie** None

## Error Responses

**Condition** : If you are unauthorized

**Code** : `400 UNAUTHORIZED`

**Content example**

```json
{
  "message": "Unauthorized",
  "statusCode": 401
}
```
