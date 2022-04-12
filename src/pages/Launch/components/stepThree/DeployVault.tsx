import {
  Flex,
  useTheme,
  Box,
  GridItem,
  useColorMode,
  Text,
  Button,
  Link,
} from '@chakra-ui/react';
import {
  Projects,
  VaultAny,
  VaultCommon,
  VaultType,
  VaultSchedule,
  Step3_InfoList,
  VaultPublic,
} from '@Launch/types';
import {DEPLOYED} from 'constants/index';
import {useFormikContext} from 'formik';
import {useCallback, useEffect, useMemo, useState} from 'react';
import {LibraryType} from 'types';
import {shortenAddress} from 'utils';
import {Contract} from '@ethersproject/contracts';
import InitialLiquidityAbi from 'services/abis/Vault_InitialLiquidity.json';
import {useActiveWeb3React} from 'hooks/useWeb3';
import {openModal} from 'store/modal.reducer';
import {useAppDispatch, useAppSelector} from 'hooks/useRedux';
import {selectApp} from 'store/app/app.reducer';
import useVaultSelector from '@Launch/hooks/useVaultSelector';
import {getSigner} from 'utils/contract';
import {ethers} from 'ethers';
import {useBlockNumber} from 'hooks/useBlock';
import {useContract} from 'hooks/useContract';
import * as ERC20 from 'services/abis/erc20ABI(SYMBOL).json';
import * as LiquidityIncentiveAbi from 'services/abis/LiquidityIncentiveAbi.json';
import * as PublicSaleVaultCreateAbi from 'services/abis/PublicSaleVaultCreateAbi.json';
import * as PublicSaleVaultAbi from 'services/abis/PublicSaleVault.json';
import * as TONStakerAbi from 'services/abis/TONStakerAbi.json';
import * as TONStakerInitializeAbi from 'services/abis/TONStakerInitializeAbi.json';
import * as TOSStakerAbi from 'services/abis/TOSStakerAbi.json';
import * as TOSStakerInitializeAbi from 'services/abis/TOSStakerInitializeAbi.json';
import * as LPrewardVaultAbi from 'services/abis/LPrewardVaultAbi.json';
import * as LPRewardInitializeAbi from 'services/abis/LPRewardInitializeAbi.json';
import * as VaultCFactoryAbi from 'services/abis/VaultCFactoryAbi.json';
import * as VaultCLogicAbi from 'services/abis/VaultCLogicAbi.json';
import * as DAOVaultAbi from 'services/abis/DAOVaultAbi.json';
import VaultLPRewardLogicAbi from 'services/abis/VaultLPRewardLogicAbi.json';
import {convertNumber, convertToWei} from 'utils/number';
import commafy from 'utils/commafy';
import {convertTimeStamp} from 'utils/convertTIme';

//Project

