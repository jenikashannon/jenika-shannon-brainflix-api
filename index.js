const express = require("express");
const app = express();
const cors = require("cors");
const videosRoutes = require("./routes/videos");
const PORT = 1700;

app.use(cors());

// app.use((req, res, next) => {
// 	console.log("request received");
// 	next();
// });

app.use(express.json());

app.use(express.static("public"));

app.use("/videos", videosRoutes);

app.listen(PORT, () => {
	console.log(`listening on port ${PORT}...`);
});
