# Fetch information about your account

Gives information about your account

**URL** : `/users/all`

**Method** : `GET`

**Auth required** : YES

**Roles required** : ADMIN

**Headers**

Provide access token in authorization header with "Bearer":

```json
{
  "Authorization": "Bearer <token>"
}
```

**header example**

```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
}
```

## Success Response

**Condition** : If everything is OK you will see response with array

**Code** : `200 OK`

**Content example**

```json
[
 {
  "id": 2,
  "username": "name",
  "email": "user@example.com",
  "createdAt": "date of account creation",
  "updatedAt": "last change on this account in db",
  "roles": [
    "user" | "admin",
  ]
 }
]
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
