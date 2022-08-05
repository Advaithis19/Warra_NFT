const { ethers, run, network } = require("hardhat");

async function main() {
  const warranftFactory = await ethers.getContractFactory("Warra_NFT");
  console.log("Please wait. Deploying contract...");
  const warranft = await warranftFactory.deploy({
    gas: "1000000",
    gasPrice: "2000000000",
    from: accouts[0],
  });
  await warranft.deployed();
  console.log(`Deployed contract to: ${warranft.address}`);
  if (network.config.chainId === 80001 && process.env.POLYGONSCAN_API_KEY) {
    console.log("Waiting for 6 block confirmation...");
    await warranft.deployTransaction.wait(6);
    console.log("Block confirmations done!");
    await verify(warranft.address, []);
  }

  // declarations
  const tokenUri =
    "https://ipfs.io/ipfs/bafyreif4nww77w5fjxvhtrtzkmuht6mcq2tihtz5isyj3u7rrwev73onoi/metadata.json";
  const noOfDays = 365;

  // retrieving current counter (must be 0)
  let currCounter = await warranft.getTokenCounter();
  console.log(`Current tokenCounter is: ${currCounter}`);

  // making order submission
  await warranft.createWarranty(tokenUri, noOfDays);

  // retrieving counter again
  let updatedCounter = await warranft.getTokenCounter();
  console.log(`Updated tokenCounter is: ${updatedCounter}`);
}

async function verify(contractAddress, args) {
  console.log("Verifying contract on etherscan...");
  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: args,
    });
    console.log("Contract verified!");
  } catch (e) {
    if (e.toString().toLowerCase().includes("already verified")) {
      console.log("Already verified!");
    } else {
      console.log(e);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
