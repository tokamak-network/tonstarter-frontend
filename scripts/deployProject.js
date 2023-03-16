const fs = require('fs');
const { testValue } = require('./helpers/testValues.js');
const { ethers } = require('ethers');
const bn = require('bignumber.js');

// contract addresses
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
const ERC20 = JSON.parse(fs.readFileSync('src/services/abis/erc20ABI(SYMBOL).json'));
const PUBLIC_SALE = JSON.parse(fs.readFileSync('src/services/abis/PublicSale.json'));
const VaultLPRewardLogicAbi = JSON.parse(fs.readFileSync('src/services/abis/VaultLPRewardLogicAbi.json'));
const VestingPublicFundAbi = JSON.parse(fs.readFileSync('src/services/abis/VestingPublicFund.json'));
const TONStakerInitializeAbi = JSON.parse(fs.readFileSync('src/services/abis/TONStakerInitializeAbi.json'));
const TOSStakerInitializeAbi = JSON.parse(fs.readFileSync('src/services/abis/TOSStakerInitializeAbi.json'));
const LPRewardInitializeAbi = JSON.parse(fs.readFileSync('src/services/abis/LPRewardInitializeAbi.json'));

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
let PUBLIC_VAULT_ADDRESS = ''
let TONSTAKER_VAULT_ADDRESS = ''
let TOSSTAKER_VAULT_ADDRESS = ''
let LPR_VAULT_ADDRESS = ''
let LI_VAULT_ADDRESS = ''


// TODO: Get project name from user
PROJECT_NAME = 'test2';
console.log('project name:', PROJECT_NAME);

/** Helpers */
const encodePriceSqrt = (reserve1, reserve0) => {
  return new bn(reserve1.toString())
    .div(reserve0.toString())
    .sqrt()
    .multipliedBy(new bn(2).pow(96))
    .integerValue(3)
    .toFixed();
}

//  Initialize provider and signer
const provider = new ethers.providers.JsonRpcProvider(goerliRPC);
const signer = new ethers.Wallet(
  // process.env.PRIVATE_KEY,
  'df4602acf8cafcc103cd2633d4c2c082bfe14bf0743376bb35abe5da69efaefa',
  provider
)

const convertToWei = (num) => ethers.utils.parseEther(num);

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
  
  /** Is the token deployed?  */
  // return TOKEN_ADDRESS
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

        TOKEN_ADDRESS = await getAddress(rawTx, ERC20_FACTORY_A_ABI.abi);
        console.log('Token address', TOKEN_ADDRESS);
        console.log('Token deployed...');
    }catch(e) {
        console.log('error deploying token', e);
    }
}

// Deploy Initial Liquidity Vault
const deployVaultIL = async () => {
  //  initialize vault contract
  console.log('Deploying Initial liquidity vault...');
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
    console.log('Initial liquidity vault is deployed');
  } catch(e) {
    console.log(e)
  }
}

// Deploy Vesting Vault
const deployVaultVesting = async () => {
  console.log('Deploying Vesting vault...');
  const vestingVaultContract = new ethers.Contract(VestingVault, VestingPublicFundFactoryAbi.abi, signer).connect(signer);
  try {
    const rawTx = vestingVaultContract.create(
      `${PROJECT_NAME}_Vesting Vault`,
       ADDRESS_FOR_RECEIVING,
    )
    VESTING_VAULT_ADDRESS = getAddress(rawTx, VestingPublicFundFactoryAbi.abi);
    console.log('Vesting vault is deployed');
  } catch (error) {
    console.log(error);
  }
}

// Deploy Public Vault
const deployPublicVault = async () => {
  console.log('Deploying Public vault...');
  const publicVaultContract = new ethers.Contract(PublicSaleVault, PublicSaleVaultCreateAbi.abi, signer).connect(signer);
  try {
    const rawTx = await publicVaultContract.create(
      `${PROJECT_NAME}_Public Vault`,
       OWNER_ADDRESS,
       [TOKEN_ADDRESS, IL_VAULT_ADDRESS, VESTING_VAULT_ADDRESS],
       // # of vaults?
       2
    )
    PUBLIC_VAULT_ADDRESS = getAddress(rawTx, PublicSaleVaultCreateAbi.abi);
    console.log('publicVaultAddress', PUBLIC_VAULT_ADDRESS);
    console.log('Public vault is deployed');
  } catch (error) {
    console.log(error);
  }
}

