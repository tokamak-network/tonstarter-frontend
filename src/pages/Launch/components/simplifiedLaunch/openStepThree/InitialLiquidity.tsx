import {
  Flex,
  useColorMode,
  useTheme,
  Text,
  Button,
  Link,
} from '@chakra-ui/react';
import {useEffect, useState, useCallback} from 'react';
import {useFormikContext} from 'formik';
import {Projects, VaultLiquidityIncentive} from '@Launch/types';
import {shortenAddress} from 'utils/address';
import moment from 'moment';
import {useActiveWeb3React} from 'hooks/useWeb3';
import {useAppDispatch, useAppSelector} from 'hooks/useRedux';
import {useBlockNumber} from 'hooks/useBlock';
import {useContract} from 'hooks/useContract';
import * as ERC20 from 'services/abis/erc20ABI(SYMBOL).json';
import {convertNumber} from 'utils/number';
import {BASE_PROVIDER} from 'constants/index';

import {selectLaunch} from '@Launch/launch.reducer';
import {
  checkIsIniailized,
  returnVaultStatus,
  deploy,
} from '@Launch/utils/deployValues';

const InitialLiquidity = (props:{step:string}) => {
  const {step} = props;
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
  const network = BASE_PROVIDER._network.name;
  const {blockNumber} = useBlockNumber();
  
  const initialVault = values.vaults[1] as VaultLiquidityIncentive;

  const details = [
    {name: 'Vault Name', value: `${initialVault.vaultName}`},
    {
      name: 'Admin',
      value: `${values.ownerAddress ? values.ownerAddress : ''}`,
    },
    {
      name: 'Contract',
      value: `${initialVault.vaultAddress ? initialVault.vaultAddress : 'NA'}`,
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

  //check vault state from contract
  useEffect(() => {
    checkIsIniailized(
      initialVault.vaultType,
      library,
      initialVault,
      setFieldValue,
    ).catch((e) => {
      console.log('**checkIsIniailized err**');
      console.log(e);
    });
  }, [blockNumber, initialVault, library, setFieldValue]);

  //setVaultState

  // useEffect(() => {
  //   setBtnDisable(
  //     vaultState === 'readyForToken' && !values.isAllDeployed ? true : false,
  //   );
  // }, [values.isAllDeployed, vaultState, blockNumber]);

  const {
    data: {hashKey},
  } = useAppSelector(selectLaunch);

  const vaultDeploy = useCallback(async () => {
    deploy(
      account,
      library,
      step,
      initialVault.vaultType,
      initialVault,
      values,
      dispatch,
      setFieldValue,
      setVaultState,
    );
  }, [account, dispatch, initialVault, library, setFieldValue, values, step]);

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
             
              {(detail.name === 'Admin' || detail.name === 'Contract') && detail.value !== 'NA'? (
                <Link
                  fontSize={'13px'}
                  fontFamily={theme.fonts.roboto}
                  fontWeight={500}
                  color={'blue.300'}
                  isExternal
                  href={
                    detail.value && network === 'goerli'
                      ? `https://goerli.etherscan.io/address/${detail.value}`
                      : detail.value && network !== 'goerli'
                      ? `https://etherscan.io/address/${detail.value}`
                      : ''
                  }
                  _hover={{color: '#2a72e5'}}>
                  {detail.value ? shortenAddress(detail.value) : 'NA'}
                </Link>
              ) : (
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
              )}
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
          _disabled={{
            background: colorMode === 'dark' ? '#353535' : '#e9edf1',
            color: colorMode === 'dark' ? '#838383' : '#86929d',
            cursor: 'not-allowed',
          }}
          isDisabled={
            step === 'Deploy'
              ? initialVault.vaultAddress === undefined
                ? false
                : true
              : (initialVault.isSet === true || initialVault.vaultAddress === undefined)
              ? true
              : false
          }
          onClick={() => {
            vaultDeploy();
          }}
          _hover={{}}
          borderRadius={4}>
           {step}
        </Button>
      </Flex>
    </Flex>
  );
};

export default InitialLiquidity;
