import app from "./src/app.js";
import { connectDB } from "./src/config/db.js";
import { config } from "./src/config/config.js";

const startServer = async () => {
  try {
    await connectDB();

    app.listen(config.PORT, () => {
      console.log(`Server running on port ${config.PORT} 🚀`);
    });
  } catch (error) {
    console.error("Server failed ❌", error.message);
    process.exit(1);
  }
};

startServer();