// Deploy Ton Staking Vault
const deployTONStakerVault = async () => {
  console.log('Deploying TONStaker vault...');
  const tsVaultContract = new ethers.Contract(TonStakerVault, TONStakerAbi.abi, signer).connect(signer);
  try {
    const rawTx = await tsVaultContract.create (
      `${PROJECT_NAME}_TON Staker`,
      TOKEN_ADDRESS,
      OWNER_ADDRESS
    )
    TONSTAKER_VAULT_ADDRESS = getAddress(rawTx, TONStakerAbi.abi);
    console.log('tonStakerVault', TONSTAKER_VAULT_ADDRESS);
    console.log('TONStaker vault is deployed');
  } catch (error) {
    console.log(error)
  }
}

// Deploy Tos Staking Vault
const deployTOSStakerVault = async () => {
  console.log('Deploying TOSStaker vault...');
  const tosSVaultContract = new ethers.Contract(TosStakerVault, TOSStakerAbi.abi, signer).connect(signer);
  try {
    const rawTx = await tosSVaultContract.create (
      `${PROJECT_NAME}_TOS Staker`,
      TOKEN_ADDRESS,
      OWNER_ADDRESS
    )
    TOSSTAKER_VAULT_ADDRESS = getAddress(rawTx, TOSStakerAbi.abi);
    console.log('tosStakerVault', TOSSTAKER_VAULT_ADDRESS);
    console.log('TOSStaker vault deployed');
  } catch (error) {
    console.log(error)
  }
}

// Deploy WTON-TOS LP Reward Vault
const deployLPRewardVault = async () => {
  console.log('Deploying WTON-TOS LP Reward vault...');
  const lpRewardVaultContract = new ethers.Contract(LPrewardVault, LPrewardVaultAbi.abi, signer).connect(signer);
  try {
    const rawTx = await lpRewardVaultContract.create(
      `${PROJECT_NAME}_WTON-TOS LP Reward`,
      TOS_WTON_POOL,
      TOKEN_ADDRESS,
      OWNER_ADDRESS
    )
    LPR_VAULT_ADDRESS = getAddress(rawTx, LPrewardVaultAbi.abi);
    console.log('lpRewardVaultAddress', LPR_VAULT_ADDRESS);
    console.log('WTON-TOS LP Reward vault deployed');
  } catch (error) {
    console.error(error);
  }
  

}

// Deploy Liquidity Incentive Vault
const deployLiquidityIncentiveVault = async () => {
  console.log('Deploying liquidity incentive vault...');
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
    poolAddress[0],
    TOKEN_ADDRESS,
    OWNER_ADDRESS
  );
  LI_VAULT_ADDRESS = getAddress(rawTx, LiquidityIncentiveAbi.abi);
  console.log('liVaultAddress', LI_VAULT_ADDRESS);
  console.log('liquidity incentive vault deployed');
  } catch (error) {
    console.error(error);
  }
}

// start deploying vaults
const startDeployVaults = async () => {
  try {
    if(TOKEN_ADDRESS) {
      await deployVaultIL();
      await deployVaultVesting();
      await deployPublicVault();
      await deployTONStakerVault();
      await deployTOSStakerVault();
      await deployLPRewardVault();
      await deployLiquidityIncentiveVault();
    }
  } catch (error) {
    console.log(error);
  }
};



// Send tokens to each vault
// send tokens to Initial Liquidity vault
const sendTokensPublic = async () => {
  console.log('Sending tokens to public vault...')
  const ERC20_CONTRACT = new ethers.Contract(TOKEN_ADDRESS, ERC20.abi, signer);
  try {
    await ERC20_CONTRACT?.transfer(
      // vault address
      PUBLIC_VAULT_ADDRESS, convertToWei(testValue().vaults[0].vaultTokenAllocation.toString())
    ) 
    console.log('transfer completed');
  } catch (error) {
    console.log(error);
  }
}

const sendTokensIL = async () => {
  console.log('Sending tokens to IL vault...');
  // send tokens to the 
  const ERC20_CONTRACT = new ethers.Contract(TOKEN_ADDRESS, ERC20.abi, signer);
  try {
    await ERC20_CONTRACT?.transfer(
      IL_VAULT_ADDRESS, convertToWei(testValue().vaults[1].vaultTokenAllocation.toString())
    )
    console.log('transfer completed');
  } catch (error) {
    console.log(error);
  }
}

