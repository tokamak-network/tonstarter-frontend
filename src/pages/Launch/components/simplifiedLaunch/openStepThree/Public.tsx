import {
  Flex,
  useColorMode,
  useTheme,
  Text,
  Button,
  Link,
  CircularProgress,
} from '@chakra-ui/react';
import {useEffect, useState, useCallback, useMemo} from 'react';
import {useFormikContext} from 'formik';
import {Projects, VaultPublic} from '@Launch/types';
import moment from 'moment';
import {shortenAddress} from 'utils';
import {useActiveWeb3React} from 'hooks/useWeb3';
import {useAppDispatch, useAppSelector} from 'hooks/useRedux';
import {useBlockNumber} from 'hooks/useBlock';
import {useContract} from 'hooks/useContract';
import * as ERC20 from 'services/abis/erc20ABI(SYMBOL).json';
import {convertNumber} from 'utils/number';
import {selectLaunch} from '@Launch/launch.reducer';
import {selectTxType} from 'store/tx.reducer';

import {
  checkIsIniailized,
  returnVaultStatus,
  deploy,
} from '@Launch/utils/deployValues';
import {BASE_PROVIDER} from 'constants/index';
import {Scrollbars} from 'react-custom-scrollbars-2';

const Public = (props: {step: string}) => {
  const {step} = props;
  const {colorMode} = useColorMode();
  const theme = useTheme();
  const [type, setType] = useState<'Vault' | 'Sale'>('Vault');
  const {values, setFieldValue} =
    useFormikContext<Projects['CreateSimplifiedProject']>();
  const [btnDisable, setBtnDisable] = useState(true);
  const {account, library} = useActiveWeb3React();
  const [vaultState, setVaultState] = useState<
    'notReady' | 'ready' | 'readyForToken' | 'readyForSet' | 'finished'
  >('notReady');
  const [hasToken, setHasToken] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  // @ts-ignore
  const network = BASE_PROVIDER._network.name;
  const {tx, data} = useAppSelector(selectTxType);

  const {blockNumber} = useBlockNumber();
  const publicVault = values.vaults[0] as VaultPublic;

  const detailsVault = [
    {name: 'Vault Name', value: `${publicVault.vaultName}`},
    {
      name: 'Admin',
      value: `${values.ownerAddress ? values.ownerAddress : 'NA'}`,
    },
    {
      name: 'Contract',
      value: `${publicVault.vaultAddress ? publicVault.vaultAddress : 'NA'}`,
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
      value1: `${
        publicVault.publicRound1Allocation
          ? publicVault.publicRound1Allocation.toLocaleString()
          : 0
      } ${values.tokenSymbol}`,
      value2: '50%',
    },
    {
      name: 'Public Round 2',
      value1: `${
        publicVault.publicRound2Allocation
          ? publicVault.publicRound2Allocation.toLocaleString()
          : 0
      } ${values.tokenSymbol}`,
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
    {
      name: 'Minimum Funding Amount',
      value1: `${
        publicVault.hardCap ? publicVault.hardCap.toLocaleString() : '-'
      } TON`,
    },
  ];

  const schedule = [
    {
      name: 'Snapshot',
      value: `${moment
        .unix(Number(publicVault.snapshot))
        .format('YYYY.MM.DD HH:mm:ss')}`,
    },
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
      name: 'Public Round 2',
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

  //check vault state from contract
  useEffect(() => {
    checkIsIniailized(
      publicVault.vaultType,
      library,
      publicVault,
      setFieldValue,
    ).catch((e) => {
      console.log('**checkIsIniailized err**');
      console.log(e);
    });
  }, [blockNumber, publicVault, library, setFieldValue]);

  const {
    data: {hashKey},
  } = useAppSelector(selectLaunch);

  const vaultDeploy = useCallback(async () => {
    deploy(
      account,
      library,
      step,
      publicVault.vaultType,
      publicVault,
      values,
      dispatch,
      setFieldValue,
      setVaultState,
    );
  }, [account, library, step, publicVault, values, dispatch, setFieldValue]);

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

  const VaultClaim = (props: {}) => {
    return (
      <Flex flexDir={'column'} w="100%" px="20px">
        <Flex flexDir={'column'} w="100%" alignItems={'center'}>
          <Text
            h="18px"
            mb="10px"
            fontSize={'13px'}
            fontWeight={'bold'}
            color={colorMode === 'light' ? '#304156' : '#ffffff'}>
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
        <Flex mt="30px" flexDir={'column'} alignItems={'center'}>
          <Text mb="10px" fontSize={'13px'} h="18px" fontWeight={'bold'}>
            Claim
          </Text>
          <Flex w="100%" h="45px" alignItems={'center'}>
            <Text
              fontSize={'13px'}
              textAlign={'left'}
              color={colorMode === 'light' ? '#808992' : '#949494'}
              fontWeight={'bold'}>
              Claim Rounds ({publicVault.claim.length})
            </Text>
          </Flex>

          {publicVault.claim.map((claim: any, index: number) => {
            return (
              <Flex
                w="100%"
                justifyContent={'space-between'}
                h="30px"
                alignItems={'center'}>
                <Text
                  fontSize={'12px'}
                  fontFamily={theme.fonts.roboto}
                  color={colorMode === 'dark' ? 'gray.425' : 'gray.400'}>
                  <span
                    style={{
                      color: colorMode === 'light' ? '#3d495d' : '#ffffff',
                      fontWeight: 'bold',
                      marginRight: '3px',
                    }}>
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
      </Flex>
    );
  };

  const Sale = (props: {}) => {
    return (
      <Flex flexDir={'column'} w="100%">
        <Flex flexDir={'column'} w="100%" alignItems={'center'}>
          <Text
            h="18px"
            mb="10px"
            fontSize={'13px'}
            fontWeight={'bold'}
            color={colorMode === 'light' ? '#304156' : '#ffffff'}>
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
                  fontWeight={'bold'}
                  color={colorMode === 'dark' ? 'gray.425' : 'gray.400'}>
                  {detail.name}
                </Text>
                <Flex alignItems={'center'}>
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
                    {detail.value1}
                  </Text>
                  {detail.value2 && (
                    <Text
                      ml="3px"
                      color={colorMode === 'dark' ? '#9d9ea5' : '#7e8993'}
                      fontWeight="bold"
                      fontSize={'11px'}>
                      ({detail.value2})
                    </Text>
                  )}
                </Flex>
              </Flex>
            );
          })}
          <Text
            h="18px"
            mt="43px"
            mb="10px"
            fontSize={'13px'}
            fontWeight={'bold'}
            color={colorMode === 'light' ? '#304156' : '#ffffff'}>
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
                  fontWeight="bold"
                  color={colorMode === 'dark' ? 'gray.425' : 'gray.400'}>
                  {detail.name}
                </Text>
                <Flex>
                  <Text
                    fontSize={'13px'}
                    fontFamily={theme.fonts.roboto}
                    fontWeight="bold"
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
  const buttonStatus = useMemo(() => {
    const status =
      step === 'Deploy'
        ? values.isTokenDeployed === false ||
          publicVault.vaultAddress !== undefined ||
          values.vaults[2].isDeployed === false
          ? true
          : false
        : publicVault.isSet === true ||
          !hasToken ||
          values.vaults[2].isSet === false
        ? true
        : false;

    return status;
  }, [
    step,
    values.isTokenDeployed,
    values.vaults,
    publicVault.vaultAddress,
    publicVault.isSet,
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
          Public Sale
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
          w="272px"
          h="26px"
          fontSize={'12px'}
          mb="30px"
          mt="15px"
          ml="40px">
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
              fontWeight={'bold'}
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
              fontWeight={'bold'}
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
          _disabled={tx !== true?{
            background: colorMode === 'dark' ? '#353535' : '#e9edf1',
            color: colorMode === 'dark' ? '#838383' : '#86929d',
            cursor: 'not-allowed',
          }:{}}
          isDisabled={buttonStatus || tx === true}
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

export default Public;
