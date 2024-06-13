import { expect } from "chai";
import { ethers } from "hardhat";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { SPUSDToken } from "../typechain-types";


describe("spUSDToken", async function () {
    let serviceAccount: HardhatEthersSigner;
    const amount = 1000;
    let token: SPUSDToken;

    beforeEach(async function () {
        [, serviceAccount] = await ethers.getSigners();
        const SPUSDToken = await ethers.getContractFactory("SPUSDToken");
        token = await SPUSDToken.deploy(serviceAccount.address);
    });

    describe("Additional restrictions", function () {
        it("Should mint on SoleraService call", async function () {
            await expect(token.connect(serviceAccount).mint(serviceAccount.address, amount)).to.be.changeTokenBalance(token, serviceAccount, amount);
        });

        it("Should fail if mint is called not by SoleraService", async function () {
            await expect(token.mint(serviceAccount.address, amount))
                .to.revertedWithCustomError(token, "SPUSDCallerIsNotSoleraService");
        });

        it("Should burn on SoleraService call", async function () {
            await token.connect(serviceAccount).mint(serviceAccount.address, amount);
            await expect(token.connect(serviceAccount).burn(serviceAccount.address, amount)).to.be.changeTokenBalance(token, serviceAccount, -amount);
        });

        it("Should fail if burn is not called by SoleraService", async function () {
            await expect(token.burn(serviceAccount.address, amount))
                .to.revertedWithCustomError(token, "SPUSDCallerIsNotSoleraService");
        });
    });
});
