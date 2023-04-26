import {
  Projects,
  VaultAny,
  VaultCommon,
  VaultType,
  VaultSchedule,
  Step3_InfoList,
  VaultLiquidityIncentive,
  VaultPublic,
} from '@Launch/types';
import {DEPLOYED} from 'constants/index';
import {useFormikContext} from 'formik';
import {LibraryType} from 'types';
import {shortenAddress} from 'utils';
import {Contract} from '@ethersproject/contracts';
import {useActiveWeb3React} from 'hooks/useWeb3';
import {openModal} from 'store/modal.reducer';
import {useAppDispatch, useAppSelector} from 'hooks/useRedux';
import {selectApp} from 'store/app/app.reducer';
import useVaultSelector from '@Launch/hooks/useVaultSelector';
import {getSigner} from 'utils/contract';
import {ethers} from 'ethers';
import {useBlockNumber} from 'hooks/useBlock';
import {useContract} from 'hooks/useContract';
import InitialLiquidityAbi from 'services/abis/Vault_InitialLiquidity.json';
import Vault_InitialLiquidityComputeAbi from 'services/abis/Vault_InitialLiquidityCompute.json';
import * as ERC20 from 'services/abis/erc20ABI(SYMBOL).json';
import * as LiquidityIncentiveAbi from 'services/abis/LiquidityIncentiveAbi.json';
import * as PublicSaleVaultCreateAbi from 'services/abis/PublicSaleVaultCreateAbi.json';
import * as PublicSaleVaultAbi from 'services/abis/PublicSaleVault.json';
import * as PublicSale from 'services/abis/PublicSale.json';

import * as TONStakerAbi from 'services/abis/TONStakerAbi.json';
import * as TONStakerInitializeAbi from 'services/abis/TONStakerInitializeAbi.json';
import * as TOSStakerAbi from 'services/abis/TOSStakerAbi.json';
import * as TOSStakerInitializeAbi from 'services/abis/TOSStakerInitializeAbi.json';
import * as LPrewardVaultAbi from 'services/abis/LPrewardVaultAbi.json';
import * as LPRewardInitializeAbi from 'services/abis/LPRewardInitializeAbi.json';
import * as VaultCFactoryAbi from 'services/abis/VaultCFactoryAbi.json';
import * as VaultCLogicAbi from 'services/abis/VaultCLogicAbi.json';
import * as InitialLiquidityVault from 'services/abis/InitialLiquidityVault.json';
import VaultLPRewardLogicAbi from 'services/abis/VaultLPRewardLogicAbi.json';
import * as VestingPublicFundAbi from 'services/abis/VestingPublicFund.json';
import * as VestingPublicFundFactoryAbi from 'services/abis/VestingPublicFundFactory.json';
import {convertNumber, convertToWei} from 'utils/number';
import commafy from 'utils/commafy';
import {convertTimeStamp} from 'utils/convertTIme';
import {selectLaunch, setTempHash} from '@Launch/launch.reducer';
import bn from 'bignumber.js';
import {AppDispatch} from 'store';
import truncNumber from 'utils/truncNumber';
import {setTx} from 'application';
import store from 'store';
import {setTxPending} from 'store/tx.reducer';
import {toastWithReceipt} from 'utils';
import {openToast} from 'store/app/toast.reducer';
function encodePriceSqrt(reserve1: number, reserve0: number) {
  return new bn(reserve1.toString())
    .div(reserve0.toString())
    .sqrt()
    .multipliedBy(new bn(2).pow(96))
    .integerValue(3)
    .toFixed();
}

function getContract(vaultType: VaultType, library: LibraryType) {
  switch (vaultType) {
    case 'Public': {
      const {PublicSaleVault} = DEPLOYED;
      const contract = new Contract(
        PublicSaleVault,
        PublicSaleVaultCreateAbi.abi,
        library,
      );
      return contract;
    }
    case 'Initial Liquidity': {
      const {InitialLiquidityVault} = DEPLOYED;
      const contract = new Contract(
        InitialLiquidityVault,
        InitialLiquidityAbi.abi,
        library,
      );
      return contract;
    }
    case 'Vesting': {
      const {VestingVault} = DEPLOYED;
      const contract = new Contract(
        VestingVault,
        VestingPublicFundFactoryAbi.abi,
        library,
      );
      return contract;
    }
    case 'Liquidity Incentive': {
      const {LiquidityIncentiveVault} = DEPLOYED;
      const contract = new Contract(
        LiquidityIncentiveVault,
        LiquidityIncentiveAbi.abi,
        library,
      );
      return contract;
    }
    case 'TON Staker': {
      const {TonStakerVault} = DEPLOYED;
      const contract = new Contract(TonStakerVault, TONStakerAbi.abi, library);
      return contract;
    }
    case 'TOS Staker': {
      const {TosStakerVault} = DEPLOYED;
      const contract = new Contract(TosStakerVault, TOSStakerAbi.abi, library);
      return contract;
    }
    case 'WTON-TOS LP Reward': {
      const {LPrewardVault} = DEPLOYED;
      const contract = new Contract(
        LPrewardVault,
        LPrewardVaultAbi.abi,
        library,
      );
      return contract;
    }
    case 'C': {
      const {TypeCVault} = DEPLOYED;
      const contract = new Contract(TypeCVault, VaultCFactoryAbi.abi, library);
      return contract;
    }
    default:
      break;
  }
}

