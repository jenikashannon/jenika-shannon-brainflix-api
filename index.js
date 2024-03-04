const express = require("express");
const app = express();
const cors = require("cors");
const videosRoutes = require("./routes/videos");

// app.use(cors);

// app.use((req, res, next) => {
// 	console.log("request received");
// 	next();
// });

app.use(express.json());

app.use("/videos", videosRoutes);

app.listen(8080, () => {
	console.log("listening on port 8080...");
});
