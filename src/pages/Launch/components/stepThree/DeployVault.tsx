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
import * as PublicSaleVaultAbi from 'services/abis/PublicSaleVault.json';
import {convertNumber, convertToWei} from 'utils/number';
import commafy from 'utils/commafy';
import {convertTimeStamp} from 'utils/convertTIme';

type DeployVaultProp = {
  vault: VaultAny;
};

function getContract(vaultType: VaultType, library: LibraryType) {
  switch (vaultType) {
    case 'Public': {
      const {PublicSaleVault} = DEPLOYED;
      const contract = new Contract(
        PublicSaleVault,
        PublicSaleVaultAbi.abi,
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
    case 'TON Staker':
      break;
    case 'TOS Staker':
      break;
    case 'WTON-TOS LP Reward':
      break;
    case 'DAO':
      break;
    case 'C':
      break;
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
          selectedVaultDetail?.vaultType !== 'Initial Liquidity'
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
      if (account && library) {
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
              let vaultIndex = 0;

              for (let i = 0; i < totalVaultIndex; i++) {
                const vault = await InitialLiquidity_Contract.createdContracts(
                  i,
                );
                if (vault.contractAddress === values.vaults[1].adminAddress) {
                  return (vaultIndex = i);
                }
              }
              console.log(vaultIndex);
              const tx = await vaultContract?.connect(signer).create(
                selectedVaultDetail?.vaultName,
                selectedVaultDetail?.adminAddress,
                [
                  values.tokenAddress,
                  //@ts-ignore
                  selectedVaultDetail?.addressForReceiving,
                  values.vaults[1].vaultAddress,
                ],
                2,
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
            case 'Liquidity Incentive': {
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
                  selectedVaultName,
                  TOS_WTON_POOL,
                  values.tokenAddress,
                  selectedVaultDetail?.adminAddress,
                );
              const receipt = await tx.wait();
              const {logs} = receipt;

              const iface = new ethers.utils.Interface(
                LiquidityIncentiveAbi.abi,
              );

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
    },
    /*eslint-disable*/
    [
      vaultType,
      account,
      library,
      selectedVaultDetail,
      selectedVaultName,
      values,
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
          console.log(selectedVaultDetail.vaultTokenAllocation);
          console.log(Number(convertNumber({amount: tokenBalance.toString()})));
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
                        isSet: true,
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
