import axios from "axios";
import "dotenv/config";
import fetch from "node-fetch";

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

    console.log(response.data.data.activities);
    let items = response.data.data.activities;

    // req.data = ;
    let formattedItems = [];

    items.forEach(async (item) => {
      console.log("item", item);
      let tokenUri = item.tokenUri.toString();
      let tokenURL = tokenUri.replace("ipfs://", "https://ipfs.io/ipfs/");

      const metaData = fetch(tokenURL)
        .then((response) => response.json())
        .then((data) => {
          return data;
        });
      console.log("metaData", metaData);
      //https://ipfs.io/ipfs/bafyreif4nww77w5fjxvhtrtzkmuht6mcq2tihtz5isyj3u7rrwev73onoi/metadata.json

      // .then((response) => response.json())
      // .then((data) => {
      //   return data;
      // });

      formattedItems.push({
        tokenId: item.tokenId,
        metaData: metaData,
      });
    });
    req.data = formattedItems;

    next();
  } catch (err) {
    console.log(err);
    next(err);
  }
};

export default getNFTsList;
