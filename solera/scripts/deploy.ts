import { ethers } from "hardhat";

const SOLERA_SERVICE_ADDRESS = "0x90F79bf6EB2c4f870365E785982E1f101E93b906"; // #3 test address

async function main() {
    // deploy Token
    const SPUSDToken = await ethers.getContractFactory("SPUSDToken");
    const spUSDToken = await SPUSDToken.deploy(SOLERA_SERVICE_ADDRESS);
    await spUSDToken.waitForDeployment();
    console.log("SPUSD is deployed at ", await spUSDToken.getAddress());

    const soleraContractFactory = await ethers.getContractFactory("SoleraContract")
    const soleraContract = await soleraContractFactory.deploy();
    await soleraContract.waitForDeployment();
    console.log("SoleraContract is deployed at ", await soleraContract.getAddress());
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
