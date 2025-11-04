# Create User's Account

Create session for your account and return refresh in cookie.

**URL** : `/auth/sign-in/`

**Method** : `POST`

**Auth required** : NO

**Roles required** : None

**Data constraints**

Provide username, email and password:

```json
{
  "email": "[must be an email]",
  "username": "[unicode 3 - 16 chars]",
  "password": "[unicode 8 -32 chars]"
}
```

**Data example** All fields must be sent.

```json
{
  "email": "maciek@example.com",
  "username": "maciek123",
  "password": "supertajnehaslo123"
}
```

## Success Response

**Condition** : If everything is OK you will see response with text

**Code** : `201 CREATED`

**Content example**

```json
User created
```

**Cookie** None

## Error Responses

**Condition** : If user already exist

**Code** : `409 CONFLICT`

**Content** :

```json
{
  "message": "Conflict",
  "statusCode": 409
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
