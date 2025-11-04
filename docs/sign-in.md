# Create User's Account

Create session for your account and return refresh in cookie.

**URL** : `/auth/sign-in/`

**Method** : `POST`

**Auth required** : NO

**Permissions required** : None

**Data constraints**

Provide username with password:

```json
{
  "username": "[unicode 3 - 16 chars]",
  "password": "[unicode 8 -32 chars]"
}
```

Or you can use your email:

```json
{
  "email": "[unicode must be an email]",
  "password": "[unicode 8 - 32 chars]"
}
```

**Data example** All fields must be sent.

```json
{
  "username": "maciek123",
  "password": "supertajnehaslo123"
}
```

## Success Response

**Condition** : If everything is OK you will see a response with access token

**Code** : `200 OK`

**Content example**

```json
{
  "token": "access token"
}
```

**Cookie**

- value: refresh token
- signed: true
- httpOnly: true
- max-age: 1 month (for refresh token)

## Error Responses

**Condition** : If credentials are incorrect

**Code** : `401 UNAUTHORIZED`

**Content** :

```json
{
  "message": "Unauthorized",
  "statusCode": 401
}
```

### Or

**Condition** : If fields are missed.

**Code** : `400 BAD REQUEST`

**Content example**

```json
{
  "message": [
    "email should not be empty",
    "email must be an email",
    "username should not be empty",
    "username must be a string",
    "username must be shorter than or equal to 16 characters",
    "username must be longer than or equal to 3 characters",
    "password must be a string",
    "password must be shorter than or equal to 32 characters",
    "password must be longer than or equal to 8 characters",
    "password should not be empty"
  ],
  "error": "Bad Request",
  "statusCode": 400
}
```
