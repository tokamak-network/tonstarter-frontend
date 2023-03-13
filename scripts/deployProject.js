const fs = require('fs');
const { testValue } = require('./helpers/testValues.js');
const { ethers } = require('ethers');
const bn = require('bignumber.js');


const ERC20AFACTORY_ADDRESS = '0xb7a8115C3D45f87C121baa19092938EFaC569e40';
const InitialLiquidityVault = '0x174e97B891701D207BD48087Fe9e3b3d10ed7c99';
const PublicSaleVault = '0xD9822E155c36Fc4E8CB396444096FffE1560769C';
const VestingVault = '0x4829bE5F6e7fdC7B7e38c7A16e6298Cb8D6d9693';
const TonStakerVault = '0xC3A41ff1AfCB1Fb5755aDdD68c5C01f77B4Efb7b';
const TosStakerVault = '0xCEA6e5F2d46EaD8FA5E037b98bb6Bd1C766b9eC3';
const LPrewardVault = '0x02901517F8384f0c252a86D2Fff348D51748130d';
const LiquidityIncentiveVault = '0x02901517F8384f0c252a86D2Fff348D51748130d';
const TOS_WTON_POOL = '0x8DF54aDA313293E80634f981820969BE7542CEe9';
const TOS_ADDRESS = '0x67F3bE272b1913602B191B3A68F7C238A2D81Bb9';


// abis
const ERC20_FACTORY_A_ABI = JSON.parse(fs.readFileSync('src/services/abis/ERC20AFactory.json'));
const InitialLiquidityAbi = JSON.parse(fs.readFileSync('src/services/abis/Vault_InitialLiquidity.json'));
const PublicSaleVaultCreateAbi = JSON.parse(fs.readFileSync('src/services/abis/PublicSaleVaultCreateAbi.json'));
const VestingPublicFundFactoryAbi = JSON.parse(fs.readFileSync('src/services/abis/VestingPublicFundFactory.json'));
const TONStakerAbi = JSON.parse(fs.readFileSync('src/services/abis/TONStakerAbi.json'));
const TOSStakerAbi = JSON.parse(fs.readFileSync('src/services/abis/TOSStakerAbi.json'));
const LPrewardVaultAbi = JSON.parse(fs.readFileSync('src/services/abis/LPrewardVaultAbi.json'));
const Vault_InitialLiquidityComputeAbi = JSON.parse(fs.readFileSync('src/services/abis/Vault_InitialLiquidityCompute.json'));
const LiquidityIncentiveAbi = JSON.parse(fs.readFileSync('src/services/abis/LiquidityIncentiveAbi.json'));

// Goerli test network RPC endpoint
const goerliRPC = "https://goerli.infura.io/v3/0a557897425742b09341c9ba1e62327d";

// Define arguments for the project
const OWNER_ADDRESS = testValue().ownerAddress;
let TOKEN_ADDRESS = testValue().tokenAddress;
const ADDRESS_FOR_RECEIVING = testValue().vaults[0].addressForReceiving
const TOS_PRICE = testValue().tosPrice;

let PROJECT_NAME = testValue().projectName;

// Define arguments for the create function
const TOKEN_NAME = testValue().tokenName;
const TOKEN_SYMBOL = testValue().tokenSymbol;
const TOTAL_SUPPLY = testValue().totalSupply;
// const TOTAL_SUPPLY_WEI = ethers.utils.parseUnits((TOTAL_SUPPLY), 'ether').toString();?
const TOTAL_SUPPLY_WEI = TOTAL_SUPPLY;


// deployed vault addresses
let IL_VAULT_ADDRESS = ''
let VESTING_VAULT_ADDRESS = ''

// set a new project name
// TODO: Get project name from user
PROJECT_NAME = 'test2';
console.log('project name:', PROJECT_NAME);

//  Initialize provider and signer
const provider = new ethers.providers.JsonRpcProvider(goerliRPC);
const signer = new ethers.Wallet(
  // process.env.PRIVATE_KEY,
  'df4602acf8cafcc103cd2633d4c2c082bfe14bf0743376bb35abe5da69efaefa',
  provider
)

// Get Token Address or Vault address
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
// Step 3 (Deploy Token)
const deployToken = async () => {
  // contract initialize (change token abi according to contract type (Type A/B/C).
  console.log('Start deploying token...');
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
  console.log('token deployed...');
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

    IL_VAULT_ADDRESS = getAddress(rawTx, InitialLiquidityAbi.abi);
    console.log('ILVaultAddress', IL_VAULT_ADDRESS)
  } catch(e) {
    console.log(e)
  }
}

// Deploy Vesting Vault
const deployVaultVesting = async () => {
  const vestingVaultContract = new ethers.Contract(VestingVault, VestingPublicFundFactoryAbi.abi, signer).connect(signer);
  try {
    const rawTx = vestingVaultContract.create(
      `${PROJECT_NAME}_Vesting Vault`,
       ADDRESS_FOR_RECEIVING,
    )
    VESTING_VAULT_ADDRESS = getAddress(rawTx, VestingPublicFundFactoryAbi.abi);
    console.log('vestingVaultAddress', VESTING_VAULT_ADDRESS);
  } catch (error) {
    console.log(error);
  }
}

