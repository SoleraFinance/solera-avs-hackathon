<p align="center">
   <img src="https://github.com/SoleraFinance/solera-avs-hackathon/assets/2127896/d6a21e53-113c-4c9c-9dae-733bd84e34ce">
</p>


# Solera AVS

EigenLayer AVS Microhacks Season 1 

<br/><br/>


## Table of Contents:

[What is Solera](https://github.com/SoleraFinance/solera-avs-hackathon/edit/main/README.md#what-is-solera)

[High Level Flow](https://github.com/SoleraFinance/solera-avs-hackathon/edit/main/README.md#high-level-flow)

[Running the demo](https://github.com/SoleraFinance/solera-avs-hackathon/edit/main/README.md#running-the-demo)


<br/><br/>

## What is Solera?

Solera (solera.finance) is an inter-chain stablecoin backed by collateralized debt positions (CDP). 

With Solera, you can lock your assets as collateral on any supported chain, and mint native stablecoins on a same or another chain of your choosing.

You can also move stablecoins from one chain to another without going through bridges, paying fees or taking on additional risks. 

Solera runs as an EigenLayer Active Validated Service (AVS) 

### Is Solera a bridge?

No. While bridges mint wrapped tokens, Solera only operates in native tokens on all chains. The collateral is locked on its native chain while the stablecoins are minted natively on the supported blockchains

### Why do we need another stablecoin?

In today's world of trading opportunities being scattered across multiple blockchains, one needs to be able to move funds quickly between chains. At the same time, it might not be wise selling your current holdings, especially if they are yield bearing, to take advantage of another trade. Soleras inter-chain capabilities provide an opportunity to borrow stable assets on any chance you want against collateral on any chain you have them. 

### How does Solera keep its peg?

Solera uses a well known CDP based design that was pioneered by projects like MakerDAO (DAI) and Liquty (LUSD) and has proved to be extremely stable even in the most challenging market conditions. When collateral prices are declining, Solera uses an incentivized stability pool to cover the positions that drop below the minimal collateralization ratios. Additional mechanisms, such as debt socialization and direct redemption are utilized to maintain the peg at all times.

### What is Solera AVS?

Solera AVS is a decentralized coordination layer backed by Eigen Layer stakers. It is responsible for maintaining a coherent state across multiple blockchains and validate all protocol operations

<br/><br/>
## High Level Flow

In this demo, we use a very simple example of minting stablecoins on one blockchain as a result of locking collateral on another blockchain.

![image](https://github.com/SoleraFinance/solera-avs-hackathon/assets/2127896/8c05012c-370c-4a16-b09d-168edcd8c750)

We simulate three different blockchains: Ethereum, Polygon and Abitrum using [Foundry](https://github.com/foundry-rs/foundry) and [Hardhat](https://hardhat.org/) testing frameworks. 

The flow looks as follows:

1. User locks collateral by sending a transactions to Solera contract on Arbitrum blockchain
2. Operator monitors the event emitted by the contract, validates it  and creates a task for Solera AVS to mint stablecoins on the Polygon chain 
3. Solera Service receives an event from the AVS, and sends the transaction to Solera contracts on Polygon to mint the required amount of stablecoins
4. User receives stablecoins on the Polygon chain
   
> As this flow is only used for demonstration purposes, it has multiple simplifications, including:
>
> * In reality, the amount of minted stablecoins will depend on the Oracle price for the locked collateral. In this example the ratio is set to 1:1
> * The actual flow and logic might differ significantly, as the lock collateral and mint stablecoins operations are not necessarily performed in direct conjunction with one another

  ![image](https://github.com/SoleraFinance/solera-avs-hackathon/assets/2127896/aa2dca69-229e-49ae-85c4-bc700cd30dbc)


<br/><br/>
## Running the demo

### Prerequisites

This demo is based on the Hello world example: https://github.com/Layr-Labs/hello-world-avs
Dependencies:
* [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
* [Foundry](https://getfoundry.sh/)
* [Docker](https://www.docker.com/get-started/)
* [Hardhat](https://hardhat.org/hardhat-runner/docs/getting-started#quick-start)

Clone this repository and cd to the top folder

### Starting Ethereum emulator

Open a new terminal, cd to the repository folder and run the following command:

`cd avs & make start-chain-with-contracts-deployed`

*In certain cases (MacOS) it might be necessary to run `chmod 777 make start-chain-with-contracts-deployed`*


### Starting Arbitrum emulator

Open a new terminal, cd to the repository folder and perform the following steps:

* `cd solera && yarn`
* Copy .env.example file to .env and fill values for all variables according to the example below

  ```
  ETH_URL=http://127.0.0.1:8545
  SERVICE_MANAGER_ADDRESS=0x84eA74d481Ee0A5332c457a4d796187F6Ba67fEB
  OWNER_SERVICE_KEY=0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6
  ```

* `npx hardhat --config arbitrum.hardhat.config.ts node --port 8546`

### Starting Polygon emulator

Open a new terminal, cd to the repository folder and run the following commands:

* `cd solera`
* `npx hardhat --config polygon.hardhat.config.ts node --port 8547`

### Deploy Solera contracts

Open a new terminal, cd to the repository folder and run the following commands:

* `cd solera`
* `npx hardhat --network localhost run scripts/deploy.ts`
* `npx hardhat --network arbitrum run scripts/deploy.ts`
* `npx hardhat --network polygon run scripts/deploy.ts`

### Start Solera Operator

Open a new terminal, cd to the repository folder and run the following commands:

*  `cd solera/operator`
*  Copy .env.anvil to .env
*  Fill the values in the .env file according to the example below:

  ```
PRIVATE_KEY=0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d
RPC_URL=http://127.0.0.1:8545
POLYGON_RPC_URL=http://127.0.0.1:8547
ARBITRUM_RPC_URL=http://127.0.0.1:8546
SERVICE_MANAGER_ADDRESS=0x84eA74d481Ee0A5332c457a4d796187F6Ba67fEB
DELEGATION_MANAGER_ADDRESS=0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9
STAKE_REGISTRY_ADDRESS=0x9E545E3C0baAB3E08CdfD552C960A1050f373042
AVS_DIRECTORY_ADDRESS=0x5FC8d32690cc91D4c39d9d3abcBD16989F875707
CONTRACT_ADDRESS=0x70e0bA845a1A0F2DA3359C97E0285013525FFC49
POLYGON_CONTRACT_ADDRESS=0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
ARBITRUM_CONTRACT_ADDRESS=0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
```

* Run `npx tsx index.ts` (answer Yes if prompted)

### Start Solera Service

Open a new terminal, cd to the repository folder and run the following commands:

`cd solera && npx hardhat --network localhost run service/soleraService.ts`

### Test the demo with sample commands

Open a new terminal, cd to the repository folder and run the following:

* `cd solera`
* Lock collateral on one chain and see the stablecoins minted on another one

```
npx hardhat --network localhost lockCollateral --contract 0x70e0bA845a1A0F2DA3359C97E0285013525FFC49 --amount 2 --receiver 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 --dstchainid 42161
```

```
npx hardhat --network localhost lockCollateral --contract 0x70e0bA845a1A0F2DA3359C97E0285013525FFC49 --amount 2 --receiver 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 --dstchainid 137
```


