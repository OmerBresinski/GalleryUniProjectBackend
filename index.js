const express = require("express");
const cors = require("cors");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/locations", { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
    console.log("Connected to DB");
});

const locationSchema = new mongoose.Schema({
    title: String,
    imgSrc: String,
    description: String,
});
const Location = mongoose.model("Location", locationSchema);

const switzerland = new Location({
    title: "Switzerland",
    imgSrc: "https://micedata.s3.eu-central-1.amazonaws.com/MiceProjectData/Images/2020/3/16/135_337_e396ee56-a50f-4800-b83b-5a0f12355318.jpg",
    description:
        "Switzerland is a mountainous Central European country, home to numerous lakes, villages and the high peaks of the Alps. Its cities contain medieval quarters, with landmarks like capital Bern’s Zytglogge clock tower and Lucerne’s wooden chapel bridge. The country is also known for its ski resorts and hiking trails. Banking and finance are key industries, and Swiss watches and chocolate are world renowned.",
});

switzerland.save((err) => {
    if (err) return console.error(err);
    console.log("Saved Switzerland");
});

const app = express();
app.use(cors({ origin: true }));
app.use(bodyparser.json());

app.get("/locations", async (_req, res) => {
    const locations = await Location.find();
    res.send(locations);
});

app.get("/locations/:id", async (req, res) => {
    const id = req.params.id;
    const locations = await Location.findOne({ _id: id });
    res.send(locations);
});

app.post("/locations", async (req, res) => {
    const { title, imgSrc, description } = req.body;
    const { _id } = await Location.create({ title, imgSrc, description });
    res.send({ _id });
});

app.post("/locations/delete", async (req, res) => {
    await Location.deleteOne({ _id: req.body.id });
    res.send(true);
});

app.listen(4000, () => console.log("Express Server Up"));
