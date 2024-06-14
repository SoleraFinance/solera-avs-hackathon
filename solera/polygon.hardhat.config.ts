import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "./tasks/lockCollateral";

const config: HardhatUserConfig = {
    solidity: "0.8.24",
    networks: {
        hardhat: {
            chainId: 137,
        }
    }
};

export default config;
