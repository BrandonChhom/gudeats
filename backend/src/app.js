// codeProjects/gudeats/backend/src/app.js

// imports
import express from "express";

const app = express();

// json parsing middleware
app.use(express.json());

// defining routes
app.get("/api/health", (req, res) => {
  // parsed data accessible via req.body now
  res.json({
    status: "OK",
    message: "GudEats API is running!",
    timestamp: new Date().toISOString(),
  });
});

// for server.js
// const PORT = 3000;
// app.listen(PORT, () => {
//   console.log(`Server is running on hhtps://localhost:${POST}`);
// });

export default app;
