import "dotenv/config";
import fetch from "node-fetch";
import { createRequire } from "module";
import axios from "axios";

const require = createRequire(import.meta.url);

const getNFTDetails = async (req, res, next) => {
    try {
      const endpoint = process.env.SUBGRAPH_URL;
      let tokenId = req.params.id;
      const graphqlQuery = {
        operationName: "activities",
        query: `query {
                activities(where:{
                      tokenId: "${tokenId}"
                } orderBy: timestamp 
                  orderDirection: asc) {
                  tokenId
                  tokenUri
                    activity
                    caller
                    associated
                    timestamp
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
      console.log("1")
      
      const graphqlQuery2 = {
        operationName: "activities",
        query: `query {
                activities(where:{
                      tokenId: "${tokenId}"
                } first: 1) {
                  tokenUri
                }
              } `,
        variables: {},
      };
  
      const response2 = await axios({
        url: endpoint,
        method: "post",
        data: graphqlQuery2,
      });
      console.log(2);
      console.log(response.data.data.activities,response2.data.data.activities)
      req.data = {history : response.data.data.activities,details: response2.data.data.activities}

      next()
    } catch (err) {
        console.log(err);
        next(err);
      }
    }

    export default getNFTDetails;