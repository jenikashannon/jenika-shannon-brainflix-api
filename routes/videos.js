const express = require("express");
const router = express.Router();
const fs = require("fs");
const uniqid = require("uniqid");

const videos = JSON.parse(fs.readFileSync("./data/videos.json"));
console.log(videos[0]);

router
	.route("/")
	.get((req, res) => {
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
	})
	.post((req, res) => {
		const { title, description } = req.body;

		const video = {
			id: uniqid(),
			title: title,
			channel: "A very cool channel",
			image: "import from public",
			description: description,
			views: 0,
			likes: 0,
			duration: "2:17",
			video: "import from public",
			timestamp: new Date().getTime(),
			comments: [],
		};

		videos.push(video);

		fs.writeFileSync("./data/videos.json", JSON.stringify(videos));

		res.status(201).send(video);
	});

router.get("/:videoId", (req, res) => {
	const videoId = req.params.videoId;

	// find the video with the required video id
	const video = videos.find((video) => video.id === videoId);

	res.send(video);
});

module.exports = router;
