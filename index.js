import express from "express";
import bodyParser from "body-parser";
import { mintToken } from "./scripts/nft.js";
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post("/api/mint", mintToken, function(req,res){
    res.json({data: req.data});
})

app.listen(3000, () =>
  console.log("Listening on port 3000...")
);