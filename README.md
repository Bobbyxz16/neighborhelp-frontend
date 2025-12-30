# Neighborly Union (NeighborHelp)

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-19.0-61dafb.svg?style=flat&logo=react)
![Vite](https://img.shields.io/badge/Vite-6.0-646cff.svg?style=flat&logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38b2ac.svg?style=flat&logo=tailwind-css)

Neighborly Union is a comprehensive community platform designed to connect neighbors, facilitate resource sharing, and strengthen local communities. It provides a seamless interface for finding local resources, contacting providers, and managing community interactions.

## 🚀 Key Features

- **Resource Discovery**: Interactive map-based and list-based search for local resources.
- **User Dashboard**: Personalized dashboard to manage profile, messages, and saved resources.
- **Provider Dashboard**: Tools for resource providers to list and manage their services.
- **Messaging System**: Direct communication between users and resource providers.
- **Community Engagement**: Forums, events, and community statistics.
- **Role-Based Access**: Specialized panels for Administrators and Moderators to manage content.
- **Authentication**: Secure login and registration with Google OAuth support context.
- **Responsive Design**: Fully optimized for mobile, tablet, and desktop devices.

## 🛠️ Technology Stack

- **Frontend Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [PostCSS](https://postcss.org/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Routing**: [React Router DOM v7](https://reactrouter.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Visualization**: [Recharts](https://recharts.org/) for analytics charts.
- **Email Services**: [EmailJS](https://www.emailjs.com/)
- **Testing**: [Vitest](https://vitest.dev/) & [React Testing Library](https://testing-library.com/)

## 📦 Installation & Setup

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/neighborhelp-frontend.git
    cd neighborhelp-frontend
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Environment Configuration**
    Create a `.env` file in the root directory. You can use `.env.example` as a reference if available. Key variables likely include:
    ```env
    VITE_API_URL=http://localhost:3000/api
    VITE_GOOGLE_CLIENT_ID=your_google_client_id
    ```

4.  **Run Development Server**
    ```bash
    npm run dev
    ```
    The application will act at `http://localhost:5173`.

## 📜 Scripts

| Script | Description |
| :--- | :--- |
| `npm run dev` | Starts the development server with HMR. |
| `npm run build` | Builds the application for production. |
| `npm run lint` | Runs ESLint to check for code quality issues. |
| `npm run preview` | Locally previews the production build. |
| `npm run test` | Runs the test suite using Vitest. |

## 📂 Project Structure

```
src/
├── api/             # API client and endpoints configuration
├── assets/          # Static assets (images, icons)
├── components/      # Reusable UI components
├── pages/           # Application route pages (Home, Login, Dashboard, etc.)
├── services/        # Business logic and external service integrations
├── utils/           # Helper functions and constants
├── App.jsx          # Root component
├── Routes.jsx       # Route definitions
└── main.jsx         # Entry point
```

## 🤝 Contributing

Contributions are welcome! Please feel free to wait for future updates or submit a Pull Request.

1.  Fork the project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
