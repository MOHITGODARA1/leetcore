<div align="center">

# LeetCore — DSA Practice Platform with Real-Time C++ Code Execution

### Master Data Structures & Algorithms with a Structured Roadmap, Built-In IDE, and a High-Performance C++ Execution Engine

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Made with React](https://img.shields.io/badge/Frontend-React.js-61DAFB?logo=react)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js-339933?logo=node.js)](https://nodejs.org/)
[![C++](https://img.shields.io/badge/Engine-C%2B%2B-00599C?logo=c%2B%2B)](https://isocpp.org/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](#contributing)
[![Stars](https://img.shields.io/github/stars/MOHITGODARA1/leetcore?style=social)](https://github.com/MOHITGODARA1/leetcore/stargazers)

**LeetCore** is an open-source **DSA (Data Structures and Algorithms) learning and practice platform** built for developers preparing for **coding interviews**, **competitive programming**, and **placement exams**. It combines a **structured DSA roadmap**, an in-browser **coding IDE with Monaco Editor**, a **real-time C++ code execution engine**, and **progress analytics** — all in one full-stack application.

[Getting Started](#-getting-started) • [Features](#-features) • [Tech Stack](#️-tech-stack) • [Architecture](#-system-architecture) • [Roadmap](#-future-improvements) • [Contributing](#-contributing)

</div>

---

## 📌 Why LeetCore?

If you're searching for a **free open-source LeetCode alternative**, a **DSA practice tool with a built-in code compiler**, or a project to learn **full-stack system design (React + Node.js + C++)**, LeetCore is built exactly for that use case. It's ideal for:

- Students preparing for **technical coding interviews** at product-based companies
- Developers who want a **self-hosted DSA tracker** with real code execution
- Engineers learning how to build a **custom online judge / code execution engine**
- Anyone contributing to an **open-source educational coding platform**

---

## 🖥️ System Architecture

```
React (Frontend UI)
        ↓
Node.js (API Layer / Controller)
        ↓
C++ Engine (Execution & DSA Logic)
```

### Key Responsibilities

| Layer | Responsibility |
|---|---|
| **Frontend (React)** | User interface, in-browser IDE, algorithm visualization, dashboard & roadmap |
| **Backend (Node.js)** | REST API handling, request validation, routing code to the execution engine |
| **C++ Engine** | Code compilation, sandboxed execution, performance-critical DSA logic |

---

## ⚙️ Tech Stack

| Category | Technology |
|---|---|
| **Frontend** | React.js, Tailwind CSS, React Router |
| **Backend** | Node.js, Express.js |
| **Execution Engine** | C++, g++ compiler |
| **Editor** | Monaco Editor (VS Code engine) |
| **Utilities** | Nodemon, Axios |

---

## 📁 Project Structure

```
leetcore/
│
├── client/        # React frontend — IDE, dashboard, roadmap UI
├── server/        # Node.js backend — API layer & controllers
├── cpp-engine/    # C++ execution engine — compiles & runs user code
│
├── docs/          # DSA documentation (coming soon)
└── README.md
```

---

## ✨ Features

### 📚 Structured Learning System
- Curated, topic-wise **DSA roadmap**
- Pattern-based problem categorization (two-pointers, sliding window, DP, graphs, etc.)
- Beginner-to-advanced learning path

### 💻 Built-In Coding IDE
- Syntax-highlighted code editor (Monaco Editor)
- Custom input/output console
- Real-time code execution feedback

### ⚡ Real-Time C++ Execution Engine
- Executes user-submitted code via a native **C++ compilation pipeline**
- Fast, lightweight, and efficient runtime handling
- Supports custom test-case inputs

### 📊 Progress Tracking & Analytics
- Track solved problems by topic and difficulty
- Visual completion status across the roadmap
- Performance insights over time

### 🎬 Algorithm Visualization *(Upcoming)*
- Step-by-step execution visualization
- Interactive flow for recursion, sorting, and graph traversal

---

## 🔄 Code Execution Flow

```
User writes code (React IDE)
        ↓
API request → /run-code
        ↓
Node.js backend validates & forwards request
        ↓
C++ engine compiles & executes the code
        ↓
Output/errors returned to the frontend console
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v16+ recommended)
- [g++ compiler](https://gcc.gnu.org/) installed and available in your system `PATH`
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/MOHITGODARA1/leetcore.git
cd leetcore
```

### 2. Set Up the Frontend
```bash
cd client
npm install
npm run dev
```

### 3. Set Up the Backend
```bash
cd server
npm install
npm run dev
```

### 4. Set Up the C++ Execution Engine
Verify `g++` is installed:
```bash
g++ --version
```
Compile the engine:
```bash
cd cpp-engine
g++ main.cpp -o engine
```

Once all three services are running, open the frontend URL shown in your terminal (typically `http://localhost:5173`) to start using LeetCore.

---

## 🗺️ Future Improvements

- [ ] Docker-based secure & sandboxed code execution
- [ ] Multi-language support (Python, Java, JavaScript)
- [ ] AI-based problem recommendation engine
- [ ] Advanced analytics dashboard
- [ ] Real-time collaborative coding rooms

---

## 🎯 Project Goals

- Build strong DSA fundamentals through structured practice
- Provide an all-in-one, self-hosted coding interview prep platform
- Simulate real technical interview environments
- Demonstrate a scalable, full-stack system design (React + Node.js + C++)

---

## 🤝 Contributing

Contributions are what make the open-source community thrive. Any contributions you make are **greatly appreciated**.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Please open an issue first for major changes to discuss what you'd like to modify.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgment

Inspired by modern coding practice platforms and built to provide a more structured, transparent, and open DSA learning experience.

---

## 👤 Author

**Mohit Godara**
Full Stack Developer | Problem Solver

[![GitHub](https://img.shields.io/badge/GitHub-MOHITGODARA1-181717?logo=github)](https://github.com/MOHITGODARA1)

---

<div align="center">

### ⭐ If you find LeetCore useful, consider giving it a star — it helps others discover the project!

**Keywords:** DSA practice platform, LeetCode alternative, coding interview prep, online code compiler, C++ execution engine, React Node.js full-stack project, algorithm visualization, competitive programming tool, open-source coding platform

</div>
