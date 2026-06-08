# 🏥 Kinsyn Patient Portal

A modern, responsive **Patient Portal** frontend built with **Vue 3 + Vite**, featuring a fully Dockerized development workflow and component-driven UI development with Storybook.

---

## ✨ Features

- 🖥️ Modern UI built with Vue 3 Composition API
- ⚡ Fast development with Vite build tool
- 🐳 Dockerized development environment for consistency
- 📖 Storybook integration for component-driven development
- 🔍 TypeScript support with type checking
- 🧹 ESLint & Prettier for clean, formatted code
- 🧪 Unit testing support

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend Framework | Vue 3 |
| Build Tool | Vite |
| Containerization | Docker & Docker Compose |
| Component Development | Storybook |
| Language | JavaScript / TypeScript |
| Code Quality | ESLint, Prettier |

---

## 🚀 Getting Started

### Prerequisites

- Docker Desktop (or Docker Engine + Docker Compose plugin)
- Node.js / NVM (for non-Docker setup)

---

### ⚙️ Environment Setup

1. Create `.env` from the example file:

```sh
cp .env.example .env
```

2. Configure your environment variables:

| Variable | Default | Description |
|----------|---------|-------------|
| `APP_PORT` | `5173` | Frontend dev server port |
| `STORYBOOK_PORT` | `6006` | Storybook server port |

---

### 🐳 Start with Docker (Recommended)

**First run** (build images and start all services):

```sh
docker compose up -d --build
```

**Next runs:**

```sh
docker compose up -d
```

**Services available at:**
- App: `http://localhost:5173`
- Storybook: `http://localhost:6006`

**Stop services:**

```sh
docker compose down
```

---

### 💻 Start with Node/NVM

Install and use the correct Node version:

```sh
nvm i      # installs version set in .nvmrc
nvm use    # sets node environment
```

Start development server:

```sh
npm run dev
```

---

## 📜 Useful Commands

```sh
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
npm run format       # Format code with Prettier
npm run test:unit    # Run unit tests
```

> **Note:** If using Docker, prefix commands with:
> `docker compose run --rm app <command>`

---

## 👨‍💻 Developer

**Muhammad Ali Shah**
- 🐙 GitHub: [@syedali067](https://github.com/syedali067)
- 💼 LinkedIn: [muhammad-ali-mern067](https://linkedin.com/in/muhammad-ali-mern067)
- 📧 Email: as7073085@gmail.com

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
