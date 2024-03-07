const express = require("express");
const router = express.Router();
const fs = require("fs");
const uniqid = require("uniqid");

const pathToData = "./data/videos.json";

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
	const videoId = getVideoId(req.params.videoId);

	// find the video with the required video id
	const video = videos.find((video) => video.id === videoId);

	res.send(video);
});

router.post("/:videoId/comments", (req, res) => {
	const videos = readDatabase();
	const videoId = getVideoId(req.params.videoId);

	const newComment = {
		...req.body,
		id: uniqid(),
		timestamp: new Date().getTime(),
	};

	// find relevant video
	const videoIndex = videos.findIndex((video) => video.id === videoId);

	const video = videos[videoIndex];

	video.comments.push(newComment);

	writeToDatabase(videos);

	res.send(newComment);
});

router.delete("/:videoId/comments/:commentId", (req, res) => {
	const videos = readDatabase();
	const videoId = getVideoId(req.params.videoId);
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

function getVideoId(videoId) {
	const firstVideoId = readDatabase()[0].id;

	// if no video id, set to first video in video list
	return (videoId === "undefined" ? undefined : videoId) || firstVideoId;
}
