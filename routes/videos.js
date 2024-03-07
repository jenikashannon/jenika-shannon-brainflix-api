const express = require("express");
const router = express.Router();
const fs = require("fs");
const uniqid = require("uniqid");

const pathToData = "./data/videos.json";

// console.log(videos[0]);

router
	.route("/")
	.get((req, res) => {
		const videos = readDatabase();

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
		const videos = readDatabase();

		const video = { id: uniqid(), ...req.body };

		videos.push(video);

		writeToDatabase(videos);

		res.status(201).send(video);
	});

router.get("/:videoId", (req, res) => {
	const videos = readDatabase();
	const videoId = req.params.videoId;

	// find the video with the required video id
	const video = videos.find((video) => video.id === videoId);

	res.send(video);
});

router.delete("/:videoId/comments/:commentId", (req, res) => {
	const videos = readDatabase();
	const videoId = req.params.videoId;
	const commentId = req.params.commentId;

	// find relevant video
	const videoIndex = videos.findIndex((video) => video.id === videoId);

	const video = videos[videoIndex];

	// find relevant comment
	const commentIndex = video.comments.findIndex(
		(comment) => comment.id === commentId
	);

	const comment = video.comments[commentIndex];

	// remove comment
	video.comments.splice(commentIndex, 1);

	writeToDatabase(videos);

	res.send(comment);
});

router.post("/thumbnail", (req, res) => {
	console.log("started");
	const bytes = req.body;
	console.log(bytes);
	// const path = `./public/images/${uniqid()}.jpg`;
	// fs.writeFileSync(path, url);
	console.log("done");
});

module.exports = router;

function readDatabase() {
	return JSON.parse(fs.readFileSync(pathToData));
}

function writeToDatabase(newData) {
	fs.writeFileSync(pathToData, JSON.stringify(newData));
}
