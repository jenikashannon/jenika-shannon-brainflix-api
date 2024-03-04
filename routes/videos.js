const express = require("express");
const router = express.Router();
const fs = require("fs");

const videos = JSON.parse(fs.readFileSync("./data/videos.json"));
console.log(videos[0]);

router.get("/", (req, res) => {
	// get relevant details for each video
	const videoList = videos.map((video) => {
		const videoListItem = {
			id: video.id,
			title: video.title,
			image: video.image,
			channel: video.channel,
		};

		return videoListItem;
	});

	res.send(videoList);
});

router.get("/:videoId", (req, res) => {
	const videoId = req.params.videoId;

	// find the video with the required video id
	const video = videos.find((video) => video.id === videoId);

	res.send(video);
});

module.exports = router;
