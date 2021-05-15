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

const london = new Location({
    title: "London",
    imgSrc: "https://lp-cms-production.imgix.net/2019-06/55425108.jpg",
    description:
        "London, city, capital of the United Kingdom. It is among the oldest of the world’s great cities—its history spanning nearly two millennia—and one of the most cosmopolitan. By far Britain’s largest metropolis, it is also the country’s economic, transportation, and cultural centre.",
});

const newYork = new Location({
    title: "New York",
    imgSrc: "https://cdn.getyourguide.com/img/location/5ffeb52eae59a.jpeg/88.jpg",
    description:
        "New York is the most ethnically diverse, religiously varied, commercially driven, famously congested, and, in the eyes of many, the most attractive urban centre in the country.",
});

const italy = new Location({
    title: "Italy",
    imgSrc: "https://www.fodors.com/wp-content/uploads/2019/03/20GorgeousSidetownsinItaly__HERO_shutterstock_688078159.jpg",
    description:
        "Italy, country of south-central Europe, occupying a peninsula that juts deep into the Mediterranean Sea. Italy comprises some of the most varied and scenic landscapes on Earth and is often described as a country shaped like a boot.",
});

const amsterdam = new Location({
    title: "Amsterdam",
    imgSrc: "https://www.telegraph.co.uk/content/dam/insurance/2016/04/06/amsterdam.jpg",
    description:
        "Amsterdam is the capital and the largest city in the Netherlands. The city is also the largest in the Netherlands in terms of population. Although Amsterdam is the capital, the government and parliament are in The Hague (the seat of government). Amsterdam is located in the province of Noord-Holland.",
});

switzerland.save((err) => {
    if (err) return console.error(err);
    console.log("Saved Switzerland");
});
london.save((err) => {
    if (err) return console.error(err);
    console.log("Saved London");
});
newYork.save((err) => {
    if (err) return console.error(err);
    console.log("Saved New York");
});
italy.save((err) => {
    if (err) return console.error(err);
    console.log("Saved Italy");
});
amsterdam.save((err) => {
    if (err) return console.error(err);
    console.log("Saved Amsterdam");
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
