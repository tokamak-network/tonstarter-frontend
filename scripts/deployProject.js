const fs = require('fs');
const { testValue } = require('./helpers/testValues.js');
const { ethers } = require('ethers');


const ERC20AFACTORY_ADDRESS = '0xb7a8115C3D45f87C121baa19092938EFaC569e40';
const InitialLiquidityVault = '0x174e97B891701D207BD48087Fe9e3b3d10ed7c99';
const PublicSaleVault = '0xD9822E155c36Fc4E8CB396444096FffE1560769C';

// abis
const ERC20_FACTORY_A_ABI = JSON.parse(fs.readFileSync('src/services/abis/ERC20AFactory.json'));
const InitialLiquidityAbi = JSON.parse(fs.readFileSync('src/services/abis/Vault_InitialLiquidity.json'));
const PublicSaleVaultCreateAbi =JSON.parse(fs.readFileSync('src/services/abis/PublicSaleVaultCreateAbi.json'));

// Goerli test network RPC endpoint
const goerliRPC = "https://goerli.infura.io/v3/0a557897425742b09341c9ba1e62327d";

// Define arguments for the project
const OWNER_ADDRESS = testValue().ownerAddress;
let TOKEN_ADDRESS = testValue().tokenAddress;
const TOS_PRICE = testValue().tosPrice;

let PROJECT_NAME = testValue().projectName;

// Define arguments for the create function
const TOKEN_NAME = testValue().tokenName;
const TOKEN_SYMBOL = testValue().tokenSymbol;
const TOTAL_SUPPLY = testValue().totalSupply;
// const TOTAL_SUPPLY_WEI = ethers.utils.parseUnits((TOTAL_SUPPLY), 'ether').toString();
const TOTAL_SUPPLY_WEI = TOTAL_SUPPLY;
console.log('TOTAL_SUPPLY_WEI', TOTAL_SUPPLY_WEI);


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

const getAddress = async (rawTx, abi) => {
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
  
  const contractIF = new ethers.utils.Interface(abi);
  const result = contractIF.parseLog(logs[logs.length - 1]);
  const { args } = result;
  console.log('args[0]', args[0]);
  TOKEN_ADDRESS = args[0];
  
  return args[0];
}
// TODO: Step 3 (Deploy Token)
const deployToken = async () => {
  // contract initialize (change token abi according to contract type (Type A/B/C).
  const tokenContractInterface = new ethers.Contract(ERC20AFACTORY_ADDRESS, ERC20_FACTORY_A_ABI.abi, signer);
    try {
        const rawTx = await tokenContractInterface.create(
          TOKEN_NAME, 
          TOKEN_SYMBOL, 
          TOTAL_SUPPLY_WEI,
          OWNER_ADDRESS
        );

        TOKEN_ADDRESS = getAddress(rawTx, ERC20_FACTORY_A_ABI.abi);
        console.log('Token address', TOKEN_ADDRESS);
    }catch(e) {
        console.log('error deploying token', e);
    }
}

// Deploy Initial Liquidity Vault
const deployVaultIL = async () => {
  //  initialize vault contract
  const InitialLiquidityVaultContract = new ethers.Contract(InitialLiquidityVault, InitialLiquidityAbi.abi, signer).connect(signer);
  try {
    const rawTx = await InitialLiquidityVaultContract.create(
      'Initial Liquidity',
      TOKEN_ADDRESS,
      OWNER_ADDRESS,
      100,
      TOS_PRICE * 100
    )

    const ILVaultAddress = getAddress(rawTx, InitialLiquidityAbi.abi);
    console.log('ILVaultAddress', ILVaultAddress)
  } catch(e) {
    console.log(e)
  }
}

// Deploy Public Vault
// const deployVaultPublic = async () => {
//   const publicVaultContract = new ethers.Contract()
// }


const startDeploy = async() => {
  try {
    await deployToken();
    setTimeout(() => {
      deployVaultIL();
    }, 1000)
  } catch (error) {
    console.log(error)
  }
}

startDeploy();

// 1. call all the vaults in sequance
// il, vesting -> any other


