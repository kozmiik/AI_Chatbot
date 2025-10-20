import { useState, useContext, useEffect, useRef } from "react";
import ChatMessage from "../components/ChatMessage";
import ChatInput from "../components/ChatInput";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  // Redirect unauthenticated users
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  // Fetch previous chat sessions
  useEffect(() => {
    if (!user) return;

    const fetchHistory = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/chat/history", {
          headers: { Authorization: `Bearer ${user.token}` },
        });

        if (res.status === 401) {
          logout();
          navigate("/login");
          return;
        }

        const data = await res.json();
        setMessages(data.messages || []);
      } catch (err) {
        console.error("Failed to fetch chat history:", err);
      }
    };

    fetchHistory();
  }, [user, logout, navigate]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text) => {
    if (!text || text.trim() === "") return; // Input validation

    const newMsg = { role: "user", content: text };
    setMessages((prev) => [...prev, newMsg]);

    try {
      const response = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({ message: text }),
      });

      if (response.status === 401) {
        logout();
        navigate("/login");
        return;
      }

      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply },
      ]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Error connecting to server." },
      ]);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Prevent rendering until user is loaded
  if (!user) return null;

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b bg-white shadow">
        <h2 className="text-lg font-semibold">Welcome, {user.username}</h2>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((msg, i) => (
          <ChatMessage key={i} message={msg} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Chat input */}
      <ChatInput onSend={sendMessage} />
    </div>
  );
}
