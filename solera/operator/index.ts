import { ethers } from "ethers";
import * as dotenv from "dotenv";
import { delegationABI } from "./abis/delegationABI";
import { registryABI } from './abis/registryABI';
import { avsDirectoryABI } from './abis/avsDirectoryABI';
dotenv.config();

const serviceManagerABI = [
    "event SubmittedTask(uint256 srcChainId, uint256 dstChainId, address sender, address recipient, uint256 amount)",
    "function submitTask(uint256 _srcChainId, uint256 _dstChainId, address _sender, address _recipient, uint256 _amount)"
];

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);

const delegationManagerAddress = process.env.DELEGATION_MANAGER_ADDRESS!;
const contractAddress = process.env.CONTRACT_ADDRESS!;
const stakeRegistryAddress = process.env.STAKE_REGISTRY_ADDRESS!;
const avsDirectoryAddress = process.env.AVS_DIRECTORY_ADDRESS!;

const delegationManager = new ethers.Contract(delegationManagerAddress, delegationABI, wallet);
const serviceManager = new ethers.Contract(contractAddress, serviceManagerABI, wallet);
const registryContract = new ethers.Contract(stakeRegistryAddress, registryABI, wallet);
const avsDirectory = new ethers.Contract(avsDirectoryAddress, avsDirectoryABI, wallet);

const registerOperator = async () => {
    const tx1 = await delegationManager.registerAsOperator({
        earningsReceiver: await wallet.address,
        delegationApprover: "0x0000000000000000000000000000000000000000",
        stakerOptOutWindowBlocks: 0
    }, "");
    await tx1.wait();
    console.log("Operator registered on EL successfully");

    const salt = ethers.hexlify(ethers.randomBytes(32));
    const expiry = Math.floor(Date.now() / 1000) + 3600; // Example expiry, 1 hour from now

    // Define the output structure
    let operatorSignature = {
        expiry: expiry,
        salt: salt,
        signature: ""
    };

    // Calculate the digest hash using the avsDirectory's method
    const digestHash = await avsDirectory.calculateOperatorAVSRegistrationDigestHash(
        wallet.address, 
        serviceManager.address, 
        salt, 
        expiry
    );

    // Sign the digest hash with the operator's private key
    const signingKey = new ethers.SigningKey(process.env.PRIVATE_KEY!);
    const signature = signingKey.sign(digestHash);
    
    // Encode the signature in the required format
    operatorSignature.signature = ethers.Signature.from(signature).serialized;

    const tx2 = await registryContract.registerOperatorWithSignature(
        wallet.address,
        operatorSignature
    );
    await tx2.wait();
    console.log("Operator registered on AVS successfully");
};

const monitorNewTasks = async () => {
    serviceManager.on("SubmittedTask", async(srcChainId: BigInt, dstChainId: BigInt, sender: string, recipient: string, amount: BigInt) => {
        console.log("SubmittedTask", srcChainId.toString(), dstChainId.toString(), sender, recipient, amount.toString());
        // TODO: 
    });

    console.log("Monitoring for new tasks...");
};

const main = async () => {
    await registerOperator();
    monitorNewTasks().catch((error) => {
        console.error("Error monitoring tasks:", error);
    });
};

main().catch((error) => {
    console.error("Error in main function:", error);
});