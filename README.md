<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

<p align="center">A progressive Multi-Tenant API gateway built with <a href="http://nodejs.org" target="_blank">Node.js</a> and NestJS framework that implements multi-tenancy and advanced authentication features.</p>

<p align="center">
  <a href="https://nodejs.org/en/" target="_blank"><img src="https://img.shields.io/badge/Node.js-%3E%3D%2016-green" alt="Node.js Version" /></a>
  <a href="https://www.typescriptlang.org/" target="_blank"><img src="https://img.shields.io/badge/TypeScript-5.0-blue" alt="TypeScript Version" /></a>
  <a href="https://nestjs.com/" target="_blank"><img src="https://img.shields.io/badge/NestJS-10.0-red" alt="NestJS Version" /></a>
  <a href="https://www.postgresql.org/" target="_blank"><img src="https://img.shields.io/badge/PostgreSQL-13-blue" alt="PostgreSQL Version" /></a>
  <a href="https://www.prisma.io/" target="_blank"><img src="https://img.shields.io/badge/Prisma-5.0-blue" alt="Prisma Version" /></a>
</p>

## Description

This API gateway intelligently routes requests based on user types and implements isolated database access for company users, built with [Nest](https://github.com/nestjs/nest) framework.

## Features

### 🏢 Multi-Tenant Architecture
- **User Type Distinction**
  - Automatic request routing based on user type (Customer/Company)
  - Smart database selection logic
  - Request context management

- **Database Isolation**
  - Primary database for customers
  - Isolated databases for company users
  - Full data separation between companies

### 🔐 Authentication & Security
- **Two-Factor Authentication (2FA)**
  - Mandatory for company users
  - Authenticator app integration
  - Optional for customer users

- **JWT Authentication**
  - Secure token-based system
  - Role-based access control
  - Token management

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Database Setup

```bash
# Start databases using Docker
$ docker-compose up -d

# Generate Prisma client
$ npx prisma generate

# Run migrations
$ npx prisma migrate dev
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## GraphQL API Examples

### Create User
```graphql
mutation {
  createUser(createUserInput: {
    email: "user@example.com"
    password: "password123"
    userType: CUSTOMER  # or COMPANY
    databaseUrl: "postgresql://user:password@localhost:5433/company1_db"  # for company users
  }) {
    id
    email
    userType
  }
}
```

### Login
```graphql
mutation {
  login(email: "user@example.co
