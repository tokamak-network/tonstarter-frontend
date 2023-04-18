import {
  Flex,
  useColorMode,
  useTheme,
  Text,
  Button,
  Link,
  CircularProgress
} from '@chakra-ui/react';
import {useEffect, useState, useCallback, useMemo} from 'react';
import {Projects, VaultTONStarter} from '@Launch/types';
import {useFormikContext} from 'formik';
import moment from 'moment';
import {shortenAddress} from 'utils';
import {useActiveWeb3React} from 'hooks/useWeb3';
import {useAppDispatch, useAppSelector} from 'hooks/useRedux';
import {useBlockNumber} from 'hooks/useBlock';
import {useContract} from 'hooks/useContract';
import * as ERC20 from 'services/abis/erc20ABI(SYMBOL).json';
import {convertNumber} from 'utils/number';
import {selectLaunch} from '@Launch/launch.reducer';
import {Scrollbars} from 'react-custom-scrollbars-2';
import {selectTxType} from 'store/tx.reducer';

import {
  checkIsIniailized,
  returnVaultStatus,
  deploy,
} from '@Launch/utils/deployValues';
import {BASE_PROVIDER} from 'constants/index';

const TonStaker = (props: {step: string}) => {
  const {step} = props;

  const {colorMode} = useColorMode();
  const theme = useTheme();
  const [btnDisable, setBtnDisable] = useState(true);
  const {account, library} = useActiveWeb3React();
  const [vaultState, setVaultState] = useState<
    'notReady' | 'ready' | 'readyForToken' | 'readyForSet' | 'finished'
  >('notReady');
  const [hasToken, setHasToken] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  // @ts-ignore
  const {blockNumber} = useBlockNumber();
  const network = BASE_PROVIDER._network.name;

  const {values, setFieldValue} =
    useFormikContext<Projects['CreateSimplifiedProject']>();

  const tonVault = values.vaults[3] as VaultTONStarter;
  const {tx, data} = useAppSelector(selectTxType);
console.log(tx, data);

  //check vault state from contract
  useEffect(() => {
    checkIsIniailized(
      tonVault.vaultType,
      library,
      tonVault,
      setFieldValue,
    ).catch((e) => {
      console.log('**checkIsIniailized err**');
      console.log(e);
    });
  }, [blockNumber, values, tonVault]);

  //setVaultState
  useEffect(() => {
    returnVaultStatus(
      values,
      tonVault.vaultType,
      tonVault,
      hasToken,
      setVaultState,
    );
  }, [hasToken, tonVault, values, blockNumber]);

  const {
    data: {hashKey},
  } = useAppSelector(selectLaunch);

  const vaultDeploy = useCallback(async () => {
    deploy(
      account,
      library,
      step,
      tonVault.vaultType,
      tonVault,
      values,
      dispatch,
      setFieldValue,
      setVaultState,
    );
  }, [account, library, step, tonVault, values, dispatch, setFieldValue]);

  const ERC20_CONTRACT = useContract(values?.tokenAddress, ERC20.abi);

  useEffect(() => {
    async function fetchContractBalance() {
      if (
        ERC20_CONTRACT &&
        tonVault?.vaultAddress &&
        tonVault?.isDeployed === true
      ) {
        const tokenBalance = await ERC20_CONTRACT.balanceOf(
          tonVault.vaultAddress,
        );
        if (tokenBalance && tonVault.vaultTokenAllocation) {
          tonVault.vaultTokenAllocation <=
          Number(convertNumber({amount: tokenBalance.toString()}))
            ? setHasToken(true)
            : setHasToken(false);
        }
      }
    }
    fetchContractBalance();
  }, [blockNumber, ERC20_CONTRACT, tonVault]);

  const detailsVault = [
    {name: 'Vault Name', value: `${tonVault.vaultName}`},
    {
      name: 'Admin',
      value: `${values.ownerAddress ? values.ownerAddress : ''}`,
    },
    {
      name: 'Contract',
      value: `${tonVault.vaultAddress ? tonVault.vaultAddress : 'NA'}`,
    },
    {
      name: 'Token Allocation',
      value: `${tonVault.vaultTokenAllocation.toLocaleString()} ${
        values.tokenSymbol
      }`,
    },
  ];

  const buttonStatus = useMemo(() => {
    const status =
      step === 'Deploy'
        ? values.isTokenDeployed === false ||
          tonVault.vaultAddress !== undefined ||
          values.vaults[0].isDeployed === false
          ? true
          : false
        : tonVault.isSet === true ||
          !hasToken ||
          values.vaults[0].isSet === false
        ? true
        : false;

    return status;
  }, [
    step,
    values.isTokenDeployed,
    values.vaults,
    tonVault.vaultAddress,
    tonVault.isSet,
    hasToken,
  ]);

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
          TON Staker
        </Text>
      </Flex>
      <Scrollbars
        style={{
          width: '100%',
          height: '440px',
          display: 'flex',
          position: 'relative',

          justifyContent: 'center',
        }}
        thumbSize={70}
        renderThumbVertical={() => (
          <div
            style={{
              background: '#007aff',
              position: 'relative',
              right: '-2px',
              marginTop: '10px',
              borderRadius: '3px',
            }}></div>
        )}
        renderThumbHorizontal={() => <div style={{background: 'black'}}></div>}>
        <Flex
          mt="30px"
          flexDir={'column'}
          px="20px"
          w="100%"
          alignItems={'center'}>
          <Text
            h="18px"
            mb="10px"
            fontSize={'13px'}
            fontWeight={'bold'}
            color={colorMode === 'light' ? '#304156' : '#ffffff'}>
            Vault
          </Text>
          {detailsVault.map((detail: any) => {
            return (
              <Flex
                w="100%"
                justifyContent={'space-between'}
                h="45px"
                alignItems={'center'}>
                <Text
                  fontSize={'13px'}
                  fontFamily={theme.fonts.roboto}
                  fontWeight={'bold'}
                  color={colorMode === 'dark' ? 'gray.425' : 'gray.400'}>
                  {detail.name}
                </Text>
                {(detail.name === 'Admin' || detail.name === 'Contract') &&
                detail.value !== 'NA' ? (
                  <Link
                    fontSize={'13px'}
                    fontFamily={theme.fonts.roboto}
                    fontWeight={'bold'}
                    color={'blue.300'}
                    isExternal
                    href={
                      detail.value && network === 'goerli'
                        ? `https://goerli.etherscan.io/address/${detail.value}`
                        : detail.value && network !== 'goerli'
                        ? `https://etherscan.io/address/${detail.value}`
                        : ''
                    }
                    _hover={{
                      color: '#2a72e5',
                      textDecoration: detail.value ? 'underline' : '',
                    }}>
                    {detail.value ? shortenAddress(detail.value) : 'NA'}
                  </Link>
                ) : (
                  <Text
                    fontSize={'13px'}
                    fontFamily={theme.fonts.roboto}
                    fontWeight={'bold'}
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
        </Flex>
        <Flex
          mt="30px"
          flexDir={'column'}
          px="20px"
          w="100%"
          alignItems={'center'}>
          <Text
            mb="10px"
            fontSize={'13px'}
            h="18px"
            fontWeight={'bold'}
            color={colorMode === 'light' ? '#304156' : '#ffffff'}>
            Claim
          </Text>
          <Flex w="100%" h="45px" alignItems={'center'}>
            <Text
              fontSize={'13px'}
              textAlign={'left'}
              color={colorMode === 'light' ? '#808992' : '#949494'}
              fontWeight={'bold'}>
              Claim Rounds ({tonVault.claim.length})
            </Text>
          </Flex>

          {tonVault.claim.map((claim: any, index: number) => {
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
                  <span
                    style={{
                      color: colorMode === 'light' ? '#3d495d' : '#ffffff',
                      fontWeight: 'bold',
                      marginRight: '3px',
                    }}>
                    {' '}
                    {index < 10 ? '0' : ''}
                    {index + 1}
                  </span>
                  {moment
                    .unix(Number(claim.claimTime))
                    .format('YYYY.MM.DD HH:mm:ss')}
                </Text>
                <Text
                  fontSize={'12px'}
                  fontFamily={theme.fonts.roboto}
                  fontWeight={'bold'}>
                  {claim.claimTokenAllocation.toLocaleString()}
                  <span
                    style={{
                      color: colorMode === 'light' ? '#7e8993' : '#9d9ea5',
                    }}>
                    {' '}
                    (
                    {values.totalSupply
                      ? (
                          (claim.claimTokenAllocation / values.totalSupply) *
                          100
                        ).toLocaleString()
                      : 0}
                    %)
                  </span>
                </Text>
              </Flex>
            );
          })}
        </Flex>
      </Scrollbars>
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
          _active={buttonStatus ? {} : {bg: '#2a72e5'}}
          _hover={buttonStatus ? {} : {bg: '#2a72e5'}}
          _disabled={{
            background: colorMode === 'dark' ? '#353535' : '#e9edf1',
            color: colorMode === 'dark' ? '#838383' : '#86929d',
            cursor: 'not-allowed',
          }}
          isDisabled={buttonStatus}
          onClick={() => {
            vaultDeploy();
          }}
          borderRadius={4}>
        {tx !== true || buttonStatus
         ?(
          <Text>{step}</Text>
        ): (
            <CircularProgress
              isIndeterminate
              size={'20px'}
              zIndex={100}
              color="blue.500"
              pos="absolute"
            />
          ) }
        </Button>
      </Flex>
    </Flex>
  );
};

export default TonStaker;
