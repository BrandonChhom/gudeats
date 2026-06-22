// codeProjects/gudeats/backend/src/server.js

/* 
description: runs server
*/

// imports
import "dotenv/config";
import app from "./app.js";
import connectDB from "./config/db.js";

// define async startup
async function startServer() {
  await connectDB();

  // using environment port with 5000 as backup
  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

startServer();
