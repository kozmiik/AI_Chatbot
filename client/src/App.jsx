import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider";
import ChatPage from "./pages/ChatPage";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/RegisterPage";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/" element={<ChatPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}