async function checkIsIniailized(
  vaultType: VaultType,
  library: LibraryType,
  selectedVaultDetail: VaultAny,
  setFieldValue: (
    field: string,
    value: any,
    shouldValidate?: boolean | undefined,
  ) => void,
) {
  switch (vaultType) {
    case 'Public': {
      const PublicVaultData = selectedVaultDetail as VaultPublic;
      if (
        PublicVaultData.vaultAddress !== '' ||
        PublicVaultData.vaultAddress !== undefined
      ) {
        const publicVaultSecondContract = new Contract(
          PublicVaultData.vaultAddress as string,
          PublicSale.abi,
          library,
        );
        const snapshot = await publicVaultSecondContract.snapshot();
        const isInitialized = Number(snapshot.toString()) !== 0;

        return setFieldValue(
          `vaults[${selectedVaultDetail?.index}].isSet`,
          isInitialized,
        );
      }
      break;
    }
    case 'Initial Liquidity': {
      if (
        selectedVaultDetail.vaultAddress !== '' ||
        selectedVaultDetail.vaultAddress !== undefined
      ) {
        const publicVaultSecondContract = new Contract(
          selectedVaultDetail.vaultAddress as string,
          InitialLiquidityVault.abi,
          library,
        );
        const initSqrtPriceX96 =
          await publicVaultSecondContract.initSqrtPriceX96();
        const isInitialized = Number(initSqrtPriceX96.toString()) > 0;

        return setFieldValue(
          `vaults[${selectedVaultDetail?.index}].isSet`,
          isInitialized,
        );
      }
      break;
    }

    default: {
      if (
        selectedVaultDetail.vaultAddress !== '' ||
        selectedVaultDetail.vaultAddress !== undefined
      ) {
        const vualtContract = new Contract(
          selectedVaultDetail.vaultAddress as string,
          VestingPublicFundAbi.abi,
          library,
        );
        const isInitialized = await vualtContract.settingCheck();

        return setFieldValue(
          `vaults[${selectedVaultDetail?.index}].isSet`,
          isInitialized,
        );
      }
      break;
    }
  }
}

const returnVaultStatus = (
  values: Projects['CreateSimplifiedProject'],
  vaultType: VaultType,
  selectedVaultDetail: VaultAny,
  hasToken: boolean,
  setVaultState: React.Dispatch<React.SetStateAction<any>>,
) => {
  const isTokenDeployed = values.isTokenDeployed;
  const isLPDeployed = values.vaults[1].isDeployed;
  const isVestingDeployed = values.vaults[2].isDeployed;
  const isVaultDeployed = selectedVaultDetail?.isDeployed;
  const isSet = selectedVaultDetail?.isSet;
  const vaultDeployReady =
    vaultType === 'Initial Liquidity'
      ? isTokenDeployed && !isVaultDeployed
      : vaultType === 'Vesting'
      ? isTokenDeployed && isLPDeployed && !isVaultDeployed
      : isTokenDeployed &&
        isLPDeployed &&
        isVestingDeployed &&
        !isVaultDeployed;

  if (isSet) {
    return setVaultState('finished');
  }

  if (vaultType === 'Vesting') {
    const publicVault = values.vaults[0];
    return setVaultState(
      !vaultDeployReady && !isVaultDeployed
        ? 'notReady'
        : vaultDeployReady && !isVaultDeployed
        ? 'ready'
        : isVaultDeployed && publicVault.isDeployed && publicVault.vaultAddress
        ? 'readyForSet'
        : 'finished',
    );
  }

  setVaultState(
    !vaultDeployReady && !isVaultDeployed
      ? 'notReady'
      : vaultDeployReady
      ? 'ready'
      : isVaultDeployed && !hasToken
      ? 'readyForToken'
      : isVaultDeployed && hasToken
      ? 'readyForSet'
      : 'finished',
  );
};

