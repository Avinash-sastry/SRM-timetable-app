# My Timetable Builder

A modern, interactive, drag-and-drop timetable builder built with React. This application allows users to create, manage, and visualize their weekly schedules with a clean, intuitive interface.

**Live Demo:** [**https://your-netlify-site-name.netlify.app**](https://your-netlify-site-name.netlify.app)

 


---

## Features

This project is a feature-complete web application that includes:

*   **Dynamic Subject Creation:** Add custom subjects with unique names and color-coding.
*   **Drag-and-Drop Interface:** Intuitively drag subjects from a palette and drop them onto the timetable grid.
*   **Full CRUD Functionality:**
    *   **Create:** Add new subjects to the palette.
    *   **Read:** View the timetable clearly.
    *   **Update:** Move subjects from one slot to another.
    *   **Delete:** Remove subjects from the grid by dragging to a trash can, or delete them entirely from the palette.
*   **Interactive Grid:** A 5-day, 12-slot timetable with aligned time and day headers.
*   **Business Logic:** Prevents users from accidentally overwriting an occupied slot with a different subject.
*   **Dark Mode:** A sleek, modern dark theme that can be toggled on and off.
*   **Save as Image:** Download a high-quality PNG of the finished timetable using `html2canvas`.
*   **UI/UX Polish:** Built with professional fonts (Inter), icons (`react-icons`), and subtle animations for a smooth user experience.
*   **Responsive Design:** The core layout is functional on various screen sizes.

---

## Tech Stack & Libraries

This project was built from scratch using a modern front-end stack, focusing on best practices and a great developer experience.

*   **Framework:** [**React**](https://reactjs.org/) (with Vite for a fast development environment)
*   **Drag and Drop:** [**Dnd Kit**](https://dndkit.com/) - A powerful, lightweight, and accessible library for all drag-and-drop functionality.
*   **Styling:** **Plain CSS** with CSS Custom Properties (Variables) for easy theming (Light/Dark mode).
*   **Icons:** [**React Icons**](https://react-icons.github.io/react-icons/)
*   **Image Generation:** [**html2canvas**](https://html2canvas.hertzen.com/) to capture the timetable as a downloadable image.
*   **Deployment:** Version controlled with **Git**, hosted on **GitHub**, and continuously deployed via **Netlify**.

---

## How to Run Locally

To run this project on your own machine:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/your-repo-name.git
    ```
2.  **Navigate into the project directory:**
    ```bash
    cd my-timetable-app
    ```
3.  **Install dependencies:**
    ```bash
    npm install
    ```
4.  **Start the development server:**
    ```bash
    npm run dev
    ```
5.  Open [http://localhost:5173](http://localhost:5173) to view it in your browser.

---




# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
