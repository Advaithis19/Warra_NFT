import ethers from "ethers";
import "dotenv/config";
import { NFTStorage, File } from "nft.storage";
import fs from "fs";
// import fetch from "node-fetch";
import contract from "../contracts/Warra-NFT.json" assert { type: "json" };
import { createRequire } from "module";
const require = createRequire(import.meta.url);

// const POLYGON_RPC_URL = process.env.POLYGON_URL;
const RINKEBY_RPC_URL = process.env.RINKEBY_RPC_URL;
// const POLYGON_CONTRACT_ADDRESS = process.env.POLYGON_CONTRACT_ADDRESS;
const RINKEBY_CONTRACT_ADDRESS = process.env.RINKEBY_CONTRACT_ADDRESS;
const NFT_STORAGE_API_KEY = process.env.NFT_STORAGE_API_KEY;
const MINTER_ADDRESS = process.env.MINTER_ADDRESS;
let MINTER_PRIVATE_KEY = process.env.MINTER_PRIVATE_KEY;

let WarraNFTContract;
const setup = async (req, res, next) => {
  const node = RINKEBY_RPC_URL;
  const provider = new ethers.providers.WebSocketProvider(node);

  // let url = req.originalUrl;
  let privatekey = MINTER_PRIVATE_KEY;
  let wallet = new ethers.Wallet(privatekey, provider);
  console.log("Using wallet address " + wallet.address);

  let contractaddress = RINKEBY_CONTRACT_ADDRESS;
  WarraNFTContract = new ethers.Contract(contractaddress, contract.abi, wallet);

  next();
};

const mintToken = async (req, res, next) => {
  try {
    console.log("body", req.body);
    const client = new NFTStorage({ token: NFT_STORAGE_API_KEY });
    let attribs = [];
    for (let key in req.body) {
      let obj = {};
      if (
        key == "name" ||
        key == "description" ||
        key == "receiver_address" ||
        key == "phone_no"
      ) {
        continue;
      }
      obj[key] = req.body[key];
      attribs.push(obj);
    }
    console.log("attributes", attribs);
    const metaData = await client.store({
      name: req.body.name,
      description: req.body.description,
      image: new File(
        [await fs.promises.readFile("./scripts/Flipkart-logo.png")],
        "Flipkart-logo.png",
        {
          type: "image/png",
        }
      ),
      attributes: attribs /*[
            {
                "trait_type": "Serial number",
                "value": req.body.serial_no
            },
            {
                "trait_type": "Issue date",
                "value": req.body.issue_date
            },
            {
                "trait_type": "warranty duration",
                "value": req.body.duration
            }
        ]*/,
    });

    const url = metaData.url;
    const duration = req.body.duration;
    const nftReceiver = req.body.receiver_address;
    let mintedToken = await WarraNFTContract.createWarranty(url, duration);
    await mintedToken.wait();
    let mintedTokenId = await WarraNFTContract.getTokenCounter();
    let nftTransfer = await WarraNFTContract.transfer(
      nftReceiver,
      mintedTokenId.sub(1).toString()
    );
    await nftTransfer.wait();
    console.log(mintedTokenId.sub(1).toString());
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    let twiliopn = process.env.TWILIO_PHONE_NO;
    const twilioClient = require("twilio")(accountSid, authToken);

    twilioClient.messages
      .create({
        body: `
                    Hi ${
                      req.body.customer_name
                    }! You have received a Warranty NFT with token ID: ${mintedTokenId
          .sub(1)
          .toString()} at contract address ${RINKEBY_CONTRACT_ADDRESS}.
                    You will be able to view your Warranty NFT in your MetaMask Wallet with address: ${
                      req.body.receiver_address
                    }.
                    Thank You!!`,
        from: twiliopn,
        to: req.body.phone_no,
      })
      .then((message) => console.log(message.sid));
    req.data = mintedTokenId.sub(1).toString();
    next();
  } catch (err) {
    console.log(err);
    next(err);
  }
};

export { setup, mintToken };
