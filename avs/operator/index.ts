import { BigNumber, ethers } from "ethers";
import * as dotenv from "dotenv";
import { delegationABI } from "./abis/delegationABI";
//import { contractABI } from './abis/contractABI';
import { registryABI } from './abis/registryABI';
import { avsDirectoryABI } from './abis/avsDirectoryABI';
dotenv.config();

const contractABI = [
    "event SubmittedTask(uint256 srcChainId, uint256 dstChainId, address sender, address recipient, uint256 amount)",
    "function submitTask(uint256 _srcChainId, uint256 _dstChainId, address _sender, address _recipient, uint256 _amount)"
];

const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);

const delegationManagerAddress = process.env.DELEGATION_MANAGER_ADDRESS!;
const contractAddress = process.env.CONTRACT_ADDRESS!;
const stakeRegistryAddress = process.env.STAKE_REGISTRY_ADDRESS!;
const avsDirectoryAddress = process.env.AVS_DIRECTORY_ADDRESS!;

const delegationManager = new ethers.Contract(delegationManagerAddress, delegationABI, wallet);
const contract = new ethers.Contract(contractAddress, contractABI, wallet);
const registryContract = new ethers.Contract(stakeRegistryAddress, registryABI, wallet);
const avsDirectory = new ethers.Contract(avsDirectoryAddress, avsDirectoryABI, wallet);

const signAndRespondToTask = async (taskIndex: number, taskCreatedBlock: number, taskName: string) => {
    const message = `Hello, ${taskName}`;
    const messageHash = ethers.utils.solidityKeccak256(["string"], [message]);
    const messageBytes = ethers.utils.arrayify(messageHash);
    const signature = await wallet.signMessage(messageBytes);

    console.log(
        `Signing and responding to task ${taskIndex}`
    )

    const tx = await contract.respondToTask(
        { name: taskName, taskCreatedBlock: taskCreatedBlock },
        taskIndex,
        signature
    );
    await tx.wait();
    console.log(`Responded to task.`);
};

const registerOperator = async () => {
    const tx1 = await delegationManager.registerAsOperator({
        earningsReceiver: await wallet.address,
        delegationApprover: "0x0000000000000000000000000000000000000000",
        stakerOptOutWindowBlocks: 0
    }, "");
    await tx1.wait();
    console.log("Operator registered on EL successfully");

    const salt = ethers.utils.hexlify(ethers.utils.randomBytes(32));
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
        contract.address, 
        salt, 
        expiry
    );

    // Sign the digest hash with the operator's private key
    const signingKey = new ethers.utils.SigningKey(process.env.PRIVATE_KEY!);
    const signature = signingKey.signDigest(digestHash);
    
    // Encode the signature in the required format
    operatorSignature.signature = ethers.utils.joinSignature(signature);

    const tx2 = await registryContract.registerOperatorWithSignature(
        wallet.address,
        operatorSignature
    );
    await tx2.wait();
    console.log("Operator registered on AVS successfully");
};

async function createNewTask(amount: number) {
    try {
        // Send a transaction to the createNewTask function
        const tx = await contract.submitTask(1, 2, "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9", "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9", amount.toString());

        // Wait for the transaction to be mined
        const receipt = await tx.wait();

        console.log(`Transaction successful with hash: ${receipt.transactionHash}`);
    } catch (error) {
        console.error('Error sending transaction:', error);
    }
}

const monitorNewTasks = async () => {
    await contract.submitTask(1, 2, "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9", "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9", 100);

    contract.on("SubmittedTask", async(srcChainId: BigNumber, dstChainId: BigNumber, sender: string, recipient: string, amount: BigNumber) => {
        console.log("SubmittedTask", srcChainId.toString(), dstChainId.toString(), sender, recipient, amount.toString());
    });

    console.log("Monitoring for new tasks...");

    setInterval(() => {
        const randomAmount = Math.floor(Math.random() * 1e18);
        console.log(`Creating new task with amount: ${randomAmount}`);
        createNewTask(randomAmount);
    }, 1500);
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