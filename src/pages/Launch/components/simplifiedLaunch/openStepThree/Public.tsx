import {Flex, useColorMode, useTheme, Text, Button} from '@chakra-ui/react';
import {
  useEffect,
  useState,
  useMemo,
  useCallback,
} from 'react';
import {useFormikContext} from 'formik';
import {
  Projects,
  VaultSchedule,
  Step3_InfoList,
  VaultPublic,
} from '@Launch/types';
import moment from 'moment';
import {LibraryType} from 'types';
import {shortenAddress} from 'utils';
import {Contract} from '@ethersproject/contracts';
import {useActiveWeb3React} from 'hooks/useWeb3';
import {useAppDispatch, useAppSelector} from 'hooks/useRedux';
import {selectApp} from 'store/app/app.reducer';
import useVaultSelector from '@Launch/hooks/useVaultSelector';
import {getSigner} from 'utils/contract';
import {ethers} from 'ethers';
import {useBlockNumber} from 'hooks/useBlock';
import {useContract} from 'hooks/useContract';
import InitialLiquidityAbi from 'services/abis/Vault_InitialLiquidity.json';
import * as ERC20 from 'services/abis/erc20ABI(SYMBOL).json';
import * as LiquidityIncentiveAbi from 'services/abis/LiquidityIncentiveAbi.json';
import * as PublicSaleVaultCreateAbi from 'services/abis/PublicSaleVaultCreateAbi.json';
import * as PublicSaleVaultAbi from 'services/abis/PublicSaleVault.json';
import * as PublicSale from 'services/abis/PublicSale.json';
import {DEPLOYED} from 'constants/index';
import {convertNumber, convertToWei} from 'utils/number';
import commafy from 'utils/commafy';
import {convertTimeStamp} from 'utils/convertTIme';
import {selectLaunch, setTempHash} from '@Launch/launch.reducer';

