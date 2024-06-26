import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "./tasks/lockCollateral";

const config: HardhatUserConfig = {
    solidity: "0.8.24",
    networks: {
        arbitrum: {
            url: "http://127.0.0.1:8546"
        },
        polygon: {
            url: "http://127.0.0.1:8547"
        }
    }    
};

export default config;
