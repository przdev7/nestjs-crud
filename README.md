# Nestjs - CRUD API

This project was created as an introducion to nestjs.

## Table of contents

- [General info](#general-info)
- [Technologies](#technologies)
- [Setup](#setup)
- [Api docs](#api-docs)
- [Authors](#authors)

## Tech stack

Technologies in this project:

- language: typescript
- framework: nestjs
- databases: postgresql, redis
- infrastructure: docker

## Setup

```
$ git clone https://github.com/przdev7/nestjs-crud.git
$ cd ./nestjs-crud
$ npm run install
$ npm run start
```

or if you want to run as dev

```
$ npm run start:dev
```

## api-docs

### Public routes

Open endpoints without requried authentication.

- [Sign In](/docs/sign-in.md): `POST /auth/sign-in`
- [Sign Up](/docs/sign-up.md): `POST /auth/sign-up`

### Guarded endpoints

#### current user related

- [me](/docs/me.md): `GET /users/me`
- [all](/docs/users-all.md): `GET /users/all` IMPORTANT !!! REQUIRED ADMIN ROLE

#### Auth related

- [refresh](/docs/refresh.md): `POST /auth/refresh`
- [logout](/docs/logout.md): `POST /auth/logout`
- [change-password](/docs/change-password.md): `POST /auth/change-password`

## authors

- [@przdev7](https://github.com/przdev7)
