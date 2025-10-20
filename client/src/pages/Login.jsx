import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function LoginPage() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();

      if (res.ok) {
        login(data); // store user in context + localStorage
        navigate("/chat");
      } else {
        setError(data.message || "Login failed");
      }
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setError("Server error. Try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2 w-64">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="p-2 border rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="p-2 border rounded"
          required
        />
        {error && <p className="text-red-500">{error}</p>}
        <button type="submit" className="p-2 bg-blue-500 text-white rounded">
          Login
        </button>
      </form>
      <p className="mt-2">
        Don't have an account?{" "}
        <Link to="/register" className="text-blue-600">
          Register
        </Link>
      </p>
    </div>
  );
}

