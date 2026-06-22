// codeProjects/gudeats/backend/src/server.js

// imports
import "dotenv/config";
import app from "./app.js";

// using process.env.Port with 5000 as backup or default
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
