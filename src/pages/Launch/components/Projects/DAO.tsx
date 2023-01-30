import {FC, useState, useEffect} from 'react';
import {
  Flex,
  Text,
  Grid,
  GridItem,
  useTheme,
  useColorMode,
  Button,
  Input,
  Link,
} from '@chakra-ui/react';
import {shortenAddress} from 'utils/address';
import {PublicPageTable} from './PublicPageTable';
import * as ERC20 from 'services/abis/erc20ABI(SYMBOL).json';
import * as TypeBVaultABI from 'services/abis/TypeBVault.json';
import {Contract} from '@ethersproject/contracts';
import {useActiveWeb3React} from 'hooks/useWeb3';
import commafy from 'utils/commafy';
import {getSigner} from 'utils/contract';
import {ethers} from 'ethers';
import store from 'store';
import {toastWithReceipt} from 'utils';
import {setTxPending} from 'store/tx.reducer';
import {openToast} from 'store/app/toast.reducer';
import {useAppSelector} from 'hooks/useRedux';
import {selectTransactionType} from 'store/refetch.reducer';
import {BASE_PROVIDER} from 'constants/index';
type DAO = {vault: any; project: any};

export const DAO: FC<DAO> = ({vault, project}) => {
  const {colorMode} = useColorMode();
  const theme = useTheme();
  const [claimValue, setClaimValue] = useState(0);
  const [disableButton, setDisableButton] = useState<boolean>(true);
  const {account, library} = useActiveWeb3React();
  const [projTokenBalance, setProjTokenBalance] = useState<string>('');
  const [claimAddress, setClaimAddress] = useState<string>('');
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const projectToken = new Contract(project.tokenAddress, ERC20.abi, library);
  const {transactionType, blockNumber} = useAppSelector(selectTransactionType);
  const network = BASE_PROVIDER._network.name;

  const typeBVault = new Contract(
    vault.vaultAddress,
    TypeBVaultABI.abi,
    library,
  );
  useEffect(() => {
    async function getBalance() {
      if (account === null || account === undefined || library === undefined) {
        return;
      }
      const signer = getSigner(library, account);
      const tokBalance = await projectToken.balanceOf(vault.vaultAddress);
      setProjTokenBalance(ethers.utils.formatEther(tokBalance));
    }
    getBalance();
  }, [transactionType, blockNumber]);

  useEffect(() => {
    if (
      ethers.utils.isAddress(claimAddress) &&
      Number(claimValue) !== 0 &&
      Number(projTokenBalance) !== 0
    ) {
      setDisableButton(false);
    } else {
      setDisableButton(true);
    }
  }, [claimAddress, claimValue, projTokenBalance]);

  useEffect(() => {
    if (account !== undefined && account !== null) {
      if (
        ethers.utils.getAddress(account) ===
        ethers.utils.getAddress(project.owner)
      ) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    } else {
      setIsAdmin(false);
    }
  }, [account, project]);

  async function claim() {
    if (account === null || account === undefined || library === undefined) {
      return;
    }
    const signer = getSigner(library, account);

    try {
      const fotmattedAmount = ethers.utils.parseEther(claimValue.toString());
      const receipt = await typeBVault
        .connect(signer)
        .claim(claimAddress, fotmattedAmount);
      store.dispatch(setTxPending({tx: true}));
      if (receipt) {
        toastWithReceipt(receipt, setTxPending, 'Launch');
        await receipt.wait();
      }
    } catch (e) {
      store.dispatch(setTxPending({tx: false}));
      store.dispatch(
        //@ts-ignore
        openToast({
          payload: {
            status: 'error',
            title: 'Tx fail to send',
            description: `something went wrong`,
            duration: 5000,
            isClosable: true,
          },
        }),
      );
    }
  }
  const themeDesign = {
    border: {
      light: 'solid 1px #e6eaee',
      dark: 'solid 1px #373737',
    },
    font: {
      light: 'black.300',
      dark: 'gray.475',
    },
    tosFont: {
      light: 'gray.250',
      dark: 'black.100',
    },
    borderDashed: {
      light: 'dashed 1px #dfe4ee',
      dark: 'dashed 1px #535353',
    },
    buttonColorActive: {
      light: 'gray.225',
      dark: 'gray.0',
    },
    buttonColorInactive: {
      light: '#c9d1d8',
      dark: '#777777',
    },
  };

  return (
    <Flex flexDirection={'column'} w={'1030px'} p={'0px'}>
      <Grid templateColumns="repeat(2, 1fr)" w={'100%'}>
        <Flex flexDirection={'column'}>
          <GridItem
            border={themeDesign.border[colorMode]}
            borderRight={'none'}
            borderBottom={'none'}
            className={'chart-cell'}
            borderTopLeftRadius={'4px'}
            fontSize={'16px'}
            fontFamily={theme.fonts.fld}>
            <Text
              fontSize={'15px'}
              fontWeight={'bolder'}
              color={colorMode === 'light' ? '#353c48' : 'white.0'}>
              Token
            </Text>
            {vault.isDeployed ? (
               <Flex alignItems={'center'}>
               <Text mr={'5px'}>
                 {Number(vault.vaultTokenAllocation).toLocaleString()}
                 {` `}
                 {project.tokenSymbol}
               </Text>
               <Text letterSpacing={'1.3px'} fontSize={'13px'} color={'#7e8993'}>
                {((vault.vaultTokenAllocation/project.totalTokenAllocation)*100).toString()
             .match(/^\d+(?:\.\d{0,2})?/)}%</Text>
               </Flex>
            ) : (
              <></>
            )}
          </GridItem>
          <GridItem
            border={themeDesign.border[colorMode]}
            borderRight={'none'}
            borderBottom={'none'}
            className={'chart-cell'}
            fontFamily={theme.fonts.fld}>
            <Text
              fontSize={'13px'}
              w={'96px'}
              color={colorMode === 'light' ? '#7e8993' : '#9d9ea5'}>
              Vault Admin Address
            </Text>
            <Link
              isExternal
              href={
                vault.adminAddress && network === 'goerli'
                  ? `https://goerli.etherscan.io/address/${vault.adminAddress}`
                  : vault.adminAddress && network !== 'goerli'
                  ? `https://etherscan.io/address/${vault.adminAddress}`
                  : ''
              }
              color={colorMode === 'light' ? '#353c48' : '#9d9ea5'}
              _hover={{color: '#2a72e5'}}
              fontFamily={theme.fonts.fld}>
              {vault.adminAddress ? shortenAddress(vault.adminAddress) : 'NA'}
            </Link>
          </GridItem>
          <GridItem
            border={themeDesign.border[colorMode]}
            borderRight={'none'}
            className={'chart-cell'}
            fontFamily={theme.fonts.fld}
            borderBottomLeftRadius={'4px'}>
            <Text
              w={'96px'}
              color={colorMode === 'light' ? '#7e8993' : '#9d9ea5'}>
              Vault Contract Address
            </Text>
            <Link
              isExternal
              href={
                vault.vaultAddress && network === 'goerli'
                  ? `https://goerli.etherscan.io/address/${vault.vaultAddress}`
                  : vault.vaultAddress && network !== 'goerli'
                  ? `https://etherscan.io/address/${vault.vaultAddress}`
                  : ''
              }
              color={colorMode === 'light' ? '#353c48' : '#9d9ea5'}
              _hover={{color: '#2a72e5'}}
              fontFamily={theme.fonts.fld}>
              {vault.vaultAddress ? shortenAddress(vault.vaultAddress) : 'NA'}
            </Link>
          </GridItem>
        </Flex>
        <Flex flexDirection={'column'}>
          {isAdmin ? (
            <>
              {' '}
              <GridItem
                border={themeDesign.border[colorMode]}
                borderBottom={'none'}
                className={'chart-cell'}
                fontSize={'16px'}
                fontFamily={theme.fonts.fld}
                borderTopEndRadius={'4px'}>
                <Text
                  fontSize={'15px'}
                  color={colorMode === 'light' ? '#353c48' : 'white.0'}>
                  Claim
                </Text>
              </GridItem>
              <GridItem
                border={themeDesign.border[colorMode]}
                borderBottom={'none'}
                className={'chart-cell'}
                fontFamily={theme.fonts.fld}
                justifyContent={'flex-start'}>
                <Text mr={'38px'} w={'58px'}>
                  Claim Amount
                </Text>
                <Flex
                  borderRadius={'4px'}
                  w={'240px'}
                  h={'32px'}
                  alignItems={'baseline'}
                  border={'1px solid #dfe4ee'}
                  mr={'15px'}
                  fontWeight={'bold'}>
                  <Input
                    border={'none'}
                    h={'32px'}
                    textAlign={'right'}
                    alignItems={'center'}
                    value={claimValue}
                    fontSize={'15px'}
                    _focus={{norder: 'none'}}
                    onChange={(e) =>
                      setClaimValue(Number(e.target.value))
                    }></Input>
                  {vault.isDeployed ? (
                    <Text
                      mr={'15px'}
                      color={colorMode === 'light' ? '#86929d' : '#818181'}>
                      {project.tokenSymbol}
                    </Text>
                  ) : (
                    <></>
                  )}
                </Flex>
                <Flex flexDir={'row'} fontSize={'11px'}>
                  Balance :{' '}
                  {vault.isDeployed ? (
                    <Text ml={'2px'} color={'#0070ed'}>
                      {Number(projTokenBalance).toLocaleString()}
                      {` `}
                      {project.tokenSymbol}
                    </Text>
                  ) : (
                    <></>
                  )}
                </Flex>
              </GridItem>
              <GridItem
                border={themeDesign.border[colorMode]}
                className={'chart-cell'}
                fontFamily={theme.fonts.fld}
                justifyContent={'flex-start'}
                borderBottomRightRadius={'4px'}>
                <Text mr={'38px'} w={'58px'}>
                  Address
                </Text>
                <Flex
                  borderRadius={'4px'}
                  w={'240px'}
                  h={'32px'}
                  alignItems={'baseline'}
                  border={'1px solid #dfe4ee'}
                  mr={'15px'}
                  fontWeight={'bold'}>
                  <Input
                    border={'none'}
                    h={'32px'}
                    w={'240px'}
                    textAlign={'right'}
                    alignItems={'center'}
                    value={claimAddress}
                    isInvalid={!ethers.utils.isAddress(claimAddress)}
                    fontSize={'15px'}
                    _focus={{norder: 'none'}}
                    _invalid={{
                      height: '32px',
                      marginTop: '-1px',
                      border: '1px solid red',
                      borderRadius: '4px',
                    }}
                    onChange={(e: any) =>
                      setClaimAddress(e.target.value)
                    }></Input>
                </Flex>
                <Button
                  fontSize={'13px'}
                  w={'100px'}
                  h={'32px'}
                  bg={'#257eee'}
                  disabled={disableButton}
                  color={'#fff'}
                  _disabled={{
                    color: colorMode === 'light' ? '#86929d' : '#838383',
                    bg: colorMode === 'light' ? '#e9edf1' : '#353535',
                    cursor: 'not-allowed',
                  }}
                  _hover={
                    disableButton
                      ? {}
                      : {
                          background: 'transparent',
                          border: 'solid 1px #2a72e5',
                          color: themeDesign.tosFont[colorMode],
                          cursor: 'pointer',
                        }
                  }
                  _active={
                    disableButton
                      ? {}
                      : {
                          background: '#2a72e5',
                          border: 'solid 1px #2a72e5',
                          color: '#fff',
                        }
                  }
                  onClick={() => claim()}>
                  Claim
                </Button>
              </GridItem>
            </>
          ) : (
            <>
              <GridItem
                border={themeDesign.border[colorMode]}
                borderBottom={'none'}
                borderTopRightRadius={'4px'}
                className={'chart-cell no-border-bottom'}>
                <Text fontFamily={theme.fonts.fld}>{''}</Text>
              </GridItem>
              <GridItem
                border={themeDesign.border[colorMode]}
                borderBottom={'none'}
                className={'chart-cell no-border-bottom'}>
                <Text fontFamily={theme.fonts.fld}>{''}</Text>
              </GridItem>
              <GridItem
                border={themeDesign.border[colorMode]}
                borderBottomRightRadius={'4px'}
                className={'chart-cell no-border-bottom'}>
                <Text fontFamily={theme.fonts.fld}>{''}</Text>
              </GridItem>
            </>
          )}
        </Flex>
      </Grid>
      <Flex
        color={colorMode === 'light' ? '#9d9ea5' : '#7e8993'}
        fontFamily={theme.fonts.fld}
        justifyContent={'center'}
        mt={'82px'}
        alignItems={'center'}>
        There is no claim schedule
      </Flex>
    </Flex>
  );
};
