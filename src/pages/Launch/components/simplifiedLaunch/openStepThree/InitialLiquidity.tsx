import {Flex, useColorMode, useTheme, Text, Button} from '@chakra-ui/react';
import {
  useEffect,
  useState,
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
} from 'react';
import {useFormikContext} from 'formik';
import {
  Projects,
  VaultLiquidityIncentive,
 
  Step3_InfoList,
 
} from '@Launch/types';
import {shortenAddress} from 'utils/address';
import moment from 'moment';
import bn from 'bignumber.js';
import {DEPLOYED} from 'constants/index';
import {LibraryType} from 'types';
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
import * as InitialLiquidityVault from 'services/abis/InitialLiquidityVault.json';
import {convertNumber, convertToWei} from 'utils/number';
import commafy from 'utils/commafy';
import {convertTimeStamp} from 'utils/convertTIme';
import {selectLaunch, setTempHash} from '@Launch/launch.reducer';

const InitialLiquidity = () => {
  const {colorMode} = useColorMode();
  const theme = useTheme();
  const [btnDisable, setBtnDisable] = useState(true);

  const {values, setFieldValue} =
    useFormikContext<Projects['CreateSimplifiedProject']>();
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
  const {selectedVaultName} = useVaultSelector();
  const {blockNumber} = useBlockNumber();

  const initialVault = values.vaults[1] as VaultLiquidityIncentive;

  const details = [
    {name: 'Vault Name', value: `${initialVault.vaultName}`},
    {
      name: 'Admin',
      value: `${
        values.ownerAddress ? shortenAddress(values.ownerAddress) : ''
      }`,
    },
    {
      name: 'Contract',
      value: `${
        initialVault.vaultAddress
          ? shortenAddress(initialVault.vaultAddress)
          : 'NA'
      }`,
    },
    {
      name: 'Token Allocation',
      value: `${initialVault.vaultTokenAllocation.toLocaleString()} ${
        values.tokenSymbol
      }`,
    },
    {
      name: 'Token Price',
      value: `${
        values.projectTokenPrice
          ? (1 / values.projectTokenPrice).toLocaleString()
          : '0'
      } TON`,
    },
    {
      name: 'Start Time',
      value: `${
        initialVault.startTime
          ? moment
              .unix(Number(initialVault.startTime))
              .format('YYYY.MM.DD HH:mm:ss')
          : 'NA'
      }`,
    },
  ];

  function encodePriceSqrt(reserve1: number, reserve0: number) {
    return new bn(reserve1.toString())
      .div(reserve0.toString())
      .sqrt()
      .multipliedBy(new bn(2).pow(96))
      .integerValue(3)
      .toFixed();
  }

  function getContract(library: LibraryType) {
    const {InitialLiquidityVault} = DEPLOYED;
    const contract = new Contract(
      InitialLiquidityVault,
      InitialLiquidityAbi.abi,
      library,
    );
    return contract;
  }

  const {vaultName, vaultType, index} = initialVault;

  //check vault state from contract
  useEffect(() => {
    async function checkIsIniailized() {
      if (
        initialVault.vaultAddress !== '' ||
        initialVault.vaultAddress !== undefined
      ) {
        const publicVaultSecondContract = new Contract(
          initialVault.vaultAddress as string,
          InitialLiquidityVault.abi,
          library,
        );
        const initSqrtPriceX96 =
          await publicVaultSecondContract.initSqrtPriceX96();
        const isInitialized = Number(initSqrtPriceX96.toString()) > 0;
        return setFieldValue(`vaults[1].isSet`, isInitialized);
      }
    }
    checkIsIniailized().catch((e) => {
      console.log('**checkIsIniailized err**');
      console.log(e);
    });
  }, [blockNumber, initialVault, library, setFieldValue]);

  //setVaultState
  useEffect(() => {
    const isTokenDeployed = values.isTokenDeployed;
    const isVaultDeployed = initialVault.isDeployed;
    const vaultDeployReady = isTokenDeployed && !isVaultDeployed;
    const isSet = initialVault.isSet;

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
    initialVault.isDeployed,
    initialVault.isSet,
    values.isTokenDeployed,
    blockNumber
  ]);

  useEffect(() => {
    const info = {
      Vault: [
        {
          title: 'Vault Name',
          content: initialVault?.vaultName || '-',
        },
        {
          title: 'Admin',
          content: `${initialVault?.adminAddress || '-'}`,
          isHref: true,
        },
        {
          title: 'Contract',
          content: `${initialVault?.vaultAddress || '-'}`,
          isHref: true,
        },
        {
          title: 'Token Allocation',
          content: `${commafy(initialVault?.vaultTokenAllocation) || '-'} ${
            values.tokenName
          }`,
        },
        {
          title: 'Token Price',
          content: `1TOS : ${values?.tosPrice}${values?.tokenSymbol}` || '',
        },
        {
          title: 'Start Time',
          content:
            `${convertTimeStamp(
              //@ts-ignore
              initialVault?.startTime,
              'DD.MM.YYYY HH:mm:ss',
            )}` || '',
        },
      ],
    };
  }, [initialVault, values]);


  useEffect(()=> {
    setBtnDisable(vaultState==='readyForToken' && !values.isAllDeployed? true:false )
  },[values.isAllDeployed, vaultState, blockNumber])
  const {
    data: {hashKey},
  } = useAppSelector(selectLaunch);

  const vaultDeploy = useCallback(async () => {    
    if (account && library && vaultState === 'ready') {

      const vaultContract = getContract(library);
      
      const signer = getSigner(library, account);
      try {
        
        const tx = await vaultContract
          ?.connect(signer)
          .create(
            initialVault?.vaultName,
            values.tokenAddress,
            initialVault?.adminAddress,
            100,
            values.tosPrice * 100,
          );

        dispatch(
          setTempHash({
            data: tx.hash,
          }),
        );

        const receipt = await tx.wait();
        const {logs} = receipt;

        const iface = new ethers.utils.Interface(InitialLiquidityAbi.abi);

        const result = iface.parseLog(logs[logs.length - 1]);
        const {args} = result;
        setFieldValue(`vaults[1].vaultAddress`, args[0]);
        setFieldValue(`vaults[1].isDeployed`, true);
        setVaultState('readyForToken');
      } catch (e) {
        console.log(e);
        setFieldValue(`vaults[1].isDeployedErr`, true);
      }
    }
    if (account && library && vaultState === 'readyForSet') {
      console.log('initialize');

      const signer = getSigner(library, account);
      try {
        const {TOS_ADDRESS} = DEPLOYED;
        const InitialLiquidityVault_Contract = new Contract(
          initialVault.vaultAddress as string,
          InitialLiquidityVault.abi,
          library,
        );
        const projectTokenPrice = values.tosPrice * 100;
        const vaultTokenAllocationWei = convertToWei(
          String(initialVault?.vaultTokenAllocation),
        );
        const computePoolAddress = await InitialLiquidityVault_Contract.connect(
          signer,
        ).computePoolAddress(TOS_ADDRESS, values.tokenAddress, 3000);

        const reserv0 =
          computePoolAddress[1] === TOS_ADDRESS ? 100 : projectTokenPrice;
        const reserv1 =
          computePoolAddress[2] === TOS_ADDRESS ? 100 : projectTokenPrice;
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
        const receipt = await tx.wait();
        if (receipt) {
          setFieldValue(`vaults[${initialVault?.index}].isSet`, true);
          setVaultState('finished');
        }
      } catch (e) {}
    }
  }, [
    account,
    dispatch,
    initialVault,
    library,
    setFieldValue,
    values,
    vaultState,
    blockNumber,
  ]);

  const ERC20_CONTRACT = useContract(values?.tokenAddress, ERC20.abi);
  useEffect(() => {
    async function fetchContractBalance() {
      if (
        ERC20_CONTRACT &&
        initialVault?.vaultAddress &&
        initialVault?.isDeployed === true
      ) {
        const tokenBalance = await ERC20_CONTRACT.balanceOf(
          initialVault.vaultAddress,
        );
        if (tokenBalance && initialVault.vaultTokenAllocation) {
          initialVault.vaultTokenAllocation <=
          Number(convertNumber({amount: tokenBalance.toString()}))
            ? setHasToken(true)
            : setHasToken(false);
        }
      }
    }
    fetchContractBalance();
  }, [blockNumber, ERC20_CONTRACT, initialVault]);

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

  return (
    <Flex
      mt="30px"
      h="600px"
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
          mt="19px"
          mb="21px"
          fontWeight={'bold'}
          fontFamily={theme.fonts.titil}
          fontSize="20px"
          color={colorMode === 'dark' ? 'white.100' : 'gray.250'}>
          Initial Liquidity
        </Text>
      </Flex>
      <Flex
        mt="30px"
        flexDir={'column'}
        px="20px"
        w="100%"
        alignItems={'center'}>
        <Text mb="11px" fontSize={'13px'}>
          Vault
        </Text>
        {details.map((detail: any) => {
          return (
            <Flex
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
        <Text
          mt="37px"
          textAlign={'center'}
          fontWeight={500}
          fontSize="13px"
          color={'#ff3b3b'}>
          Warning
        </Text>
        <Text
          textAlign={'center'}
          mt="10px"
          fontWeight={500}
          fontSize="12px"
          lineHeight={1.5}
          color={colorMode === 'dark' ? 'white.200' : 'gray.225'}>
          If the deployment is not completed within the deadline, the entire
          funding process will be canceled.
        </Text>
      </Flex>
      <Flex
        mt="13px"
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
          isDisabled={
            vaultState === 'notReady' || vaultState === 'finished'
              ? btnDisable
              : false
          }
          onClick={() => {
            vaultDeploy();
          }}
          _hover={{}}
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

export default InitialLiquidity;
