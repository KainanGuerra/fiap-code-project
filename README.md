# 📘 Public Documentation

## 📄 Internal Docs

For additional details including KPIs, authentication credentials, and business rules, refer to the internal documentation:

🔗 [**Google Docs (Fiap Tech Challenge)**](https://docs.google.com/document/d/1D_wMyvKGlw9HnF-5C-0MAu9vJvirmhUT/edit?usp=sharing&ouid=118228888649533221690&rtpof=true&sd=true)

## 🌐 Swagger API (Production)

You can view the full API documentation with all available endpoints, request bodies, and responses at:

🔗 [**Swagger Docs (Production)**](https://fiap-code-project.onrender.com/api)


---

## 🚀 Getting Started Locally

To run the project locally using Docker:

### 1. Enter the application container

```bash
docker compose run app ash
```

### 2. Install dependencies

```bash
yarn
```

### 3. Create and run the local database

```bash
yarn db:spawn
```

### 4. Exit the container

```bash
exit
```

### 5. Start the application

```bash
docker compose up app
```

The application will be accessible at:  
🔗 `http://localhost:3000`

Swagger will be available at:  
🔗 `http://localhost:3000/api`

---

## 📂 Project Structure (Simplified)

```text
src/
├── auth/              # Authentication logic (sign-in, sign-up)
├── posts/             # Post creation, listing, editing
├── users/             # User entity, roles, and management
├── common/            # Shared utilities, guards, pipes, interceptors
├── main.ts            # Entry point
└── app.module.ts      # Root module
```

---

## 🛠️ Technologies Used

- **NestJS** – Framework
- **PostgreSQL** – Database
- **TypeORM** – ORM
- **Swagger (OpenAPI)** – API Documentation
- **Docker** – Containerization
- **Yarn** – Package manager

---
