import { expect } from "chai";
import { ethers } from "hardhat";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { SoleraContract } from "../typechain-types";


describe("SoleraContract", async function () {
    let alice: HardhatEthersSigner;
    let soleraContract: SoleraContract;

    beforeEach(async function () {
        [, alice] = await ethers.getSigners();
        const SoleraContractFactory = await ethers.getContractFactory("SoleraContract");
        soleraContract = await SoleraContractFactory.deploy();
    });

    it("lockCollateral: should emit NewLock event", async function () {
        const destinationChainId = 1;
        const recipient = alice.address;
        const amount = ethers.parseEther("1");

        await soleraContract.lockCollateral(destinationChainId, recipient, { value: amount });

        const events = await soleraContract.queryFilter(soleraContract.getEvent("NewLock"), -1);
        expect(events.length).eq(1);

        expect(destinationChainId).eq(events[0].args[0]);
        expect(recipient).eq(events[0].args[1]);
        expect(amount).eq(events[0].args[2]);
    });
});