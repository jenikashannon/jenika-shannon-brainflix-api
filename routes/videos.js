const express = require("express");
const router = express.Router();
const fs = require("fs");
const uniqid = require("uniqid");
const multer = require("multer");

const pathToData = "./data/videos.json";

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "./public/images/");
	},
	filename: function (req, file, cb) {
		const fileExt = file.mimetype.split("/")[1];
		cb(null, `${uniqid()}.${fileExt}`);
	},
});

const upload = multer({ storage: storage });

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

router.post("/thumbnail", upload.single("files"), (req, res) => {
	const uploadLocation = req.file.path.split("/");
	const fileName = uploadLocation[uploadLocation.length - 1];
	res.send(fileName);
});

router.put("/:videoId/likes", (req, res) => {
	const videos = readDatabase();
	const videoId = getVideoId(req.params.videoId);

	// find relevant video
	const videoIndex = videos.findIndex((video) => video.id === videoId);
	const video = videos[videoIndex];

	let likes = parseFloat(video.likes.replaceAll(",", ""));
	likes++;

	video.likes = likes.toLocaleString("en-us");

	writeToDatabase(videos);

	res.send(video);
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