// Deploy Public Vault
const deployPublicVault = async () => {
  const publicVaultContract = new ethers.Contract(PublicSaleVault, PublicSaleVaultCreateAbi.abi, signer).connect(signer);
  try {
    const rawTx = await publicVaultContract.create(
      `${PROJECT_NAME}_Public Vault`,
       OWNER_ADDRESS,
       [TOKEN_ADDRESS, IL_VAULT_ADDRESS, VESTING_VAULT_ADDRESS],
       // # of vaults?
       2
    )
    const publicVaultAddress = getAddress(rawTx, PublicSaleVaultCreateAbi.abi);
    console.log('publicVaultAddress', publicVaultAddress);
  } catch (error) {
    console.log(error);
  }
}

// Deploy Ton Staking Vault
const deployTONStakerVault = async () => {
  const tsVaultContract = new ethers.Contract(TonStakerVault, TONStakerAbi.abi, signer).connect(signer);
  try {
    const rawTx = await tsVaultContract.create (
      `${PROJECT_NAME}_TON Staker`,
      TOKEN_ADDRESS,
      OWNER_ADDRESS
    )
    const tonStakerVault = getAddress(rawTx, TONStakerAbi.abi);
    console.log('tonStakerVault', tonStakerVault);
  } catch (error) {
    console.log(error)
  }
}

// Deploy Tos Staking Vault
const deployTOSStakerVault = async () => {
  const tosSVaultContract = new ethers.Contract(TosStakerVault, TOSStakerAbi.abi, signer).connect(signer);
  try {
    const rawTx = await tosSVaultContract.create (
      `${PROJECT_NAME}_TOS Staker`,
      TOKEN_ADDRESS,
      OWNER_ADDRESS
    )
    const tonStakerVault = getAddress(rawTx, TOSStakerAbi.abi);
    console.log('tonStakerVault', tonStakerVault);
  } catch (error) {
    console.log(error)
  }
}

// Deploy WTON-TOS LP Reward Vault
const deployLPRewardVault = async () => {
  const lpRewardVaultContract = new ethers.Contract(LPrewardVault, LPrewardVaultAbi.abi, signer).connect(signer);
  try {
    const rawTx = await lpRewardVaultContract.create(
      `${PROJECT_NAME}_WTON-TOS LP Reward`,
      TOS_WTON_POOL,
      TOKEN_ADDRESS,
      OWNER_ADDRESS
    )
    const lpRewardVaultAddress = getAddress(rawTx, LPrewardVaultAbi.abi);
    console.log('lpRewardVaultAddress', lpRewardVaultAddress)
  } catch (error) {
    console.error(error);
  }
  

}

// Deploy Liquidity Incentive Vault
const deployLiquidityIncentiveVault = async () => {
  const InitialLiquidity_Contract = new ethers.Contract(IL_VAULT_ADDRESS, Vault_InitialLiquidityComputeAbi.abi, signer);
  const poolAddress = await InitialLiquidity_Contract.computePoolAddress(
    TOKEN_ADDRESS,
    TOS_ADDRESS,
    3000
  )
  try {
  const liVaultContract = new ethers.Contract(LiquidityIncentiveVault, LiquidityIncentiveAbi.abi, signer).connect(signer);
  const rawTx = liVaultContract.create(
    `${PROJECT_NAME}_Liquidity Incentive`,
    // TODO: refer & update according to DeployVault.tsx 967~
    poolAddress[0],
    TOKEN_ADDRESS,
    OWNER_ADDRESS
  );
  const liVaultAddress = getAddress(rawTx, LiquidityIncentiveAbi.abi);
  console.log('liVaultAddress', liVaultAddress)
  } catch (error) {
    console.error(error);
  }
}

// Deploy Token, and then vaults
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const startDeploy = async () => {
  try {
    await deployToken();
    await delay(1000);
    await deployVaultIL();
    await delay(1000);
    await deployVaultVesting();
    await deployPublicVault();
    await deployTONStakerVault();
    await deployTOSStakerVault();
    await deployLPRewardVault();
    await deployLiquidityIncentiveVault();
  } catch (error) {
    console.log(error);
  }
};

export const convertToWei = (num) => ethers.utils.parseEther(num);

// TODO: Send tokens to each vault
// Ref DeployVault.tsx 1093~
const sendTokensIL = async () => {
  const InitialLiquidityVault_Contract = new ethers.Contract(IL_VAULT_ADDRESS, InitialLiquidityVault.abi, signer);
  const projectTokenPrice = testValue().vaults[1].tosPrice * 100;
  const vaultTokenAllocationWei = convertToWei(String(testValue().vaults[1].vaultTokenAllocation));
  const computePoolAddress = await InitialLiquidityVault_Contract.connect(signer).computePoolAddress(TOS_ADDRESS, TOKEN_ADDRESS, 3000);
  const reserv0 = computePoolAddress[1] === TOS_ADDRESS ? 100 : projectTokenPrice;
  const reserv1 = computePoolAddress[2] === TOS_ADDRESS ? 100 : projectTokenPrice;

  const rawTx = await InitialLiquidityVault_Contract.connect(
    signer
  ).initialize(vaultTokenAllocationWei, 100, projectTokenPrice, )


}

startDeploy();
sendTokensIL();