const sendTokensTONS = async () => {
  console.log('Sending tokens to TON staker vault...')
  const ERC20_CONTRACT = new ethers.Contract(TOKEN_ADDRESS, ERC20.abi, signer);
  try {
    await ERC20_CONTRACT?.transfer(
      // vault address
      TONSTAKER_VAULT_ADDRESS, convertToWei(testValue().vaults[3].vaultTokenAllocation.toString())
    )
    console.log('transfer completed');
  } catch (error) {
    console.log(error)
  }
}

const sendTokensTOSS = async () => {
  console.log('Sending tokens to TOS staker vault...');
  const ERC20_CONTRACT = new ethers.Contract(TOKEN_ADDRESS, ERC20.abi, signer);
  try {
    await ERC20_CONTRACT?.transfer(
      // vault address
      TOSSTAKER_VAULT_ADDRESS, convertToWei(testValue().vaults[4].vaultTokenAllocation.toString())
    )
    console.log('transfer completed');
  } catch (error) {
    console.log(error)
  }
}

const sendTokensLPR = async () => {
  console.log('Sending tokens to LP Rewards vault...');
  const ERC20_CONTRACT = new ethers.Contract(TOKEN_ADDRESS, ERC20.abi, signer);
  try {
    await ERC20_CONTRACT?.transfer(
      LPR_VAULT_ADDRESS, convertToWei(testValue().vaults[5].vaultTokenAllocation.toString())
    )
    console.log('transfer complement');
  } catch (error) {
    console.log(error);
  }
}

const sendTokensLI = async () => {
  console.log('Sending tokens to Liquidity incentive vault...');
  const ERC20_CONTRACT = new ethers.Contract(TOKEN_ADDRESS, ERC20.abi, signer);
  try {
    await ERC20_CONTRACT?.transfer(
      LI_VAULT_ADDRESS, convertToWei(testValue().vaults[6].vaultTokenAllocation.toString())
    )
  } catch (error) {
    console.log(error);
  }
}

// send tokens to all vaults
const sendTokens = async () => {
  await sendTokensIL();
  await sendTokensPublic();
  await sendTokensTONS();
  await sendTokensTOSS();
  await sendTokensLPR();
  await sendTokensLI();
}


// initialize all vaults

const initILVault = async () => {
  console.log('Initializing IL Vault');
  const InitialLiquidityVault_Contract = new ethers.Contract(IL_VAULT_ADDRESS, InitialLiquidityVault.abi, signer);
  const projectTokenPrice = testValue().vaults[1].tosPrice * 100;
  const vaultTokenAllocationWei = convertToWei(String(testValue().vaults[1].vaultTokenAllocation));
  const computePoolAddress = await InitialLiquidityVault_Contract.connect(signer).computePoolAddress(TOS_ADDRESS, TOKEN_ADDRESS, 3000);
  const reserv0 = computePoolAddress[1] === TOS_ADDRESS ? 100 : projectTokenPrice;
  const reserv1 = computePoolAddress[2] === TOS_ADDRESS ? 100 : projectTokenPrice;

  const rawTx = await InitialLiquidityVault_Contract.connect(
    signer
  ).initialize(vaultTokenAllocationWei, 100, projectTokenPrice, encodePriceSqrt(reserv1, reserv0),
  testValue().vaults[1].startTime
  );

  const receipt = await rawTx.wait();
  if (receipt) {
    console.log('IL vault is initialized');
  }
}

