# Thesis-Mono

A production-ready monolithic e-commerce backend built with NestJS, PostgreSQL, Prisma ORM, JWT Authentication, Docker, and k6 benchmarking.

This project was developed as the monolithic implementation for a thesis comparing Monolithic and Microservices architectures in terms of performance, scalability, and maintainability.

---

## Features

### Authentication & Authorization

* JWT Authentication
* Role-Based Access Control (RBAC)
* User and Admin roles
* Password hashing using bcrypt

### User Management

* User registration
* User login
* User profile management

### Product Management

* Create product (Admin)
* Update product (Admin)
* Delete product (Admin)
* Product listing
* Product search
* Product details

### Order Management

* Create order
* Get user orders
* Admin order management

### Database

* PostgreSQL
* Prisma ORM
* Database migrations
* Database seeding

### Production Features

* Docker support
* Environment validation with Joi
* Helmet security middleware
* Compression middleware
* Global validation pipes
* Global exception handling
* Rate limiting
* Swagger API documentation
* Health check endpoint

### Performance Testing

* k6 load testing
* Benchmark datasets
* Performance comparison baseline for microservices migration

---

## Technology Stack

| Technology | Version |
| ---------- | ------- |
| Node.js    | 20.x    |
| NestJS     | Latest  |
| PostgreSQL | 16.x    |
| Prisma ORM | Latest  |
| Docker     | Latest  |
| JWT        | Latest  |
| k6         | Latest  |

---

## Project Structure

```text
src/
├── auth/
├── users/
├── products/
├── orders/
├── prisma/
├── health/
├── config/
├── common/
│   ├── filters/
│   ├── guards/
│   └── middleware/
├── app.module.ts
└── main.ts

prisma/
├── schema.prisma
└── seed.ts

k6/
├── products.js
├── search-products.js
├── product-detail.js
└── orders.js
```

---

## Installation

Clone the repository:

```bash
git clone https://github.com/kasra766/Thesis-Mono.git
cd Thesis-Mono
```

Install dependencies:

```bash
npm install
```

---

## Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL="postgresql://postgres:123456@localhost:5432/thesis_db"
JWT_SECRET="YOUR_SUPER_SECRET_KEY"
PORT=4000
```

---

## Database Setup

Create PostgreSQL database:

```sql
CREATE DATABASE thesis_db;
```

Run migrations:

```bash
npx prisma migrate dev --name init
```

Generate Prisma Client:

```bash
npx prisma generate
```

---

## Database Seeding

Generate benchmark dataset:

```bash
npx prisma db seed
```

Default dataset:

| Entity   | Count  |
| -------- | ------ |
| Users    | 201    |
| Products | 10,000 |
| Orders   | 50,000 |

Default Admin Account:

```text
Email: admin@thesis.com
Password: 123456
```

---

## Running the Application

Development:

```bash
npm run start:dev
```

Production:

```bash
npm run build
npm run start:prod
```

---

## Docker Deployment

Build containers:

```bash
docker compose build
```

Run containers:

```bash
docker compose up -d
```

Check running containers:

```bash
docker ps
```

Apply migrations inside container:

```bash
docker exec -it thesis-monolith sh

npx prisma migrate deploy
npx prisma db seed
```

---

## API Documentation

Swagger UI:

```text
http://localhost:4000/api
```

---

## Health Check

```http
GET /health
```

Example response:

```json
{
  "status": "UP",
  "timestamp": "2026-06-17T10:00:00.000Z"
}
```

---

## Authentication

### Register

```http
POST /auth/register
```

Request:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "123456"
}
```

### Login

```http
POST /auth/login
```

Request:

```json
{
  "email": "john@example.com",
  "password": "123456"
}
```

Response:

```json
{
  "accessToken": "JWT_TOKEN"
}
```

---

## Products

### Get Products

```http
GET /products
```

### Search Products

```http
GET /products?search=laptop
```

### Product Details

```http
GET /products/:id
```

### Create Product (Admin)

```http
POST /products
```

---

## Orders

### Create Order

```http
POST /orders
```

Request:

```json
{
  "productId": "PRODUCT_ID",
  "quantity": 2
}
```

### Get My Orders

```http
GET /orders/my
```

---

## Performance Benchmarking

k6 test scripts are located in:

```text
k6/
```

Run benchmark:

```bash
k6 run k6/products.js
```

Available benchmark scenarios:

```text
products.js
search-products.js
product-detail.js
orders.js
```

Suggested load levels:

| Virtual Users | Duration |
| ------------- | -------- |
| 10            | 1 minute |
| 50            | 1 minute |
| 100           | 1 minute |
| 200           | 1 minute |

Metrics collected:

* Average Latency
* P95 Latency
* P99 Latency
* Throughput
* Error Rate

---

## Thesis Objective

This project serves as the monolithic baseline implementation for a comparative study between Monolithic and Microservices architectures.

The next phase of the research involves:

* Service decomposition
* API Gateway
* RabbitMQ integration
* Database-per-service architecture
* Microservices benchmarking

The collected performance metrics from this monolith will be compared against the microservices implementation.

---

## Author

Kasra Mohammadpour

Master Thesis Project

Monolithic vs Microservices Architecture Performance Comparison
