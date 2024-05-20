const cors = require("cors");

const corsOptions = {
  origin: [
    "http://localhost:5173",
    "http://150.50.1.50:5173",
    "https://cyber-secure-web.vercel.app"
  ],
  credentials: true,
  optionsSuccessStatus: 200,
};

const handleCors = cors(corsOptions);

module.exports = handleCors;