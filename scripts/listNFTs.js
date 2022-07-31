import axios from "axios";
import "dotenv/config";
import fetch from "node-fetch";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const getNFTsList = async (req, res, next) => {
  try {
    let retailerAddress = process.env.MINTER_ADDRESS;
    const endpoint = process.env.SUBGRAPH_URL;

    const graphqlQuery = {
      operationName: "activities",
      query: `query {
                activities(where:{
		            activity: "CREATE",
		            caller: "${retailerAddress}"
                }) {
                    tokenId
                    tokenUri
                }
            }
              `,
      variables: {},
    };

    const response = await axios({
      url: endpoint,
      method: "post",
      data: graphqlQuery,
    });

    let items = response.data.data.activities;

    // req.data = ;
    let formattedItems = [];


    for(let i=0;i<items.length;i++){
      let tokenUri = items[i].tokenUri.toString();
      let tokenURL = tokenUri.replace("ipfs://", "https://ipfs.io/ipfs/");
      console.log(tokenURL)
      const metaData = await fetch(tokenURL)
        const response = await metaData.json()
        formattedItems.push({
          tokenId: items[i].tokenId,
          metaData: response,
        });
        console.log(formattedItems)
    };

    req.data = formattedItems
    console.log(req.data);
    next();
  } catch (err) {
    console.log(err);
    next(err);
  }
};

export default getNFTsList;