async function deploy(
  account: string | null | undefined,
  library: LibraryType,
  vaultState: string,
  vaultType: VaultType,
  selectedVaultDetail: VaultLiquidityIncentive | VaultAny,
  values: Projects['CreateSimplifiedProject'],
  dispatch: any,
  setFieldValue: (
    field: string,
    value: any,
    shouldValidate?: boolean | undefined,
  ) => void,
  setVaultState: React.Dispatch<React.SetStateAction<any>>,
) {
  if (account && library && vaultState === 'Deploy') {
    const vaultContract = getContract(vaultType, library);
    const signer = getSigner(library, account);

    try {
      switch (vaultType) {
        case 'Initial Liquidity': {
          const tx = await vaultContract
            ?.connect(signer)
            .create(
              selectedVaultDetail?.vaultName,
              values.tokenAddress,
              selectedVaultDetail?.adminAddress,
              100,
              parseInt((values.tosPrice * 100).toString()),
            );

          dispatch(
            setTempHash({
              data: tx.hash,
            }),
          );
          store.dispatch(setTxPending({tx: true, data: 'DeployInitial'}));
          toastWithReceipt(tx, setTxPending, 'Launch');
          const receipt = await tx.wait();
          const {logs} = receipt;

          const iface = new ethers.utils.Interface(InitialLiquidityAbi.abi);

          const result = iface.parseLog(logs[logs.length - 1]);
          const {args} = result;
          setFieldValue(
            `vaults[${selectedVaultDetail?.index}].vaultAddress`,
            args[0],
          );
          setFieldValue(
            `vaults[${selectedVaultDetail?.index}].isDeployed`,
            true,
          );
          setVaultState('readyForToken');
          break;
        }
        case 'Public': {
          // 0 : name : string
          // 1 : owner : address
          // 2 : saleAddresses[3] : [addr, addr, addr]
          // [projectToken, receivingAddress, Initial Liquidity]
          // 3 : index : uint256
          const {InitialLiquidityVault} = DEPLOYED;
          const InitialLiquidity_Contract = new Contract(
            InitialLiquidityVault,
            InitialLiquidityAbi.abi,
            library,
          );

          const getTotalIndex = async () => {
            const totalIndex =
              await InitialLiquidity_Contract.totalCreatedContracts();
            return Number(totalIndex.toString());
          };

          const totalVaultIndex = await getTotalIndex();
          let valutIndex = totalVaultIndex;

          do {
            valutIndex--;
            try {
              const vault = await InitialLiquidity_Contract.createdContracts(
                valutIndex,
              );
              if (vault.contractAddress === values.vaults[1].vaultAddress) {
                break;
              }
            } catch (e) {}
          } while (valutIndex >= 0);

          const tx = await vaultContract
            ?.connect(signer)
            .create(
              `${values.projectName}_${selectedVaultDetail?.vaultName}`,
              selectedVaultDetail?.adminAddress,
              [
                values.tokenAddress,
                values.vaults[2].vaultAddress,
                values.vaults[1].vaultAddress,
              ],
              valutIndex,
            );

          dispatch(
            setTempHash({
              data: tx.hash,
            }),
          );
          store.dispatch(setTxPending({tx: true, data: 'DeployPublic'}));
          toastWithReceipt(tx, setTxPending, 'Launch');
          const receipt = await tx.wait();
          const {logs} = receipt;

          const iface = new ethers.utils.Interface(
            PublicSaleVaultCreateAbi.abi,
          );

          const result = iface.parseLog(logs[logs.length - 1]);
          const {args} = result;

          if (args) {
            setFieldValue(
              `vaults[${selectedVaultDetail?.index}].vaultAddress`,
              args[0],
            );
            setFieldValue(
              `vaults[${selectedVaultDetail?.index}].isDeployed`,
              true,
            );
            setVaultState('readyForToken');
          }
          break;
        }
        case 'Vesting': {
          // 0: name : string
          // 1: addressForReceiving : address

          const tx = await vaultContract?.connect(signer).create(
            `${values.projectName}_${selectedVaultDetail?.vaultName}`,
            //@ts-ignore
            values.vaults[0].addressForReceiving,
          );

          dispatch(
            setTempHash({
              data: tx.hash,
            }),
          );
          store.dispatch(setTxPending({tx: true, data: 'DeployVesting'}));
          toastWithReceipt(tx, setTxPending, 'Launch');
          const receipt = await tx.wait();
          const {logs} = receipt;

          const iface = new ethers.utils.Interface(
            VestingPublicFundFactoryAbi.abi,
          );

          const result = iface.parseLog(logs[logs.length - 1]);
          const {args} = result;

          if (args) {
            setFieldValue(
              `vaults[${selectedVaultDetail?.index}].vaultAddress`,
              args[0],
            );
            setFieldValue(
              `vaults[${selectedVaultDetail?.index}].isDeployed`,
              true,
            );
            setVaultState('readyForSet');
          }
          break;
        }
        case 'TON Staker': {
          // 0: name : string
          // 1: _token : address
          // 2: _owner : address
          const tx = await vaultContract
            ?.connect(signer)
            .create(
              `${values.projectName}_${selectedVaultDetail?.vaultName}`,
              values.tokenAddress,
              selectedVaultDetail?.adminAddress,
            );

          dispatch(
            setTempHash({
              data: tx.hash,
            }),
          );
          store.dispatch(setTxPending({tx: true, data: 'DeployTON'}));
          toastWithReceipt(tx, setTxPending, 'Launch');
          const receipt = await tx.wait();
          const {logs} = receipt;

          const iface = new ethers.utils.Interface(TONStakerAbi.abi);

          const result = iface.parseLog(logs[logs.length - 1]);
          const {args} = result;

          if (args) {
            setFieldValue(
              `vaults[${selectedVaultDetail?.index}].vaultAddress`,
              args[0],
            );
            setFieldValue(
              `vaults[${selectedVaultDetail?.index}].isDeployed`,
              true,
            );
            setVaultState('readyForToken');
          }
          break;
        }
        case 'TOS Staker': {
          // 0: name : string
          // 1: _token : address
          // 2: _owner : address
          const tx = await vaultContract
            ?.connect(signer)
            .create(
              `${values.projectName}_${selectedVaultDetail?.vaultName}`,
              values.tokenAddress,
              selectedVaultDetail?.adminAddress,
            );

          dispatch(
            setTempHash({
              data: tx.hash,
            }),
          );
          store.dispatch(setTxPending({tx: true, data: 'DeployTOS'}));
          toastWithReceipt(tx, setTxPending, 'Launch');
          const receipt = await tx.wait();
          const {logs} = receipt;

          const iface = new ethers.utils.Interface(TOSStakerAbi.abi);

          const result = iface.parseLog(logs[logs.length - 1]);
          const {args} = result;

          setFieldValue(
            `vaults[${selectedVaultDetail?.index}].vaultAddress`,
            args[0],
          );
          setFieldValue(
            `vaults[${selectedVaultDetail?.index}].isDeployed`,
            true,
          );
          setVaultState('readyForToken');
          break;
        }
        case 'WTON-TOS LP Reward': {
          // 0: name : string
          // 1 : pool : address
          // 2 : rewardToken : address
          // 3 : _admin : address
          const {
            pools: {TOS_WTON_POOL},
          } = DEPLOYED;

          const tx = await vaultContract
            ?.connect(signer)
            .create(
              `${values.projectName}_${selectedVaultDetail?.vaultName}`,
              TOS_WTON_POOL,
              values.tokenAddress,
              selectedVaultDetail?.adminAddress,
            );

          dispatch(
            setTempHash({
              data: tx.hash,
            }),
          );
          store.dispatch(setTxPending({tx: true, data: 'DeployWTON'}));
          toastWithReceipt(tx, setTxPending, 'Launch');
          const receipt = await tx.wait();
          const {logs} = receipt;

          const iface = new ethers.utils.Interface(LPrewardVaultAbi.abi);

          const result = iface.parseLog(logs[logs.length - 1]);
          const {args} = result;

          setFieldValue(
            `vaults[${selectedVaultDetail?.index}].vaultAddress`,
            args[0],
          );
          setFieldValue(
            `vaults[${selectedVaultDetail?.index}].isDeployed`,
            true,
          );
          setVaultState('readyForToken');
          break;
        }
        case 'Liquidity Incentive': {
          // 0: name : string
          // 1 : pool : address
          // 2 : rewardToken : address
          // 3 : _admin : address
          const {TOS_ADDRESS} = DEPLOYED;
          const InitialLiquidity_Contract = new Contract(
            //@ts-ignore
            values.vaults[1].vaultAddress,
            Vault_InitialLiquidityComputeAbi.abi,
            library,
          );

          const poolAddress =
            await InitialLiquidity_Contract.computePoolAddress(
              values.tokenAddress,
              TOS_ADDRESS,
              3000,
            );

          //@ts-ignore
          const tx = await vaultContract?.connect(signer).create(
            `${values.projectName}_${selectedVaultDetail?.vaultName}`,
            //@ts-ignore
            selectedVaultDetail.isMandatory === true
              ? poolAddress[0]
              : //@ts-ignore
                selectedVaultDetail.poolAddress,
            values.tokenAddress,
            selectedVaultDetail?.adminAddress,
          );

          dispatch(
            setTempHash({
              data: tx.hash,
            }),
          );
          store.dispatch(setTxPending({tx: true, data: 'DeployLiquidity'}));
          toastWithReceipt(tx, setTxPending, 'Launch');

          const receipt = await tx.wait();
          const {logs} = receipt;

          const iface = new ethers.utils.Interface(LPrewardVaultAbi.abi);

          const result = iface.parseLog(logs[logs.length - 1]);
          const {args} = result;

          setFieldValue(
            `vaults[${selectedVaultDetail?.index}].vaultAddress`,
            args[0],
          );
          setFieldValue(
            `vaults[${selectedVaultDetail?.index}].isDeployed`,
            true,
          );
          setVaultState('readyForToken');
          break;
        }
        case 'C': {
          // 0: name : string
          // 1: _token : address
          // 2: _owner : address
          const tx = await vaultContract
            ?.connect(signer)
            .createTypeC(
              `${values.projectName}_${selectedVaultDetail?.vaultName}`,
              values.tokenAddress,
              selectedVaultDetail?.adminAddress,
            );

          dispatch(
            setTempHash({
              data: tx.hash,
            }),
          );
          store.dispatch(setTxPending({tx: true, data: `Deploy${selectedVaultDetail.vaultName}`}));
          toastWithReceipt(tx, setTxPending, 'Launch');
          const receipt = await tx.wait();
          const {logs} = receipt;

          const iface = new ethers.utils.Interface(VaultCFactoryAbi.abi);

          const result = iface.parseLog(logs[logs.length - 1]);
          const {args} = result;

          if (args) {
            setFieldValue(
              `vaults[${selectedVaultDetail?.index}].vaultAddress`,
              args[0],
            );
            setFieldValue(
              `vaults[${selectedVaultDetail?.index}].isDeployed`,
              true,
            );
            setVaultState('readyForToken');
          }
          break;
        }

        default:
          break;
      }
    } catch (e) {
      console.log(e);
      setFieldValue(
        `vaults[${selectedVaultDetail?.index}].isDeployedErr`,
        true,
      );
    }
  }

  if (account && library && vaultState === 'Initialize') {
    const signer = getSigner(library, account);

    // console.log(selectedVaultDetail);

    try {
      switch (vaultType) {
        case 'Initial Liquidity': {
          const {TOS_ADDRESS} = DEPLOYED;
          const InitialLiquidityVault_Contract = new Contract(
            selectedVaultDetail.vaultAddress as string,
            InitialLiquidityVault.abi,
            library,
          );

          const projectTokenPrice = truncNumber((values.tosPrice * 100),0);
          const vaultTokenAllocationWei = convertToWei(
            String(selectedVaultDetail?.vaultTokenAllocation),
          );          

          const computePoolAddress =
            await InitialLiquidityVault_Contract.connect(
              signer,
            ).computePoolAddress(TOS_ADDRESS, values.tokenAddress, 3000);

          const selected = selectedVaultDetail as VaultLiquidityIncentive;

          const reserv0 =
            computePoolAddress[1] === TOS_ADDRESS ? 100 : projectTokenPrice;
          const reserv1 =
            computePoolAddress[2] === TOS_ADDRESS ? 100 : projectTokenPrice;

          console.log(
            vaultTokenAllocationWei,
            100,
            projectTokenPrice,
            encodePriceSqrt(reserv1, reserv0),

            selected.startTime,
          );

          const tx = await InitialLiquidityVault_Contract?.connect(
            signer,
          ).initialize(
            vaultTokenAllocationWei,
            100,
            projectTokenPrice,
            encodePriceSqrt(reserv1, reserv0),
            //@ts-ignore
            selectedVaultDetail.startTime,
          );
          store.dispatch(setTxPending({tx: true, data: 'InitializeInitial'}));
          toastWithReceipt(tx, setTxPending, 'Launch');

          const receipt = await tx.wait();

          if (receipt) {
            setFieldValue(`vaults[${selectedVaultDetail?.index}].isSet`, true);
            setVaultState('finished');
          }
          break;
        }
        case 'Public': {
          // 0 : _Tier : uint256[8]
          // 1 : _amount : uint256[6]
          // 2 : _time : uint256[8]
          // 3 : _claimTimes : uint256[]
          // 4 : _claimPercents : uint256[]
          const PublicVaultData = selectedVaultDetail as VaultPublic;
          const publicRound1TokenAllocation =
            PublicVaultData.publicRound1Allocation as number;

          // _Tier[0] : Tier1의 sTOS 기준
          // _Tier[2] : Tier3의 sTOS 기준
          // _Tier[1] : Tier2의 sTOS 기준
          // _Tier[3] : Tier4의 sTOS 기준
          // _Tier[4] : Tier1의 percent
          // _Tier[5] : Tier2의 percent
          // _Tier[6] : Tier3의 percent
          // (Tier[4]~Tier[7]의 합은 10000)
          // _Tier[7] : Tier4의 percent
          // console.log('PublicVaultData',(Number(PublicVaultData.stosTier.oneTier.allocatedToken as number) *
          // 10000));

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


          const t1 = truncNumber(
            (Number(PublicVaultData.stosTier.oneTier.allocatedToken as number) *
              10000) /
              publicRound1TokenAllocation,
            0,
          );
          const t2 = truncNumber(
            (Number(PublicVaultData.stosTier.twoTier.allocatedToken as number) *
              10000) /
              publicRound1TokenAllocation,
            0,
          );
          const t3 = truncNumber(
            (Number(
              PublicVaultData.stosTier.threeTier.allocatedToken as number,
            ) *
              10000) /
              publicRound1TokenAllocation,
            0,
          );
          const t4 =
            (publicRound1TokenAllocation * 10000) /
              publicRound1TokenAllocation -
            (t1 + t2 + t3);

          const param0: any[] = [
            tier1RequiredStosWei,
            tier2RequiredStosWei,
            tier3RequiredStosWei,
            tier4RequiredStosWei,
            t1,
            t2,
            t3,
            t4,
          ];
          // _amount[0] : Round1에서의 토큰 판매수량
          // _amount[1] : Round2에서의 토큰 판매수량
          // _amount[2] : 판매토큰 가격
          // _amount[3] : 톤 토큰 가격
          // _amount[4] : hardhat수량(TON기준)
          // _amount[5] : TON → TOS 변경 % (min ~ max)
          const publicRound1AllocationWei = convertToWei(
            String(PublicVaultData.publicRound1Allocation),
          );
          const publicRound2AllocationWei = convertToWei(
            String(PublicVaultData.publicRound2Allocation),
          );
          const hardCapWei = convertToWei(String(PublicVaultData.hardCap));
          const param1: any[] = [
            publicRound1AllocationWei,
            publicRound2AllocationWei,
            100,
            parseInt(((values.projectTokenPrice as number) * 100).toString()),
            hardCapWei,
            PublicVaultData.tokenAllocationForLiquidity as number,
          ];
          // _time[0] : sTOS snapshot 시간
          // _time[1] : 화이트리스트 시작시간
          // _time[2] : 화이트리스트 마감시간
          // _time[3] : round1 세일 시작시간
          // _time[4] : round1 세일 마감시간
          // _time[5] : round2 deposit 시작시간
          // _time[6] : round2 deposit 마감시간
          // _time[7] : 총 클레임 round 수
          const param2: number[] = [
            PublicVaultData.snapshot as number,
            PublicVaultData.whitelist as number,
            PublicVaultData.whitelistEnd as number,
            PublicVaultData.publicRound1 as number,
            PublicVaultData.publicRound1End as number,
            PublicVaultData.publicRound2 as number,
            PublicVaultData.publicRound2End as number,
            PublicVaultData.claim.length,
          ];
          //_claimTimes[] : 클레임 시간 배열
          const param3: number[] = PublicVaultData.claim.map(
            (claimRound: VaultSchedule) => claimRound.claimTime,
          ) as number[];
          // _claimPercents[] : 클레임 percents 배열(claimPercents의 합은 100)
          const {publicRound1Allocation, publicRound2Allocation} =
            PublicVaultData;
          const allTokenAllocation =
            Number(publicRound1Allocation as number) +
            Number(publicRound2Allocation as number);
          //   (PublicVaultData.publicRound2Allocation as number)

          const param4: number[] = PublicVaultData.claim.map(
            (claimRound: VaultSchedule, index: number) =>
              truncNumber(
                ((claimRound.claimTokenAllocation as number) * 10000) /
                  allTokenAllocation,
                0,
              ),
          ) as number[];

          const xx = param4.reduce((partialSum, a) => partialSum + a, 0);
          const lastEl = param4[param4.length - 1] + (10000 - xx);
          param4[param4.length - 1] = lastEl;
          console.log('--params--');
          console.log(param0, param1, param2, param3, param4);

          const publicVaultSecondContract = new Contract(
            PublicVaultData.vaultAddress as string,
            PublicSale.abi,
            library,
          );

          const tx = await publicVaultSecondContract
            ?.connect(signer)
            .setAllsetting(param0, param1, param2, param3, param4);
          store.dispatch(setTxPending({tx: true,data: 'InitializePublic'}));
          toastWithReceipt(tx, setTxPending, 'Launch');
          const receipt = await tx.wait();
          if (receipt) {
            setFieldValue(`vaults[${selectedVaultDetail?.index}].isSet`, true);
            setVaultState('finished');
          }
          break;
        }
        case 'Liquidity Incentive': {
          // 0: _totalAllocatedAmountme : uint256
          // 1 : _claimCounts : uint256
          // 2 : _claimTimes : uint256[]
          // 3 : _claimAmounts : uint256[]
          const claimTimesParam = selectedVaultDetail?.claim.map(
            (claimData: VaultSchedule) => claimData.claimTime,
          );
          const claimAmountsParam = selectedVaultDetail?.claim.map(
            (claimData: VaultSchedule) => {
              const claimTokenAllocationWei = convertToWei(
                String(claimData.claimTokenAllocation),
              );
              return claimTokenAllocationWei;
            },
          );
          const vaultTokenAllocationWei = convertToWei(
            String(selectedVaultDetail?.vaultTokenAllocation),
          );
          const LiquidityIncentiveInitialize_CONTRACT = new Contract(
            selectedVaultDetail?.vaultAddress as string,
            VaultLPRewardLogicAbi.abi,
            library,
          );
          const tx = await LiquidityIncentiveInitialize_CONTRACT?.connect(
            signer,
          ).initialize(
            vaultTokenAllocationWei,
            selectedVaultDetail?.claim.length,
            claimTimesParam,
            claimAmountsParam,
          );
          store.dispatch(setTxPending({tx: true,data: 'InitializeLiquidity'}));
          toastWithReceipt(tx, setTxPending, 'Launch');
          const receipt = await tx.wait();

          if (receipt) {
            setFieldValue(`vaults[${selectedVaultDetail?.index}].isSet`, true);
            setVaultState('finished');
          }
          break;
        }

        case 'Vesting': {
          // await vestingPublicFund.connect(receivedAddress).initialize(
          //   info.publicSaleVault.address, /// 퍼블릭볼트 주소
          //   info.tokenAddress, /// 프로젝트 토큰 주소
          //   vaultInfo.claimTimes,
          //   vaultInfo.claimAmounts,
          //   3000, // TOS-projectToken Pool 의 fee.
          // );
          // 0: publicSaleVaultAddress : string
          // 1 : tokenAddress : string
          // 2 : _claimTimes : uint256[]
          // 3 : _claimAmounts : uint256[]
          // 4 : TOS-projectToken pool fee : uint256

          const claimTimesParam = selectedVaultDetail?.claim.map(
            (claimData: VaultSchedule) => claimData.claimTime,
          );

          let tempSum = 0;

          const claimAmountsParam = selectedVaultDetail?.claim.map(
            (claimData: VaultSchedule) => {
              return (tempSum += Number(claimData.claimTokenAllocation));
            },
          );
          const VestingVaultSecondContract = new Contract(
            selectedVaultDetail.vaultAddress as string,
            VestingPublicFundAbi.abi,
            library,
          );

          const tx = await VestingVaultSecondContract?.connect(
            signer,
          ).initialize(
            values.vaults[0].vaultAddress,
            values.tokenAddress,
            claimTimesParam,
            claimAmountsParam,
            3000,
          );
          store.dispatch(setTxPending({tx: true, data: 'InitializeVesting'}));
          toastWithReceipt(tx, setTxPending, 'Launch');
          const receipt = await tx.wait();

          if (receipt) {
            setFieldValue(`vaults[${selectedVaultDetail?.index}].isSet`, true);
            setVaultState('finished');
          }
          break;
        }

        case 'TON Staker': {
          // 0: _totalAllocatedAmountme : uint256
          // 1 : _claimCounts : uint256
          // 2 : _claimTimes : uint256[]
          // 3 : _claimAmounts : uint256[]
          const claimTimesParam = selectedVaultDetail?.claim.map(
            (claimData: VaultSchedule) => claimData.claimTime,
          );
          const claimAmountsParam = selectedVaultDetail?.claim.map(
            (claimData: VaultSchedule) => {
              const claimTokenAllocationWei = convertToWei(
                String(claimData.claimTokenAllocation),
              );
              return claimTokenAllocationWei;
            },
          );

          // console.log(claimTimesParam);
          // console.log(claimAmountsParam);
          const vaultTokenAllocationWei = convertToWei(
            String(selectedVaultDetail.vaultTokenAllocation),
          );
          const TONStakerVaultSecondContract = new Contract(
            selectedVaultDetail.vaultAddress as string,
            TONStakerInitializeAbi.abi,
            library,
          );

          const tx = await TONStakerVaultSecondContract?.connect(
            signer,
          ).initialize(
            vaultTokenAllocationWei,
            selectedVaultDetail?.claim.length,
            claimTimesParam,
            claimAmountsParam,
          );
          store.dispatch(setTxPending({tx: true, data: 'InitializeTON'}));
          toastWithReceipt(tx, setTxPending, 'Launch');
          const receipt = await tx.wait();

          if (receipt) {
            setFieldValue(`vaults[${selectedVaultDetail?.index}].isSet`, true);
            setVaultState('finished');
          }
          break;
        }
        case 'TOS Staker': {
          // 0: _totalAllocatedAmountme : uint256
          // 1 : _claimCounts : uint256
          // 2 : _claimTimes : uint256[]
          // 3 : _claimAmounts : uint256[]
          const claimTimesParam = selectedVaultDetail?.claim.map(
            (claimData: VaultSchedule) => claimData.claimTime,
          );
          const claimAmountsParam = selectedVaultDetail?.claim.map(
            (claimData: VaultSchedule) => {
              const claimTokenAllocationWei = convertToWei(
                String(claimData.claimTokenAllocation),
              );
              return claimTokenAllocationWei;
            },
          );
          const vaultTokenAllocationWei = convertToWei(
            String(selectedVaultDetail?.vaultTokenAllocation),
          );
          const TOSStakerVaultSecondContract = new Contract(
            selectedVaultDetail?.vaultAddress as string,
            TOSStakerInitializeAbi.abi,
            library,
          );
          const tx = await TOSStakerVaultSecondContract?.connect(
            signer,
          ).initialize(
            vaultTokenAllocationWei,
            selectedVaultDetail?.claim.length,
            claimTimesParam,
            claimAmountsParam,
          );
          store.dispatch(setTxPending({tx: true, data: 'InitializeTOS'}));
          toastWithReceipt(tx, setTxPending, 'Launch');
          const receipt = await tx.wait();

          if (receipt) {
            setFieldValue(`vaults[${selectedVaultDetail?.index}].isSet`, true);
            setVaultState('finished');
          }
          break;
        }
        case 'WTON-TOS LP Reward': {
          // 0: _totalAllocatedAmountme : uint256
          // 1 : _claimCounts : uint256
          // 2 : _claimTimes : uint256[]
          // 3 : _claimAmounts : uint256[]
          const claimTimesParam = selectedVaultDetail?.claim.map(
            (claimData: VaultSchedule) => claimData.claimTime,
          );
          const claimAmountsParam = selectedVaultDetail?.claim.map(
            (claimData: VaultSchedule) => {
              const claimTokenAllocationWei = convertToWei(
                String(claimData.claimTokenAllocation),
              );
              return claimTokenAllocationWei;
            },
          );

          const LPVaultSecondContract = new Contract(
            selectedVaultDetail.vaultAddress as string,
            LPRewardInitializeAbi.abi,
            library,
          );

          const vaultTokenAllocationWei = convertToWei(
            String(selectedVaultDetail?.vaultTokenAllocation),
          );

          const tx = await LPVaultSecondContract?.connect(signer).initialize(
            vaultTokenAllocationWei,
            selectedVaultDetail?.claim.length,
            claimTimesParam,
            claimAmountsParam,
          );
          store.dispatch(setTxPending({tx: true, data: 'InitializeWTON'}));
          toastWithReceipt(tx, setTxPending, 'Launch');
          const receipt = await tx.wait();

          if (receipt) {
            setFieldValue(`vaults[${selectedVaultDetail?.index}].isSet`, true);
            setVaultState('finished');
          }
          break;
        }
        case 'C': {
          // 0: _totalAllocatedAmountme : uint256
          // 1 : _claimCounts : uint256
          // 2 : _claimTimes : uint256[]
          // 3 : _claimAmounts : uint256[]
          const claimTimesParam = selectedVaultDetail?.claim.map(
            (claimData: VaultSchedule) => claimData.claimTime,
          );
          const claimAmountsParam = selectedVaultDetail?.claim.map(
            (claimData: VaultSchedule) => {
              const claimTokenAllocationWei = convertToWei(
                String(claimData.claimTokenAllocation),
              );
              return claimTokenAllocationWei;
            },
          );
          const vaultTokenAllocationWei = convertToWei(
            String(selectedVaultDetail?.vaultTokenAllocation),
          );

          const TypeCVaultLogic_CONTRACT = new Contract(
            selectedVaultDetail.vaultAddress as string,
            VaultCLogicAbi.abi,
            library,
          );

          const tx = await TypeCVaultLogic_CONTRACT?.connect(signer).initialize(
            vaultTokenAllocationWei,
            selectedVaultDetail?.claim.length,
            claimTimesParam,
            claimAmountsParam,
          );
          store.dispatch(setTxPending({tx: true, data: `Initialize${selectedVaultDetail.vaultName}`}));
          toastWithReceipt(tx, setTxPending, 'Launch');
          const receipt = await tx.wait();

          if (receipt) {
            setFieldValue(`vaults[${selectedVaultDetail?.index}].isSet`, true);
            setVaultState('finished');
          }
          break;
        }
        default:
          break;
      }
    } catch (e) {
      console.log(`******DEPLOY ERROR_${selectedVaultDetail.vaultName}******`);
      console.log(e);
      setFieldValue(
        `vaults[${selectedVaultDetail?.index}].isDeployedErr`,
        true,
      );
    }
  }
}

export {checkIsIniailized, returnVaultStatus, deploy};
