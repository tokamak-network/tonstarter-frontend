import fs from 'fs';
import {testValue } from './helpers/testValues.js';
import { ethers } from "ethers";

const ERC20AFACTORY_ADDRESS = '0xb7a8115C3D45f87C121baa19092938EFaC569e40';
const ERC20_FACTORY_A_ABI = JSON.parse(fs.readFileSync('src/services/abis/ERC20AFactory.json'));

// Goerli test network RPC endpoint
const goerliRPC = "https://goerli.infura.io/v3/0a557897425742b09341c9ba1e62327d";

// Define arguments for the project
const OWNER_ADDRESS = testValue().ownerAddress;
const TOKEN_ADDRESS = testValue().tokenAddress;

let PROJECT_NAME = testValue().projectName;

// Define arguments for the create function
const TOKEN_NAME = testValue().tokenName;
const TOKEN_SYMBOL = testValue().tokenSymbol;
const TOTAL_SUPPLY = testValue().totalSupply;
const TOTAL_SUPPLY_WEI = ethers.utils.parseUnits((TOTAL_SUPPLY), 'ether'); 

// set a new project name
// TODO: Get project name from user
PROJECT_NAME = 'test2';
console.log('project name:', PROJECT_NAME);

//  Initialize provider and signer
const provider = new ethers.providers.JsonRpcProvider(goerliRPC);
// const signer = provider.getSigner();
const signer = new ethers.Wallet(
  // process.env.PRIVATE_KEY,
  'df4602acf8cafcc103cd2633d4c2c082bfe14bf0743376bb35abe5da69efaefa',
  provider
)

// TODO: Step 3 (Deploy Token)
// contract initialize (change token abi according to contract type (Type A/B/C).
const tokenContractInterface = new ethers.Contract(ERC20AFACTORY_ADDRESS, ERC20_FACTORY_A_ABI.abi, signer);
// console.log('tokenContractIF', tokenContractInterface);




// Create token contract
const deployToken = async () => {
    try {
      // call create function
        const rawTx = await tokenContractInterface.create(
          TOKEN_NAME, 
          TOKEN_SYMBOL, 
          TOTAL_SUPPLY_WEI,
          OWNER_ADDRESS
        );
        console.log('transaction:', rawTx);

        // sign txn
        const signature = await signer.signTransaction(rawTx);
        const tempHash = ethers.utils.keccak256(signature);
        console.log('temp hash', tempHash);

        // get txn hash
        const tx = await signer.sendTransaction(rawTx);
        console.log('resulted hash', tx.hash);

        // wait for transaction to be confirmed
        const receipt = await tx.wait();
        const { logs } = receipt;
        console.log('logs', logs);

        const iface = new ethers.utils.Interface(ERC20_FACTORY_A_ABI.abi);
        const result = iface.parseLog(logs[logs.length - 1]);
        const { args } = result;
        console.log('args[0]', args[0]);

    }catch(e) {
        console.log('error deploying token', e);
    }
}

deployToken();


// 1. call all the vaults in sequance
// il, vesting -> any other


