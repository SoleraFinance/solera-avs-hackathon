import { task } from "hardhat/config";
import { Wallet } from "ethers";

task("lockCollateral", "Lock provided amount and get tokens in return to receiver wallet on the dstChain.")
    .addParam("contract", "SoleraContract's address")
    .addParam("amount", "Amount")
    .addParam("receiver", "Receiver's address")
    .addParam("dstchainid", "Destinantion chain Id")
    .addOptionalParam("senderkey", "Sender private key")
    .setAction(async (taskArgs, hre) => {
        const instance = await hre.ethers.getContractAt("SoleraContract", taskArgs.contract);

        if (taskArgs.senderkey !== undefined) {
            const wallet = new Wallet(taskArgs.senderkey, hre.ethers.provider);
            await instance.connect(wallet).lockCollateral(
                taskArgs.dstchainid,
                taskArgs.receiver,
                {value: hre.ethers.parseEther(taskArgs.amount)}
            );
        } else {
            await instance.lockCollateral(
                taskArgs.dstchainid,
                taskArgs.receiver,
                {value: hre.ethers.parseEther(taskArgs.amount)}
            );
        }
    });