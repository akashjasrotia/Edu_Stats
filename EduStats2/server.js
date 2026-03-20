const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const signupRouter = require("./routes/signup.js");
const loginRouter = require("./routes/login.js");
const homeRouter = require('./routes/home.js');
const logoutRouter = require('./routes/logout.js')
const manualEntryRoute = require('./routes/manual-entry.js')
const uploadExcelRoute = require("./routes/uploadExcel.js");
const dashboardRoute = require('./routes/dashboard.js')
const savedResultsRoute = require('./routes/saved-results.js');
const deleteVizRoute = require('./routes/deleteViz.js');
const contactRoute = require("./routes/contact");
const profileRoute = require("./routes/profile.js");
const compareRoute = require("./routes/compareVisualizations");
const timelineRoute = require("./routes/timeline.js");
const anomalyRoute = require("./routes/anomaly.js");
const editVizRoute = require('./routes/editViz.js');
const editMarksRoute = require('./routes/editMarks.js');
dotenv.config();
connectDB();
const app = express();

const frontendUrls = [
  process.env.FRONTEND_URL,
  process.env.FRONTEND_URL_LOCAL
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || frontendUrls.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.use("/api/signup", signupRouter);
app.use("/api/login", loginRouter);
app.use('/api/home', homeRouter);
app.use('/api/logout',logoutRouter);
app.use('/api/manual-entry',manualEntryRoute);
app.use("/api/uploadExcel", uploadExcelRoute);
app.use("/api/visuals", dashboardRoute);
app.use("/api/saved-results", savedResultsRoute);
app.use("/api/deleteViz", deleteVizRoute);
app.use("/api/contact", contactRoute);
app.use("/api/profile", profileRoute);
app.use("/api/compare-visualizations", compareRoute);
app.use("/api/timeline", timelineRoute);
app.use("/api/anomaly", anomalyRoute);
app.use('/api/editViz',editVizRoute);
app.use('/api/visualization',editMarksRoute);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
