import { ethers } from "ethers";
import * as dotenv from "dotenv";

dotenv.config();

const serviceManagerABI = [
    "event SubmittedTask(uint256 srcChainId, uint256 dstChainId, address sender, address recipient, uint256 amount)",
    "function submitTask(uint256 _srcChainId, uint256 _dstChainId, address _sender, address _recipient, uint256 _amount)"
];
const soleraContractABI = [
    ""
];

const chains = new Map<BigInt, string>([
    [2n, ""],
    [3n, ""],
]);

const contracts = new Map<BigInt, string>([
    [2n, ""],
    [3n, ""],
]);

const ethProvider = new ethers.JsonRpcProvider(process.env.ETH_URL);
const serviceManager = new ethers.Contract(process.env.SERVICE_MANAGER_ADDRESS!, serviceManagerABI, ethProvider);

async function main() {
    serviceManager.on("SubmittedTask", async(srcChainId: BigInt, dstChainId: BigInt, sender: string, recipient: string, amount: BigInt) => {
        console.log("SubmittedTask", srcChainId.toString(), dstChainId.toString(), sender, recipient, amount.toString());
        if (chains.has(dstChainId)) {
            const provider = new ethers.JsonRpcProvider(chains.get(dstChainId));
            const soleraContract = new ethers.Contract(contracts.get(dstChainId)!, soleraContractABI, ethProvider);

            // TODO call mint token
        }
    });

    console.log("Monitoring for new tasks...");
}

main().catch((error) => {
    console.log("Error in main function: ", error);
})