type DeployVaultProp = {
  vault: VaultAny;
};

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
    case 'DAO': {
      const {DAOVault} = DEPLOYED;
      const contract = new Contract(DAOVault, DAOVaultAbi.abi, library);
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

const DeployVault: React.FC<DeployVaultProp> = ({vault}) => {
  const {vaultName, vaultType} = vault;
  const theme = useTheme();
  const {OpenCampaginDesign} = theme;
  const {colorMode} = useColorMode();
  const [btnDisable, setBtnDisable] = useState(true);
  const {values, setFieldValue} = useFormikContext<Projects['CreateProject']>();
  const {account, library} = useActiveWeb3React();
  const [vaultState, setVaultState] = useState<
    'notReady' | 'ready' | 'readyForToken' | 'readyForSet' | 'finished'
  >('notReady');
  const [hasToken, setHasToken] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  // @ts-ignore
  const {data: appConfig} = useAppSelector(selectApp);
  const [infoList, setInfoList] = useState<Step3_InfoList | []>([]);
  const [infoList2, setInfoList2] = useState<Step3_InfoList | []>([]);
  const [stosTierList, setStosTierList] = useState<
    {tier: number; requiredTos: number; allocationToken: number}[] | []
  >([]);
  const {selectedVaultName} = useVaultSelector();
  const {blockNumber} = useBlockNumber();

  const vaultsList = values.vaults;
  const selectedVaultDetail = vaultsList.filter((vaultData: VaultAny) => {
    if (vaultData.vaultName === vaultName) {
      return vaultData;
    }
  })[0];

  //setVaultState
  useEffect(() => {
    const isTokenDeployed = values.isTokenDeployed;
    const isLPDeployed = values.vaults[1].isDeployed;
    const isVaultDeployed = selectedVaultDetail?.isDeployed;
    const isSet = selectedVaultDetail?.isSet;
    const vaultDeployReady =
      vaultType === 'Initial Liquidity'
        ? isTokenDeployed && !isVaultDeployed
        : isTokenDeployed && isLPDeployed && !isVaultDeployed;
    setVaultState(
      isSet
        ? 'finished'
        : !vaultDeployReady && !isVaultDeployed
        ? 'notReady'
        : vaultDeployReady
        ? 'ready'
        : isVaultDeployed && !hasToken
        ? 'readyForToken'
        : isVaultDeployed &&
          hasToken &&
          selectedVaultDetail?.vaultType !== 'Initial Liquidity' &&
          selectedVaultDetail?.vaultType !== 'DAO'
        ? 'readyForSet'
        : 'finished',
    );
  }, [values, vaultType, selectedVaultDetail, hasToken, blockNumber]);

  useEffect(() => {
    switch (vaultType) {
      case 'Initial Liquidity': {
        const info = {
          Vault: [
            {
              title: 'adminAddress',
              content: selectedVaultDetail?.adminAddress || '',
            },
            {
              title: 'Token Price',
              content: `1TOS : ${values?.tosPrice}${values?.tokenSymbol}` || '',
            },
          ],
        };
        return setInfoList(info);
      }
      case 'Public': {
        const info = {
          Vault: [
            {
              title: 'Vault Name',
              content: selectedVaultDetail?.vaultName || '-',
            },
            {
              title: 'Admin',
              content: `${selectedVaultDetail?.adminAddress || '-'}`,
              isHref: true,
            },
            {
              title: 'Contract',
              content: `${selectedVaultDetail?.vaultAddress || '-'}`,
              isHref: true,
            },
            {
              title: 'Token Allocation',
              content: `${
                commafy(selectedVaultDetail?.vaultTokenAllocation) || '-'
              } ${values.tokenName}`,
            },
          ],
          Claim: [
            {
              title: `Claim Round (${selectedVaultDetail.claim.length})`,
              content: '',
            },
            ...selectedVaultDetail.claim.map(
              (claimData: VaultSchedule, index: number) => {
                return {
                  title: `${index + 1} ${convertTimeStamp(
                    claimData.claimTime as number,
                    'DD.MM.YYYY hh:mm:ss',
                  )}`,
                  content: `${claimData.claimTokenAllocation} ${values.tokenName}`,
                };
              },
            ),
          ],
        };
        const info2 = {
          Token: [
            {
              title: 'Token',
              content: selectedVaultDetail?.vaultTokenAllocation || '-',
            },
            {
              title: 'Public Round 1',
              content: `${
                //@ts-ignore
                selectedVaultDetail?.publicRound1Allocation || '-'
              }`,
            },
            {
              title: 'Public Round 2',
              //@ts-ignore
              content: `${selectedVaultDetail?.publicRound2Allocation || '-'}`,
            },
            {
              title: 'Token Price',
              content: `${values.projectTokenPrice || '-'} ${
                values.tokenName
              } : 1 TON`,
            },
          ],
          Schedule: [
            {
              title: 'Whitelist',
              //@ts-ignore
              content: selectedVaultDetail?.whitelist || '-',
            },
            {
              title: 'Public Round 1',
              content: `${
                //@ts-ignore
                selectedVaultDetail?.publicRound1 || '-'
              }`,
            },
            {
              title: 'Public Round 2',
              //@ts-ignore
              content: `${selectedVaultDetail?.publicRound2 || '-'}`,
            },
            {
              title: 'Claim',
              content: `${selectedVaultDetail?.claim[0].claimTime}`,
            },
          ],
        };
        const stosInfo = [
          {
            tier: 1,
            //@ts-ignore
            requiredTos: selectedVaultDetail?.stosTier?.oneTier?.requiredStos,
            allocationToken:
              //@ts-ignore
              selectedVaultDetail?.stosTier?.oneTier?.allocatedToken,
          },
          {
            tier: 2,
            //@ts-ignore
            requiredTos: selectedVaultDetail?.stosTier?.twoTier?.requiredStos,
            allocationToken:
              //@ts-ignore
              selectedVaultDetail?.stosTier?.twoTier?.allocatedToken,
          },
          {
            tier: 3,
            //@ts-ignore
            requiredTos: selectedVaultDetail?.stosTier?.threeTier?.requiredStos,
            allocationToken:
              //@ts-ignore
              selectedVaultDetail?.stosTier?.threeTier?.allocatedToken,
          },
          {
            tier: 4,
            //@ts-ignore
            requiredTos: selectedVaultDetail?.stosTier?.fourTier?.requiredStos,
            allocationToken:
              //@ts-ignore
              selectedVaultDetail?.stosTier?.fourTier?.allocatedToken,
          },
        ];
        setInfoList(info);
        setInfoList2(info2);
        return setStosTierList(stosInfo);
      }
      default:
        break;
    }
  }, [vaultType, selectedVaultDetail, values]);

  const vaultDeploy = useCallback(
    async () => {
      if (account && library && vaultState === 'ready') {
        const vaultContract = getContract(vaultType, library);
        const signer = getSigner(library, account);

        try {
          switch (vaultType) {
            case 'Initial Liquidity': {
              const tx = await vaultContract
                ?.connect(signer)
                .create(
                  selectedVaultName,
                  values.tokenAddress,
                  selectedVaultDetail?.adminAddress,
                  1,
                  values.tosPrice,
                );
              const receipt = await tx.wait();
              const {logs} = receipt;

              const iface = new ethers.utils.Interface(InitialLiquidityAbi.abi);

              const result = iface.parseLog(logs[11]);
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
                  const vault =
                    await InitialLiquidity_Contract.createdContracts(
                      valutIndex,
                    );
                  if (vault.contractAddress === values.vaults[1].vaultAddress) {
                    break;
                  }
                } catch (e) {}
              } while (valutIndex >= 0);

              const tx = await vaultContract?.connect(signer).create(
                `${values.projectName}_${selectedVaultDetail?.vaultName}`,
                selectedVaultDetail?.adminAddress,
                [
                  values.tokenAddress,
                  //@ts-ignore
                  selectedVaultDetail?.addressForReceiving,
                  values.vaults[1].vaultAddress,
                ],
                valutIndex,
              );
              const receipt = await tx.wait();
              const {logs} = receipt;

              const iface = new ethers.utils.Interface(
                PublicSaleVaultCreateAbi.abi,
              );

              const result = iface.parseLog(logs[9]);
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
            case 'TON Staker': {
              // 0: name : string
              // 1: _token : address
              // 2: _owner : address
              console.log(vaultContract);
              const tx = await vaultContract
                ?.connect(signer)
                .create(
                  `${values.projectName}_${selectedVaultDetail?.vaultName}`,
                  values.tokenAddress,
                  selectedVaultDetail?.adminAddress,
                );
              const receipt = await tx.wait();
              const {logs} = receipt;

              const iface = new ethers.utils.Interface(TONStakerAbi.abi);

              const result = iface.parseLog(logs[8]);
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
              const receipt = await tx.wait();
              const {logs} = receipt;

              const iface = new ethers.utils.Interface(TOSStakerAbi.abi);

              const result = iface.parseLog(logs[8]);
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
              const receipt = await tx.wait();
              const {logs} = receipt;

              const iface = new ethers.utils.Interface(LPrewardVaultAbi.abi);

              const result = iface.parseLog(logs[9]);
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

              console.log(selectedVaultDetail);

              //@ts-ignore
              const tx = await vaultContract?.connect(signer).create(
                `${values.projectName}_${selectedVaultDetail?.vaultName}`,
                //@ts-ignore
                selectedVaultDetail.poolAddress,
                values.tokenAddress,
                selectedVaultDetail?.adminAddress,
              );
              const receipt = await tx.wait();
              const {logs} = receipt;

              const iface = new ethers.utils.Interface(LPrewardVaultAbi.abi);

              const result = iface.parseLog(logs[9]);
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
              const receipt = await tx.wait();
              const {logs} = receipt;

              const iface = new ethers.utils.Interface(VaultCFactoryAbi.abi);

              const result = iface.parseLog(logs[8]);
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
            case 'DAO': {
              // 0: name : string
              // 1: _token : address
              // 2: _owner : address
              console.log(vaultContract);
              const tx = await vaultContract
                ?.connect(signer)
                .createTypeB(
                  `${values.projectName}_${selectedVaultDetail?.vaultName}`,
                  values.tokenAddress,
                  selectedVaultDetail?.adminAddress,
                );
              const receipt = await tx.wait();
              const {logs} = receipt;

              const iface = new ethers.utils.Interface(DAOVaultAbi.abi);

              const result = iface.parseLog(logs[8]);
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

      if (account && library && vaultState === 'readyForSet') {
        const vaultContract = getContract(vaultType, library);
        const signer = getSigner(library, account);

        try {
          switch (vaultType) {
            case 'Public': {
              // 0 : _Tier : uint256[8]
              // 1 : _amount : uint256[6]
              // 2 : _time : uint256[8]
              // 3 : _claimTimes : uint256[]
              // 4 : _claimPercents : uint256[]
              const PublicVaultData = selectedVaultDetail as VaultPublic;
              // _Tier[0] : Tier1의 sTOS 기준
              // _Tier[2] : Tier3의 sTOS 기준
              // _Tier[1] : Tier2의 sTOS 기준
              // _Tier[3] : Tier4의 sTOS 기준
              // _Tier[4] : Tier1의 percent
              // _Tier[5] : Tier2의 percent
              // _Tier[6] : Tier3의 percent
              // (Tier[4]~Tier[7]의 합은 10000)
              // _Tier[7] : Tier4의 percent
              const param0: number[] = [
                PublicVaultData.stosTier.oneTier.allocatedToken as number,
                PublicVaultData.stosTier.twoTier.allocatedToken as number,
                PublicVaultData.stosTier.threeTier.allocatedToken as number,
                PublicVaultData.stosTier.fourTier.allocatedToken as number,
                2500,
                2500,
                2500,
                2500,
                // (PublicVaultData.stosTier.oneTier.requiredStos as number) * 100,
                // (PublicVaultData.stosTier.twoTier.requiredStos as number) * 100,
                // (PublicVaultData.stosTier.threeTier.requiredStos as number) *
                //   100,
                // (PublicVaultData.stosTier.fourTier.requiredStos as number) *
                //   100,
              ];
              // _amount[0] : Round1에서의 토큰 판매수량
              // _amount[1] : Round2에서의 토큰 판매수량
              // _amount[2] : 판매토큰 가격
              // _amount[3] : 톤 토큰 가격
              // _amount[4] : hardhat수량(TON기준)
              // _amount[5] : TON → TOS 변경 % (min ~ max)
              const param1: number[] = [
                PublicVaultData.publicRound1Allocation as number,
                PublicVaultData.publicRound2Allocation as number,
                (values.projectTokenPrice as number) * 100,
                100,
                PublicVaultData.hardCap as number,
                5,
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
              console.log(allTokenAllocation);
              //   (PublicVaultData.publicRound2Allocation as number)
              const param4: number[] = PublicVaultData.claim.map(
                (claimRound: VaultSchedule) =>
                  ((claimRound.claimTokenAllocation as number) * 100) /
                  allTokenAllocation,
              ) as number[];

              console.log('--params--');
              console.log(param0, param1, param2, param3, param4);

              const publicVaultSecondContract = new Contract(
                PublicVaultData.vaultAddress as string,
                PublicSaleVaultAbi.abi,
                library,
              );

              const tx = await publicVaultSecondContract
                ?.connect(signer)
                .setAllsetting(param0, param1, param2, param3, param4);
              const receipt = await tx.wait();
              if (receipt) {
                setFieldValue(
                  `vaults[${selectedVaultDetail?.index}].isSet`,
                  true,
                );
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
                (claimData: VaultSchedule) => claimData.claimTokenAllocation,
              );
              const LiquidityIncentiveInitialize_CONTRACT = new Contract(
                selectedVaultDetail?.vaultAddress as string,
                VaultLPRewardLogicAbi.abi,
                library,
              );
              const tx = await LiquidityIncentiveInitialize_CONTRACT?.connect(
                signer,
              ).initialize(
                selectedVaultDetail?.vaultTokenAllocation,
                selectedVaultDetail?.claim.length,
                claimTimesParam,
                claimAmountsParam,
              );
              const receipt = await tx.wait();

              if (receipt) {
                setFieldValue(
                  `vaults[${selectedVaultDetail?.index}].isSet`,
                  true,
                );
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
                (claimData: VaultSchedule) => claimData.claimTokenAllocation,
              );
              const TONStakerVaultSecondContract = new Contract(
                selectedVaultDetail.vaultAddress as string,
                TONStakerInitializeAbi.abi,
                library,
              );
              const tx = await TONStakerVaultSecondContract?.connect(
                signer,
              ).initialize(
                selectedVaultDetail?.vaultTokenAllocation,
                selectedVaultDetail?.claim.length,
                claimTimesParam,
                claimAmountsParam,
              );
              const receipt = await tx.wait();

              if (receipt) {
                setFieldValue(
                  `vaults[${selectedVaultDetail?.index}].isSet`,
                  true,
                );
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
                (claimData: VaultSchedule) => claimData.claimTokenAllocation,
              );
              const TOSStakerVaultSecondContract = new Contract(
                selectedVaultDetail?.vaultAddress as string,
                TOSStakerInitializeAbi.abi,
                library,
              );
              const tx = await TOSStakerVaultSecondContract?.connect(
                signer,
              ).initialize(
                selectedVaultDetail?.vaultTokenAllocation,
                selectedVaultDetail?.claim.length,
                claimTimesParam,
                claimAmountsParam,
              );
              const receipt = await tx.wait();

              if (receipt) {
                setFieldValue(
                  `vaults[${selectedVaultDetail?.index}].isSet`,
                  true,
                );
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
                (claimData: VaultSchedule) => claimData.claimTokenAllocation,
              );

              const LPVaultSecondContract = new Contract(
                selectedVaultDetail.vaultAddress as string,
                LPRewardInitializeAbi.abi,
                library,
              );

              const tx = await LPVaultSecondContract?.connect(
                signer,
              ).initialize(
                selectedVaultDetail?.vaultTokenAllocation,
                selectedVaultDetail?.claim.length,
                claimTimesParam,
                claimAmountsParam,
              );
              const receipt = await tx.wait();

              if (receipt) {
                setFieldValue(
                  `vaults[${selectedVaultDetail?.index}].isSet`,
                  true,
                );
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
                (claimData: VaultSchedule) => claimData.claimTokenAllocation,
              );

              const TypeCVaultLogic_CONTRACT = new Contract(
                selectedVaultDetail.vaultAddress as string,
                VaultCLogicAbi.abi,
                library,
              );

              const tx = await TypeCVaultLogic_CONTRACT?.connect(
                signer,
              ).initialize(
                selectedVaultDetail?.vaultTokenAllocation,
                selectedVaultDetail?.claim.length,
                claimTimesParam,
                claimAmountsParam,
              );
              const receipt = await tx.wait();

              if (receipt) {
                setFieldValue(
                  `vaults[${selectedVaultDetail?.index}].isSet`,
                  true,
                );
                setVaultState('finished');
              }
              break;
            }
            default:
              break;
          }
        } catch (e) {
          console.log(
            `******DEPLOY ERROR_${selectedVaultDetail.vaultName}******`,
          );
          console.log(e);
          setFieldValue(
            `vaults[${selectedVaultDetail?.index}].isDeployedErr`,
            true,
          );
        }
      }
    },
    /*eslint-disable*/
    [
      vaultType,
      account,
      library,
      selectedVaultDetail,
      selectedVaultName,
      values,
      vaultState,
      blockNumber,
    ],
  );

  const ERC20_CONTRACT = useContract(values?.tokenAddress, ERC20.abi);

  useEffect(() => {
    async function fetchContractBalance() {
      if (
        ERC20_CONTRACT &&
        selectedVaultDetail?.vaultAddress &&
        selectedVaultDetail?.isDeployed === true
      ) {
        const tokenBalance = await ERC20_CONTRACT.balanceOf(
          selectedVaultDetail.vaultAddress,
        );
        if (tokenBalance && selectedVaultDetail.vaultTokenAllocation) {
          selectedVaultDetail.vaultTokenAllocation <=
          Number(convertNumber({amount: tokenBalance.toString()}))
            ? setHasToken(true)
            : setHasToken(false);
        }
      }
    }
    fetchContractBalance();
  }, [blockNumber, ERC20_CONTRACT, selectedVaultDetail]);

  const statusTitle = useMemo(() => {
    switch (vaultState) {
      case 'notReady':
        return 'Status';
      case 'ready':
        return 'Ready to deploy';
      case 'readyForToken':
        return 'Wating for token';
      case 'readyForSet':
        return 'Ready to deploy (final)';
      case 'finished':
        return 'Completed';
      default:
        break;
    }
  }, [vaultState]);

  const colorScheme = useMemo(() => {
    switch (vaultState) {
      case 'notReady':
        return {
          titleColor: 'gray.400',
          bg: 'none',
          btnBg: 'none',
        };
      case 'ready':
        return {
          titleColor: '#03c4c6',
          bg: 'none',
          btnBg: 'blue.500',
        };
      case 'readyForToken':
        return {
          titleColor: '#ff3b3b',
          bg: 'none',
          btnBg: 'blue.500',
        };
      case 'readyForSet':
        return {
          titleColor: '#0070ed',
          bg: 'none',
          btnBg: '#00c3c4',
        };
      case 'finished':
        return {
          titleColor: 'white.100',
          bg: '#26c1c9',
          btnBg: 'none',
        };
      default:
        return {
          titleColor: '',
        };
    }
  }, [vaultState]);

  const vaultAddress = values.vaults.filter(
    (vault: VaultCommon) => vault.vaultName === vaultName,
  )[0];

  return (
    <GridItem
      {...OpenCampaginDesign.border({colorMode})}
      bg={vaultState === 'finished' ? '#26c1c9' : 'none'}
      w={'338px'}
      h={'232px'}
      pl={'30px'}
      pr={'20px'}
      pt={'20px'}
      pb={'25px'}
      color={vaultState === 'finished' ? 'white.100' : 'gray.400'}>
      <Flex flexDir={'column'}>
        <Box d="flex" justifyContent={'space-between'}>
          <Text fontSize={13} h={'18px'}>
            Vauts
          </Text>
          <Text fontSize={12} h={'16px'} color={colorScheme.titleColor}>
            {statusTitle}
          </Text>
        </Box>
        <Text
          fontSize={28}
          h={'37px'}
          color={vaultState === 'finished' ? 'white.100' : 'black.300'}
          fontWeight={600}
          mb={'48px'}>
          {vaultName}
        </Text>
        <Box d="flex" flexDir={'column'} mb={'12px'}>
          <Text fontSize={11} h={'15px'}>
            Address
          </Text>
          <Link
            isExternal={true}
            outline={'none'}
            _focus={{
              outline: 'none',
            }}
            _hover={{}}
            color={vaultState === 'finished' ? 'white.100' : 'gray.250'}
            fontSize={15}
            h={'20px'}
            fontWeight={600}
            href={`${appConfig.explorerLink}${selectedVaultDetail?.vaultAddress}`}>
            {selectedVaultDetail?.vaultAddress
              ? shortenAddress(selectedVaultDetail.vaultAddress)
              : '-'}
          </Link>
        </Box>
        <Box d="flex" justifyContent={'space-between'}>
          <Flex flexDir={'column'}>
            <Text fontSize={11} h={'15px'}>
              Token Allocation
            </Text>
            <Text
              color={vaultState === 'finished' ? 'white.100' : 'gray.250'}
              fontSize={15}
              h={'20px'}
              fontWeight={600}>
              {commafy(selectedVaultDetail?.vaultTokenAllocation)}
            </Text>
          </Flex>
          <Button
            w={'100px'}
            h={'32px'}
            bg={colorScheme.btnBg}
            mt={'auto'}
            color={vaultState !== 'notReady' ? 'white.100' : 'gray.175'}
            // color={'white.100'}
            border={vaultState === 'ready' ? '' : '1px solid #dfe4ee'}
            isDisabled={
              vaultState === 'notReady' || vaultState === 'finished'
                ? btnDisable
                : false
            }
            fontSize={13}
            fontWeight={500}
            _hover={{}}
            onClick={() => {
              vaultState === 'ready'
                ? dispatch(
                    openModal({
                      type: 'Launch_ConfirmVault',
                      data: {
                        vaultName,
                        infoList,
                        secondInfoList: infoList2,
                        stosTierList,
                        func: () => vaultDeploy(),
                        close: () =>
                          setFieldValue(
                            `vaults[${selectedVaultDetail?.index}].isDeployedErr`,
                            false,
                          ),
                      },
                    }),
                  )
                : vaultState === 'readyForToken'
                ? ERC20_CONTRACT?.transfer(
                    selectedVaultDetail.vaultAddress,
                    convertToWei(
                      selectedVaultDetail.vaultTokenAllocation.toString(),
                    ),
                  )
                : dispatch(
                    openModal({
                      type: 'Launch_ConfirmVault',
                      data: {
                        vaultName,
                        infoList,
                        secondInfoList: infoList2,
                        stosTierList,
                        isSetStep: true,
                        func: () => vaultDeploy(),
                        close: () =>
                          setFieldValue(
                            `vaults[${selectedVaultDetail?.index}].isDeployedErr`,
                            false,
                          ),
                      },
                    }),
                  );
            }}>
            {vaultState !== 'readyForToken' ? 'Deploy' : 'Send Token'}
          </Button>
        </Box>
      </Flex>
    </GridItem>
  );
};

export default DeployVault;