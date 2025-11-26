# Webzenith RBAC Assignment

Welcome to the Webzenith RBAC (Role-Based Access Control) project! This repository contains a robust and scalable application designed to manage user roles and permissions effectively. It's built with a modern tech stack to ensure performance, type safety, and a great developer experience.

## 🚀 Tech Stack

We've chosen a set of powerful tools to build this application:

-   **Framework:** [Next.js](https://nextjs.org/) (App Router) - For a fast, server-rendered React application.
-   **Language:** [TypeScript](https://www.typescriptlang.org/) - For type safety and better developer tooling.
-   **Styling:** [Tailwind CSS](https://tailwindcss.com/) & [shadcn/ui](https://ui.shadcn.com/) - For beautiful, responsive, and accessible UI components.
-   **Backend & Auth:** [Supabase](https://supabase.com/) - For a scalable database and secure authentication.
-   **State Management:** [TanStack Query](https://tanstack.com/query/latest) - For efficient server state management.
-   **Monorepo:** [Turborepo](https://turbo.build/) - For high-performance build system and monorepo management.
-   **Package Manager:** [pnpm](https://pnpm.io/) - For fast and efficient dependency management.

## 📂 Project Structure

This project is organized as a monorepo:

-   **`apps/web`**: The main Next.js web application.
-   **`packages/ui`**: Shared React component library.
-   **`packages/eslint-config`**: Shared ESLint configurations.
-   **`packages/typescript-config`**: Shared TypeScript configurations.

## 🛠️ Getting Started

Follow these steps to get the project running locally on your machine.

### Prerequisites

-   Node.js (>= 18)
-   pnpm (managed via Corepack or installed globally)

### Installation

1.  **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd webzenith-rbac
    ```

2.  **Install dependencies:**

    ```bash
    pnpm install
    ```

3.  **Environment Setup:**

    You'll need to configure your environment variables. Create a `.env.local` file in `apps/web` with your Supabase credentials and other necessary secrets.

    ```bash
    cp apps/web/.env.example apps/web/.env.local
    # Edit apps/web/.env.local with your actual keys
    ```

### Running the App

To start the development server for all apps:

```bash
pnpm dev
```

The web application should now be available at `http://localhost:3000`.

## 🤝 Contributing

We welcome contributions! Please ensure you follow the project's code style and run linting before submitting a PR.

```bash
pnpm lint
```

---

Built with ❤️ for Webzenith Solutions.
