import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`[InterviewIQ AI] Server running on http://localhost:${PORT}`);
  console.log(`[InterviewIQ AI] Environment: ${process.env.NODE_ENV || "development"}`);
});
