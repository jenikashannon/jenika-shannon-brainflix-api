const express = require("express");
const router = express.Router();
const fs = require("fs");

const videos = JSON.parse(fs.readFileSync("./data/videos.json"));
console.log(videos);

router.get("/:videoId", (req, res) => {
	const videoId = req.params.videoId;
	res.send(videos.find((video) => video.id === videoId));
});

module.exports = router;
