# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a Hardhat Ignition module that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat ignition deploy ./ignition/modules/Lock.ts
```

Steps:

1. run arbitrum in separate tab:
```
npx hardhat --config .\arbitrum.hardhat.config.ts node --port 8546
```

2. run polygon in separate tab:
```
npx hardhat --config .\polygon.hardhat.config.ts node --port 8547
```

3. deploy contracts to arbitrum:
```
npx hardhat --network arbitrum run .\scripts\deploy.ts
```

4. deploy contracts to polygon:
```
npx hardhat --network polygon run .\scripts\deploy.ts
```

5. run Solera service in separate tab (ethereum node should be running):
```
npx hardhat --network localhost run .\service\soleraService.ts
```