const initPublicVault = async () => {
  console.log('Initializing Public Vault');
  const PublicVaultData = testValue().vaults[0];
  const publicRound1TokenAllocation = PublicVaultData.publicRound1Allocation;

  const tier1RequiredStosWei = convertToWei(
    String(PublicVaultData.stosTier.oneTier.requiredStos),
  );
  const tier2RequiredStosWei = convertToWei(
    String(PublicVaultData.stosTier.twoTier.requiredStos),
  );
  const tier3RequiredStosWei = convertToWei(
    String(PublicVaultData.stosTier.threeTier.requiredStos),
  );
  const tier4RequiredStosWei = convertToWei(
    String(PublicVaultData.stosTier.fourTier.requiredStos),
  );

  const param0 = [
    tier1RequiredStosWei,
    tier2RequiredStosWei,
    tier3RequiredStosWei,
    tier4RequiredStosWei,
    (Number(
      PublicVaultData.stosTier.oneTier.allocatedToken,
    ) *
      10000) /
      publicRound1TokenAllocation,
    (Number(
      PublicVaultData.stosTier.twoTier.allocatedToken,
    ) *
      10000) /
      publicRound1TokenAllocation,
    (Number(
      PublicVaultData.stosTier.threeTier.allocatedToken,
    ) *
      10000) /
      publicRound1TokenAllocation,
    (Number(
      PublicVaultData.stosTier.fourTier.allocatedToken,
    ) *
      10000) /
      publicRound1TokenAllocation,
  ];

  const publicRound1AllocationWei = convertToWei(
    String(PublicVaultData.publicRound1Allocation),
  );
  const publicRound2AllocationWei = convertToWei(
    String(PublicVaultData.publicRound2Allocation),
  );
  const hardCapWei = convertToWei(String(PublicVaultData.hardCap));
  const param1 = [
    publicRound1AllocationWei,
    publicRound2AllocationWei,
    100,
    (testValue().projectTokenPrice ) * 100,
    hardCapWei,
    PublicVaultData.tokenAllocationForLiquidity,
  ];

  const param2 = [
    PublicVaultData.snapshot,
    PublicVaultData.whitelist,
    PublicVaultData.whitelistEnd,
    PublicVaultData.publicRound1,
    PublicVaultData.publicRound1End,
    PublicVaultData.publicRound2,
    PublicVaultData.publicRound2End,
    PublicVaultData.claim.length,
  ];

  const param3 = PublicVaultData.claim.map(
    (claimRound) => claimRound.claimTime,
  );

  const {publicRound1Allocation, publicRound2Allocation} = PublicVaultData;
  const allTokenAllocation = Number(publicRound1Allocation) + Number(publicRound2Allocation);

  const param4 = PublicVaultData.claim.map(
    (claimRound) =>
      ((claimRound.claimTokenAllocation) * 100) /
      allTokenAllocation,
  );

  console.log('params' , param0, param1, param2, param3, param4);

  const publicVaultSecondContract = new ethers.Contract(PUBLIC_VAULT_ADDRESS, PUBLIC_SALE.abi, signer);

  const tx = await publicVaultSecondContract
    ?.connect(signer).setAllsetting(param0, param1, param2, param3, param4);
  const receipt = await tx.wait();

  if(receipt) {
    console.log('Public Vault is initialized');
  }
}

const initLiquidityIncentiveVault = async () => {
  console.log('Initializing Liquidity incentive Vault');
  const selectedVaultDetail = testValue().vaults[6];

  const claimTimesParam = selectedVaultDetail?.claim.map(
    (claimData) => claimData.claimTime,
  );
  const claimAmountsParam = selectedVaultDetail?.claim.map(
    (claimData) => {
      const claimTokenAllocationWei = convertToWei(
        String(claimData.claimTokenAllocation),
      );
      return claimTokenAllocationWei;
    },
  );
  const vaultTokenAllocationWei = convertToWei(
    String(selectedVaultDetail?.vaultTokenAllocation),
  );
  const LiquidityIncentiveInitialize_CONTRACT = new ethers.Contract(
    LI_VAULT_ADDRESS,
    VaultLPRewardLogicAbi.abi,
    signer,
  );
  const tx = await LiquidityIncentiveInitialize_CONTRACT?.connect(
    signer,
  ).initialize(
    vaultTokenAllocationWei,
    selectedVaultDetail?.claim.length,
    claimTimesParam,
    claimAmountsParam,
  );
  const receipt = await tx.wait();

  if (receipt) {
    console.log('LIncentive Vault is initialized');
  }
}

const initVestingVault = async () => {
  console.log('Initializing Vesting Vault..');
  const selectedVaultDetail = testValue().vaults[2];
  const claimTimesParam = selectedVaultDetail?.claim.map(
    (claimData) => claimData.claimTime,
  );

  let tempSum = 0;

  const claimAmountsParam = selectedVaultDetail?.claim.map(
    (claimData) => {
      return (tempSum += Number(claimData.claimTokenAllocation));
    },
  );
  const VestingVaultSecondContract = new ethers.Contract(
    VESTING_VAULT_ADDRESS,
    VestingPublicFundAbi.abi,
    signer,
  );

  const tx = await VestingVaultSecondContract?.connect(
    signer,
  ).initialize(
    testValue().vaults[0].vaultAddress,
    testValue().tokenAddress,
    claimTimesParam,
    claimAmountsParam,
    3000,
  );
  const receipt = await tx.wait();

  if (receipt) {
   console.log('Vesting vault is initialized');
}
}

