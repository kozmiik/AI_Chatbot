import app from "./app.js";

// Server (local dev only)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

//checkpoint commit reset here if lost
