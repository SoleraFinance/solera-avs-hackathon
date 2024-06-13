import { ethers } from "ethers";
import * as dotenv from "dotenv";

dotenv.config();

const serviceManagerABI = [
    "event SubmittedTask(uint256 srcChainId, uint256 dstChainId, address sender, address recipient, uint256 amount)",
    "function submitTask(uint256 _srcChainId, uint256 _dstChainId, address _sender, address _recipient, uint256 _amount)"
];
const soleraContractABI = [
    "function mint(address to, uint256 amount)"
];

let chains = new Map<BigInt, string>();
let tokenAddresses = new Map<BigInt, string>();

const ethProvider = new ethers.JsonRpcProvider(process.env.ETH_URL);
const serviceManager = new ethers.Contract(process.env.SERVICE_MANAGER_ADDRESS!, serviceManagerABI, ethProvider);

async function main() {
    chains.set(BigInt(process.env.CHAIN_ID1!), process.env.URL1!);
    chains.set(BigInt(process.env.CHAIN_ID2!), process.env.URL2!);

    tokenAddresses.set(BigInt(process.env.CHAIN_ID1!), process.env.TOKEN_ADDRESS1!);
    tokenAddresses.set(BigInt(process.env.CHAIN_ID2!), process.env.TOKEN_ADDRESS2!);
    
    serviceManager.on("SubmittedTask", async(srcChainId: BigInt, dstChainId: BigInt, sender: string, recipient: string, amount: BigInt) => {
        console.log("SubmittedTask", srcChainId.toString(), dstChainId.toString(), sender, recipient, amount.toString());
        if (chains.has(dstChainId)) {
            const provider = new ethers.JsonRpcProvider(chains.get(dstChainId));
            const wallet = new ethers.Wallet(process.env.OWNER_SERVICE_KEY!, provider);
            const tokenContract = new ethers.Contract(tokenAddresses.get(dstChainId)!, soleraContractABI, wallet);

            const tx = await tokenContract.mint(recipient, amount.toString());

            await tx.wait();

            console.log("tx hash", tx.hash)
        }
    });

    console.log("Monitoring for new tasks...");
}

main().catch((error) => {
    console.log("Error in main function: ", error);
})