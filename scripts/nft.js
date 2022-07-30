import ethers from "ethers";
import "dotenv/config";
import { NFTStorage, File } from "nft.storage";
import fs from "fs";
import fetch from "node-fetch";

const POLYGON_URL = process.env.POLYGON_URL;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
const NFT_STORAGE_API_KEY = process.env.NFT_STORAGE_API_KEY

const setup = async (req, res, next) => {
    const node = RINKEBY_RPC_URL;
    const provider = new ethers.providers.WebSocketProvider(node);
  
    let url = req.originalUrl;
  
    console.log("Using wallet address " + wallet.address);
  
    let contractaddress = CONTRACT_ADDRESS;
    p2pConveyanceContract = new ethers.Contract(
      contractaddress,
      contract.abi,
      wallet
    );
  
    next();
  };

const mintToken = async (req, res, next) => {
    try{
        console.log(req.body);
        const client = new NFTStorage({ token: NFT_STORAGE_API_KEY });
        const metaData = await client.store({
        name: req.body.name,
        description: req.body.description,
        image: new File([await fs.promises.readFile("./scripts/Flipkart-logo.png")], "Flipkart-logo.png", {
        type: "image/png",
        }),
        attributes: [
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
        ]
        });

        const url = metaData.url;
        req.data = url.toString();
        next();
  } catch (err) {
    console.log(err);
    next(err);
  }

};


export { mintToken };