const initTONStakerVault = async () => {
  console.log('Initializing TONStaker Vault..');
  const selectedVaultDetail = testValue().vaults[3];
  const claimTimesParam = selectedVaultDetail?.claim.map(
    (claimData) => claimData.claimTime,
  );
  const claimAmountsParam = selectedVaultDetail?.claim.map(
    (claimData) => {
      const claimTokenAllocationWei = convertToWei(
        String(claimData.claimTokenAllocation),
      );
      return claimTokenAllocationWei;
    },
  );

  const vaultTokenAllocationWei = convertToWei(
    String(selectedVaultDetail.vaultTokenAllocation),
  );

  const TONStakerVaultSecondContract = new ethers.Contract(
    TONSTAKER_VAULT_ADDRESS,
    TONStakerInitializeAbi.abi,
    signer,
  );

  const tx = await TONStakerVaultSecondContract?.connect(
    signer,
  ).initialize(
    vaultTokenAllocationWei,
    selectedVaultDetail?.claim.length,
    claimTimesParam,
    claimAmountsParam,
  );
  const receipt = await tx.wait();
  if (receipt) {
    console.log('TONStaker vault is initialized');
  }


}

const initTOSStakerVault = async () => {
  console.log('Initializing TOS Staker Vault..');
  const selectedVaultDetail = testValue().vaults[4];
  const claimTimesParam = selectedVaultDetail?.claim.map(
    (claimData) => claimData.claimTime,
  );
  const claimAmountsParam = selectedVaultDetail?.claim.map(
    (claimData) => {
      const claimTokenAllocationWei = convertToWei(
        String(claimData.claimTokenAllocation),
      );
      return claimTokenAllocationWei;
    },
  );
  const vaultTokenAllocationWei = convertToWei(
    String(selectedVaultDetail?.vaultTokenAllocation),
  );
  const TOSStakerVaultSecondContract = new ethers.Contract(
    TOSSTAKER_VAULT_ADDRESS,
    TOSStakerInitializeAbi.abi,
    signer,
  );
  const tx = await TOSStakerVaultSecondContract?.connect(
    signer,
  ).initialize(
    vaultTokenAllocationWei,
    selectedVaultDetail?.claim.length,
    claimTimesParam,
    claimAmountsParam,
  );
  const receipt = await tx.wait();
  if (receipt) {
    console.log('TOS Staker vault initialized');
  }
}

// WTON - TOS LP Reward
const initLPRewardVault = async () => {
  console.log('Initializing LP Reward Vault..');
  const selectedVaultDetail = testValue.vaults[5];
  const claimTimesParam = selectedVaultDetail?.claim.map(
    (claimData) => claimData.claimTime,
  );
  const claimAmountsParam = selectedVaultDetail?.claim.map(
    (claimData) => {
      const claimTokenAllocationWei = convertToWei(
        String(claimData.claimTokenAllocation),
      );
      return claimTokenAllocationWei;
    },
  );

  const LPVaultSecondContract = new ethers.Contract(
    LPR_VAULT_ADDRESS,
    LPRewardInitializeAbi.abi,
    signer,
  );

  const vaultTokenAllocationWei = convertToWei(
    String(selectedVaultDetail?.vaultTokenAllocation),
  );

  const tx = await LPVaultSecondContract?.connect(
    signer,
  ).initialize(
    vaultTokenAllocationWei,
    selectedVaultDetail?.claim.length,
    claimTimesParam,
    claimAmountsParam,
  );
  const receipt = await tx.wait();
  if(receipt) {
    console.log('initialized LP Reward');
  }
}

const initializeVaults = async () => {
  await initILVault();
  await initVestingVault();
  await initPublicVault();
  await initTONStakerVault();
  await initTOSStakerVault();
  await initLPRewardVault();
  await initLiquidityIncentiveVault();
}

deployToken();
startDeployVaults();
sendTokens();
initializeVaults();

