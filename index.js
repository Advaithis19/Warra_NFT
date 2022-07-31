import express from "express";
import bodyParser from "body-parser";
import { setup, mintToken } from "./scripts/nft.js";
import getNFTsList from "./scripts/listNFTs.js";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const app = express();
const cors = require("cors");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.post("/api/mint", setup, mintToken, function (req, res) {
  res.json({ data: req.data });
});

app.get("/api/items", getNFTsList, function (req, res) {
  res.json({ data: req.data });
});

app.listen(process.env.PORT || 5000, () =>
  console.log("Listening on port 5000...")
);