const Public = () => {
  const {colorMode} = useColorMode();
  const theme = useTheme();
  const [type, setType] = useState<'Vault' | 'Sale'>('Vault');
  const {values, setFieldValue} =
    useFormikContext<Projects['CreateSimplifiedProject']>();
  console.log(values);

  const [btnDisable, setBtnDisable] = useState(true);
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
  const publicVault = values.vaults[0] as VaultPublic;

  const detailsVault = [
    {name: 'Vault Name', value: `${publicVault.vaultName}`},
    {
      name: 'Admin',
      value: `${
        values.ownerAddress ? shortenAddress(values.ownerAddress) : 'NA'
      }`,
    },
    {
      name: 'Contract',
      value: `${
        publicVault.vaultAddress
          ? shortenAddress(publicVault.vaultAddress)
          : 'NA'
      }`,
    },
    {
      name: 'Token Allocation',
      value: `${publicVault.vaultTokenAllocation.toLocaleString()} ${
        values.tokenSymbol
      }`,
    },
  ];

  const tokenDetails = [
    {
      name: 'Token',
      value1: `${publicVault.vaultTokenAllocation.toLocaleString()} ${
        values.tokenSymbol
      }`,
      value2: '30%',
    },
    {
      name: 'Public Round 1',
      value1: `${(publicVault.vaultTokenAllocation / 2).toLocaleString()} ${
        values.tokenSymbol
      }`,
      value2: '50%',
    },
    {
      name: 'Public Round 2',
      value1: `${(publicVault.vaultTokenAllocation / 2).toLocaleString()} ${
        values.tokenSymbol
      }`,
      value2: '50%',
    },
    {
      name: 'Token Price',
      value1: `${
        values.projectTokenPrice
          ? values.projectTokenPrice.toLocaleString()
          : ''
      }${values.tokenSymbol} = 1 TON`,
    },
  ];

  const schedule = [
    {
      name: 'Whitelist',
      value: `${moment
        .unix(Number(publicVault.whitelist))
        .format('YYYY.MM.DD HH:mm:ss')}`,
    },
    {
      name: 'Public Round 1',
      value: `${moment
        .unix(Number(publicVault.publicRound1))
        .format('YYYY.MM.DD HH:mm:ss')}`,
    },
    {
      name: 'Public Round 1',
      value: `${moment
        .unix(Number(publicVault.publicRound2))
        .format('YYYY.MM.DD HH:mm:ss')}`,
    },
    {
      name: 'Claim',
      value: `${moment
        .unix(Number(publicVault.publicRound2End) + 1)
        .format('YYYY.MM.DD HH:mm:ss')}`,
    },
  ];

  const sTOSList = [
    {
      tier: 1,
      requiredTos: 600,
      allocationToken: publicVault.stosTier.oneTier.allocatedToken
        ? publicVault.stosTier.oneTier.allocatedToken
        : 0,
    },
    {
      tier: 2,
      requiredTos: 1200,
      allocationToken: publicVault.stosTier.twoTier.allocatedToken
        ? publicVault.stosTier.twoTier.allocatedToken
        : 0,
    },
    {
      tier: 3,
      requiredTos: 2200,
      allocationToken: publicVault.stosTier.threeTier.allocatedToken
        ? publicVault.stosTier.threeTier.allocatedToken
        : 0,
    },
    {
      tier: 4,
      requiredTos: 6000,
      allocationToken: publicVault.stosTier.fourTier.allocatedToken
        ? publicVault.stosTier.fourTier.allocatedToken
        : 0,
    },
  ];

  function getContract(library: LibraryType) {
    const {PublicSaleVault} = DEPLOYED;
    const contract = new Contract(
      PublicSaleVault,
      PublicSaleVaultCreateAbi.abi,
      library,
    );
    return contract;
  }
  const {vaultName, vaultType, index} = publicVault;

  //check vault state from contract
  useEffect(() => {
    async function checkIsIniailized() {
      if (
        publicVault.vaultAddress !== '' ||
        publicVault.vaultAddress !== undefined
      ) {
        const publicVaultSecondContract = new Contract(
          publicVault.vaultAddress as string,
          PublicSale.abi,
          library,
        );
        const snapshot = await publicVaultSecondContract.snapshot();
        const isInitialized = Number(snapshot.toString()) !== 0;
        console.log(publicVault.vaultName);
        console.log(isInitialized);
        return setFieldValue(`vaults[0].isSet`, isInitialized);
      }
    }
    checkIsIniailized().catch((e) => {
      console.log('**checkIsIniailized err**');
      console.log(e);
    });
  }, [blockNumber, publicVault, library, setFieldValue]);

  //setVaultState
  useEffect(() => {
    const isTokenDeployed = values.isTokenDeployed;
    const isLPDeployed = values.vaults[1].isDeployed;
    const isVestingDeployed = values.vaults[2].isDeployed;
    const isVaultDeployed = publicVault?.isDeployed;
    const isSet = publicVault.isSet;
    const vaultDeployReady =
      isTokenDeployed && isLPDeployed && isVestingDeployed && !isVaultDeployed;
    if (isSet) {
      return setVaultState('finished');
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
  }, [
    hasToken,
    publicVault?.isDeployed,
    publicVault.isSet,
    values.isTokenDeployed,
    blockNumber,
    values.vaults,
  ]);

  useEffect(() => {
    const info = {
      Vault: [
        {
          title: 'Vault Name',
          content: publicVault?.vaultName || '-',
        },
        {
          title: 'Admin',
          content: `${publicVault?.adminAddress || '-'}`,
          isHref: true,
        },
        {
          title: 'Contract',
          content: `${publicVault?.vaultAddress || '-'}`,
          isHref: true,
        },
        {
          title: 'Token Allocation',
          content: `${commafy(publicVault?.vaultTokenAllocation) || '-'} ${
            values.tokenName
          }`,
        },
      ],
      Claim: [
        {
          title: `Claim Round (${publicVault?.claim?.length})`,
          content: '',
        },
        ...publicVault.claim.map((claimData: VaultSchedule, index: number) => {
          return {
            title: `${index + 1} ${convertTimeStamp(
              claimData.claimTime as number,
              'DD.MM.YYYY HH:mm:ss',
            )}`,
            content: `${commafy(claimData.claimTokenAllocation)} ${
              values.tokenName
            }`,
          };
        }),
      ],
    };
    const info2 = {
      Token: [
        {
          title: 'Token',
          content: commafy(publicVault?.vaultTokenAllocation) || '-',
        },
        {
          title: 'Public Round 1',
          content: `${
            //@ts-ignore
            commafy(publicVault?.publicRound1Allocation) || '-'
          }`,
        },
        {
          title: 'Public Round 2',
          content: `${
            //@ts-ignore
            commafy(publicVault?.publicRound2Allocation) || '-'
          }`,
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
          content:
            `${convertTimeStamp(
              //@ts-ignore
              publicVault?.whitelist as number,
              'DD.MM.YYYY HH:mm:ss',
            )}` || '-',
        },
        {
          title: 'Public Round 1',
          content:
            `${convertTimeStamp(
              //@ts-ignore
              publicVault?.publicRound1 as number,
              'DD.MM.YYYY HH:mm:ss',
            )}` || '-',
        },
        {
          title: 'Public Round 2',
          //@ts-ignore
          content:
            `${convertTimeStamp(
              //@ts-ignore
              publicVault?.publicRound2 as number,
              'DD.MM.YYYY HH:mm:ss',
            )}` || '-',
        },
        {
          title: 'Claim',
          content:
            `${convertTimeStamp(
              //@ts-ignore
              publicVault?.claim[0].claimTime as number,
              'DD.MM.YYYY HH:mm:ss',
            )}` || '-',
        },
      ],
    };
    const stosInfo = [
      {
        tier: 1,
        requiredTos:
          //@ts-ignore
          commafy(publicVault?.stosTier?.oneTier?.requiredStos),
        allocationToken:
          //@ts-ignore
          commafy(publicVault?.stosTier?.oneTier?.allocatedToken),
      },
      {
        tier: 2,
        requiredTos: commafy(
          //@ts-ignore
          publicVault?.stosTier?.twoTier?.requiredStos,
        ),
        allocationToken:
          //@ts-ignore
          commafy(publicVault?.stosTier?.twoTier?.allocatedToken),
      },
      {
        tier: 3,
        requiredTos: commafy(
          //@ts-ignore
          publicVault?.stosTier?.threeTier?.requiredStos,
        ),
        allocationToken:
          //@ts-ignore
          commafy(publicVault?.stosTier?.threeTier?.allocatedToken),
      },
      {
        tier: 4,
        requiredTos: commafy(
          //@ts-ignore
          publicVault?.stosTier?.fourTier?.requiredStos,
        ),
        allocationToken:
          //@ts-ignore
          commafy(publicVault?.stosTier?.fourTier?.allocatedToken),
      },
    ];
    setInfoList(info);
    setInfoList2(info2);
    // setStosTierList(stosInfo);
  }, [values, publicVault]);

  const {
    data: {hashKey},
  } = useAppSelector(selectLaunch);

  const vaultDeploy = useCallback(async () => {
    if (account && library && vaultState === 'ready') {
      const vaultContract = getContract(library);
      const signer = getSigner(library, account);
      try {
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

        //  vaults[1] == initial liquidity
        // vaults[2] == vesting
        const tx = await vaultContract
          ?.connect(signer)
          .create(
            `${values.projectName}_${publicVault?.vaultName}`,
            publicVault?.adminAddress,
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

        const receipt = await tx.wait();
        const {logs} = receipt;

        const iface = new ethers.utils.Interface(PublicSaleVaultCreateAbi.abi);

        const result = iface.parseLog(logs[logs.length - 1]);
        const {args} = result;
        if (args) {
          setFieldValue(`vaults[0].vaultAddress`, args[0]);
          setFieldValue(`vaults[0].isDeployed`, true);
          setVaultState('readyForToken');
        }
      } catch (e) {
        console.log(e);
        setFieldValue(`vaults[0].isDeployedErr`, true);
      }
    }
    if (account && library && vaultState === 'readyForSet') {
      const signer = getSigner(library, account);
      try {
        const publicRound1TokenAllocation =
          publicVault.publicRound1Allocation as number;
        const tier1RequiredStosWei = convertToWei(
          String(publicVault.stosTier.oneTier.requiredStos),
        );
        const tier2RequiredStosWei = convertToWei(
          String(publicVault.stosTier.twoTier.requiredStos),
        );
        const tier3RequiredStosWei = convertToWei(
          String(publicVault.stosTier.threeTier.requiredStos),
        );
        const tier4RequiredStosWei = convertToWei(
          String(publicVault.stosTier.fourTier.requiredStos),
        );

        const param0: any[] = [
          tier1RequiredStosWei,
          tier2RequiredStosWei,
          tier3RequiredStosWei,
          tier4RequiredStosWei,
          (Number(publicVault.stosTier.oneTier.allocatedToken as number) *
            10000) /
            publicRound1TokenAllocation,
          (Number(publicVault.stosTier.twoTier.allocatedToken as number) *
            10000) /
            publicRound1TokenAllocation,
          (Number(publicVault.stosTier.threeTier.allocatedToken as number) *
            10000) /
            publicRound1TokenAllocation,
          (Number(publicVault.stosTier.fourTier.allocatedToken as number) *
            10000) /
            publicRound1TokenAllocation,
        ];
        const publicRound1AllocationWei = convertToWei(
          String(publicVault.publicRound1Allocation),
        );
        const publicRound2AllocationWei = convertToWei(
          String(publicVault.publicRound2Allocation),
        );

        const hardCapWei = convertToWei(String(publicVault.hardCap));
        const param1: any[] = [
          publicRound1AllocationWei,
          publicRound2AllocationWei,
          100,
          (values.projectTokenPrice as number) * 100,
          hardCapWei,
          publicVault.tokenAllocationForLiquidity as number,
        ];

        const param2: number[] = [
          publicVault.snapshot as number,
          publicVault.whitelist as number,
          publicVault.whitelistEnd as number,
          publicVault.publicRound1 as number,
          publicVault.publicRound1End as number,
          publicVault.publicRound2 as number,
          publicVault.publicRound2End as number,
          publicVault.claim.length,
        ];
        const param3: number[] = publicVault.claim.map(
          (claimRound: VaultSchedule) => claimRound.claimTime,
        ) as number[];

        const {publicRound1Allocation, publicRound2Allocation} = publicVault;
        const allTokenAllocation =
          Number(publicRound1Allocation as number) +
          Number(publicRound2Allocation as number);
        const param4: number[] = publicVault.claim.map(
          (claimRound: VaultSchedule) =>
            ((claimRound.claimTokenAllocation as number) * 100) /
            allTokenAllocation,
        ) as number[];

        console.log('--params--');
        console.log(param0, param1, param2, param3, param4);

        const publicVaultSecondContract = new Contract(
          publicVault.vaultAddress as string,
          PublicSale.abi,
          library,
        );
        const tx = await publicVaultSecondContract
          ?.connect(signer)
          .setAllsetting(param0, param1, param2, param3, param4);
        const receipt = await tx.wait();
        if (receipt) {
          setFieldValue(`vaults[0].isSet`, true);
          setVaultState('finished');
        }
      } catch (e) {
        console.log(`******DEPLOY ERROR_${publicVault.vaultName}******`);
        console.log(e);
        setFieldValue(`vaults[0].isDeployedErr`, true);
      }
    }
  }, [account, library, publicVault, values, vaultState, blockNumber]);

  const ERC20_CONTRACT = useContract(values?.tokenAddress, ERC20.abi);

  useEffect(() => {
    async function fetchContractBalance() {
      if (
        ERC20_CONTRACT &&
        publicVault?.vaultAddress &&
        publicVault?.isDeployed === true
      ) {
        const tokenBalance = await ERC20_CONTRACT.balanceOf(
          publicVault.vaultAddress,
        );
        if (tokenBalance && publicVault.vaultTokenAllocation) {
          publicVault.vaultTokenAllocation <=
          Number(convertNumber({amount: tokenBalance.toString()}))
            ? setHasToken(true)
            : setHasToken(false);
        }
      }
    }
    fetchContractBalance();
  }, [blockNumber, ERC20_CONTRACT, publicVault]);

  const statusTitle = useMemo(() => {
    switch (vaultState) {
      case 'notReady':
        return 'Status';
      case 'ready':
        return 'Ready to deploy';
      case 'readyForToken':
        return 'Wating for token';
      case 'readyForSet':
        return 'Ready to initialize (final)';
      case 'finished':
        return 'Completed';
      default:
        break;
    }
  }, [vaultState]);

  const VaultClaim = (props: {}) => {
    return (
      <Flex flexDir={'column'} w="100%" px="20px">
        <Flex flexDir={'column'} w="100%" alignItems={'center'}>
          <Text h="18px" mb="10px" fontSize={'13px'}>
            Vault
          </Text>
          {detailsVault.map((detail: any, index: number) => {
            return (
              <Flex
                key={index}
                w="100%"
                justifyContent={'space-between'}
                h="45px"
                alignItems={'center'}>
                <Text
                  fontSize={'13px'}
                  fontFamily={theme.fonts.roboto}
                  fontWeight={500}
                  color={colorMode === 'dark' ? 'gray.425' : 'gray.400'}>
                  {detail.name}
                </Text>
                <Text
                  fontSize={'13px'}
                  fontFamily={theme.fonts.roboto}
                  fontWeight={500}
                  color={
                    detail.name === 'Admin' || detail.name === 'Contract'
                      ? 'blue.300'
                      : colorMode === 'dark'
                      ? 'white.100'
                      : 'gray.250'
                  }>
                  {detail.value}
                </Text>
              </Flex>
            );
          })}
        </Flex>
        <Flex mt="30px" flexDir={'column'} alignItems={'center'}>
          <Text mb="10px" fontSize={'13px'} h="18px">
            Claim
          </Text>
          <Flex w="100%" h="45px" alignItems={'center'}>
            <Text fontSize={'13px'} textAlign={'left'}>
              Claim Rounds ({publicVault.claim.length})
            </Text>
          </Flex>

          {publicVault.claim.map((claim: any, index: Number) => {
            return (
              <Flex
                w="100%"
                justifyContent={'space-between'}
                h="30px"
                alignItems={'center'}>
                <Text
                  fontSize={'12px'}
                  fontFamily={theme.fonts.roboto}
                  fontWeight={500}
                  color={colorMode === 'dark' ? 'gray.425' : 'gray.400'}>
                  <span style={{color: '#3d495d', marginRight: '3px'}}>
                    {index < 10 ? '0' : ''}
                    {index}
                  </span>
                  {moment
                    .unix(Number(claim.claimTime))
                    .format('YYYY.MM.DD HH:mm:ss')}
                </Text>
                <Text
                  fontSize={'12px'}
                  fontFamily={theme.fonts.roboto}
                  fontWeight={500}>
                  {claim.claimTokenAllocation.toLocaleString()} (
                  {values.totalSupply
                    ? (claim.claimTokenAllocation / values.totalSupply) * 100
                    : 0}
                  %)
                </Text>
              </Flex>
            );
          })}
        </Flex>
      </Flex>
    );
  };

  const Sale = (props: {}) => {
    return (
      <Flex flexDir={'column'} w="100%">
        <Flex flexDir={'column'} w="100%" alignItems={'center'}>
          <Text h="18px" mb="10px" fontSize={'13px'}>
            Token
          </Text>
          {tokenDetails.map((detail: any, index: number) => {
            return (
              <Flex
                px="20px"
                key={index}
                w="100%"
                justifyContent={'space-between'}
                h="45px"
                alignItems={'center'}>
                <Text
                  fontSize={'13px'}
                  fontFamily={theme.fonts.roboto}
                  fontWeight={500}
                  color={colorMode === 'dark' ? 'gray.425' : 'gray.400'}>
                  {detail.name}
                </Text>
                <Flex alignItems={'center'}>
                  <Text
                    fontSize={'13px'}
                    fontFamily={theme.fonts.roboto}
                    fontWeight={500}
                    color={
                      detail.name === 'Admin' || detail.name === 'Contract'
                        ? 'blue.300'
                        : colorMode === 'dark'
                        ? 'white.100'
                        : 'gray.250'
                    }>
                    {detail.value1}
                  </Text>
                  {detail.value2 && (
                    <Text
                      ml="3px"
                      color={colorMode === 'dark' ? '#9d9ea5' : '#7e8993'}
                      fontSize={'11px'}>
                      ({detail.value2})
                    </Text>
                  )}
                </Flex>
              </Flex>
            );
          })}
          <Text h="18px" mt="43px" mb="10px" fontSize={'13px'}>
            Schedule
          </Text>
          {schedule.map((detail: any, index: number) => {
            return (
              <Flex
                px="20px"
                key={index}
                w="100%"
                justifyContent={'space-between'}
                h="45px"
                alignItems={'center'}>
                <Text
                  fontSize={'13px'}
                  fontFamily={theme.fonts.roboto}
                  fontWeight={500}
                  color={colorMode === 'dark' ? 'gray.425' : 'gray.400'}>
                  {detail.name}
                </Text>
                <Flex>
                  <Text
                    fontSize={'13px'}
                    fontFamily={theme.fonts.roboto}
                    fontWeight={500}
                    color={
                      detail.name === 'Admin' || detail.name === 'Contract'
                        ? 'blue.300'
                        : colorMode === 'dark'
                        ? 'white.100'
                        : 'gray.250'
                    }>
                    {detail.value}
                  </Text>
                </Flex>
              </Flex>
            );
          })}
          <Text h="18px" mt="43px" mb="10px" fontSize={'13px'}>
            sTOS Tier
          </Text>
          <Flex
            h={'35px'}
            lineHeight={'35px'}
            borderBottom={'1px solid #f4f6f8'}
            fontSize={12}
            textAlign="center">
            <Text
              w={'70px'}
              color={colorMode === 'light' ? 'gray.400' : 'white.100'}>
              Tier
            </Text>
            <Text
              w={'120px'}
              color={colorMode === 'light' ? 'gray.400' : 'white.100'}>
              Required sTOS
            </Text>
            <Text
              w={'160px'}
              color={colorMode === 'light' ? 'gray.400' : 'white.100'}>
              Allocated Token
            </Text>
          </Flex>
          {sTOSList.map(
            (
              stosInfo: {
                tier: number;
                requiredTos: number;
                allocationToken: number;
              },
              index: number,
            ) => {
              return (
                <Flex
                  key={index}
                  borderBottom={'1px solid #f4f6f8'}
                  h={'35px'}
                  lineHeight={'35px'}
                  fontSize={13}
                  textAlign="center">
                  <Text
                    w={'70px'}
                    color={colorMode === 'light' ? 'gray.250' : 'white.100'}>
                    0{stosInfo.tier}
                  </Text>
                  <Text
                    w={'120px'}
                    color={colorMode === 'light' ? 'gray.250' : 'white.100'}>
                    {stosInfo.requiredTos} TOS
                  </Text>
                  <Text
                    w={'160px'}
                    color={colorMode === 'light' ? 'gray.250' : 'white.100'}>
                    {stosInfo.allocationToken.toLocaleString()}{' '}
                    {values.tokenName}
                  </Text>
                </Flex>
              );
            },
          )}
        </Flex>
      </Flex>
    );
  };
  return (
    <Flex
      mt="30px"
      h="100%"
      w="350px"
      flexDir={'column'}
      borderRadius={'15px'}
      alignItems="center"
      border={colorMode === 'dark' ? '1px solid #363636' : '1px solid #e6eaee'}>
      <Flex
        h="71px"
        w="100%"
        alignItems={'center'}
        justifyContent="center"
        borderBottom={
          colorMode === 'dark' ? '1px solid #363636' : '1px solid #e6eaee'
        }>
        <Text
          lineHeight={1.5}
          fontWeight={'bold'}
          fontFamily={theme.fonts.titil}
          fontSize="20px"
          mt="19px"
          mb="21px"
          color={colorMode === 'dark' ? 'white.100' : 'gray.250'}>
          Public
        </Text>
      </Flex>
      <Flex w="272px" h="26px" fontSize={'12px'} mb="30px" mt="15px">
        <Flex
          w="50%"
          border={
            type === 'Vault'
              ? '1px solid #2a72e5'
              : colorMode === 'dark'
              ? '1px solid #535353'
              : '1px solid #d7d9df'
          }
          cursor="pointer"
          borderLeftRadius="5px"
          borderRight={type !== 'Vault' ? 'none' : ''}
          alignItems={'center'}
          onClick={() => setType('Vault')}
          justifyContent={'center'}>
          <Text
            color={
              type === 'Vault'
                ? 'blue.300'
                : colorMode === 'dark'
                ? 'white.100'
                : 'gray.250'
            }>
            Vault & Claim
          </Text>
        </Flex>
        <Flex
          w="50%"
          border={
            type === 'Sale'
              ? '1px solid #2a72e5'
              : colorMode === 'dark'
              ? '1px solid #535353'
              : '1px solid #d7d9df'
          }
          cursor="pointer"
          onClick={() => setType('Sale')}
          borderLeft={type !== 'Sale' ? 'none' : ''}
          borderRightRadius="5px"
          alignItems={'center'}
          justifyContent={'center'}>
          <Text
            color={
              type === 'Sale'
                ? 'blue.300'
                : colorMode === 'dark'
                ? 'white.100'
                : 'gray.250'
            }>
            Sale
          </Text>
        </Flex>
      </Flex>
      {type === 'Sale' ? <Sale /> : <VaultClaim />}

      <Flex
        mt="24px"
        w="100%"
        h="88px"
        justifyContent={'center'}
        alignItems="center"
        borderTop={
          colorMode === 'dark' ? '1px solid #363636' : '1px solid #e6eaee'
        }>
        <Button
          type="submit"
          w={'150px'}
          h={'38px'}
          bg={'blue.500'}
          fontSize={14}
          color={'white.100'}
          mr={'12px'}
          _hover={{}}
          isDisabled={
            vaultState === 'notReady' || vaultState === 'finished'
              ? btnDisable
              : false
          }
          onClick={() => {
            vaultDeploy();
          }}
          borderRadius={4}>
          {vaultState !== 'readyForToken'
            ? vaultState === 'ready' || vaultState === 'notReady'
              ? 'Deploy'
              : 'Initialize'
            : 'Send Token'}
        </Button>
      </Flex>
    </Flex>
  );
};

export default Public;
