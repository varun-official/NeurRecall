# NeurRecall UI

**NeurRecall** is a modern, high-performance interface for the Knowledge Capture RAG API. It provides a seamless experience for uploading knowledge documents and interacting with them via an advanced RAG (Retrieval-Augmented Generation) chat system.

![NeurRecall UI](public/favicon.svg)

## Features

### 🧠 Advanced Chat Interface
-   **RAG Strategy Selector**: Choose between multiple retrieval strategies on the fly:
    -   *Vector Search* (Speed & Semantics)
    -   *Keyword Search* (Exact Matching)
    -   *Hybrid Search* (Weighted Fusion)
    -   *Multi-Query & Decomposition* (Complex Reasoning)
-   **Rich Text Support**: Full Markdown rendering for AI responses.
-   **Transparent Sources**: View exact citations, similarity scores, and metadata for every answer.

### 📂 Knowledge Management
-   **Drag & Drop Upload**: Intuitive interface to ingest PDF, Markdown, and Text files.
-   **Real-time Status**: Track ingestion progress from upload to indexing.
-   **Corpus Management**: View and manage your uploaded knowledge base.

## Tech Stack

Built with the latest modern web technologies:
-   **Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
-   **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) (Dark Mode, Glassmorphism)
-   **Animations**: [Framer Motion](https://www.framer.com/motion/)
-   **Icons**: [Lucide React](https://lucide.dev/)
-   **HTTP Client**: [Axios](https://axios-http.com/)

## Getting Started

### Prerequisites
-   Node.js (v20+)
-   npm or bun

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/varun-official/NeurRecall.git
    cd NeurRecall
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

### Running Locally

To start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

### Building for Production

To create a production-ready build:

```bash
npm run build
```

## Configuration

The API connection is configured in `src/config.js`.

```javascript
// src/config.js
export const API_BASE_URL = 'https://knowledge-capture.onrender.com'; // or http://localhost:8000
```
