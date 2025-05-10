import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import BoardViewPage from "./pages/BoardViewPage.jsx";
import PrivateRoute from "./components/PrivateRoute";
import useNetworkStatus from "./hooks/useNetworkStatus";

export default function App() {
    const isOnline = useNetworkStatus();

    return (
        <>
            {!isOnline && (
                <div className="p-4 bg-red-200 text-red-700 text-center">
                    ⚠ Vous êtes hors ligne. Certaines fonctionnalités sont désactivées.
                </div>
            )}
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route
                    path="/dashboard"
                    element={
                        <PrivateRoute>
                            <DashboardPage />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/board/:boardId"
                    element={
                        <PrivateRoute>
                            <BoardViewPage />
                        </PrivateRoute>
                    }
                />
            </Routes>
        </>
    );
}
