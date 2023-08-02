// scripts/deploy.js

async function main() {
    const HelloWorldFactory = await ethers.getContractFactory("Chat_Payment")
    const helloMessage = await HelloWorldFactory.deploy()
    await helloMessage.deployed()
  
    console.log("Contract deployed to:", helloMessage.address)
    console.log("Contract deployed by " + JSON.stringify(helloMessage.signer) + " signer")
    process.exit(0)
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error)
      process.exit(1)
    })