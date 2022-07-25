//MobileWtonTosLpReward
import {FC, useState, Dispatch, SetStateAction, useEffect} from 'react';
import {
  Flex,
  Box,
  Text,
  useColorMode,
  useTheme,
  Link,
  GridItem,
  Grid,
  Input,
  Button,
} from '@chakra-ui/react';
import {MobileVaultTable} from './MobileVaultTable';
import momentTZ from 'moment-timezone';
import moment from 'moment';
import {useActiveWeb3React} from 'hooks/useWeb3';
import {getSigner} from 'utils/contract';
import {Contract} from '@ethersproject/contracts';
import {ethers} from 'ethers';
import store from 'store';
import {toastWithReceipt} from 'utils';
import {setTxPending} from 'store/tx.reducer';
import {openToast} from 'store/app/toast.reducer';
import {useAppSelector} from 'hooks/useRedux';
import {selectTransactionType} from 'store/refetch.reducer';
import {BASE_PROVIDER} from 'constants/index';
import {shortenAddress} from 'utils';
import * as ERC20 from 'services/abis/erc20ABI(SYMBOL).json';
import * as TypeBVaultABI from 'services/abis/TypeBVault.json';
import {color} from 'd3';

type DAO = {
  vault: any;
  project: any;
};
type TokenCompProps = {
  vault: any;
  project: any;
};

type ClaimCompProps = {
  vault: any;
  project: any;
  isAdmin: boolean;
  setClaimValue: Dispatch<SetStateAction<any>>;
  setClaimAddress: Dispatch<SetStateAction<any>>;
  claimAddress: string;
  claim: Dispatch<SetStateAction<any>>;
  projTokenBalance: string;
  claimValue: number;
  setDisableButton: Dispatch<SetStateAction<any>>;
  disableButton: boolean;
};
export const MobileDao: FC<DAO> = ({vault, project}) => {
  const {colorMode} = useColorMode();
  const theme = useTheme();
  const [buttonState, setButtonState] = useState('Token');
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
      Number(projTokenBalance) !== 0 && isAdmin
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

  return (
    <Flex mt={'35px'} flexDir={'column'} px={'20px'}>
      <Flex
        mx={'auto'}
        mb={'20px'}
        fontFamily={theme.fonts.fld}
        fontSize="13px"
        alignItems={'center'}>
        <Text
          px={'12px'}
          _active={{color: colorMode === 'light' ? '#304156' : '#ffffff'}}
          onClick={() => setButtonState('Token')}
          fontWeight={buttonState === 'Token' ? 'bold' : 'normal'}
          color={
            buttonState === 'Token'
              ? colorMode === 'light'
                ? '#304156'
                : '#ffffff'
              : '#9d9ea5'
          }>
          Token
        </Text>
        <Box
          h={'9px'}
          w={'1px'}
          border={
            colorMode === 'light'
              ? '0.5px solid #d7d9df'
              : '0.5px solid #373737'
          }></Box>
        <Text
          px={'12px'}
          fontWeight={buttonState === 'Claim' ? 'bold' : 'normal'}
          color={
            buttonState === 'Claim'
              ? colorMode === 'light'
                ? '#304156'
                : '#ffffff'
              : '#9d9ea5'
          }
          onClick={() => setButtonState('Claim')}>
          Claim
        </Text>
      </Flex>
      {buttonState === 'Token' ? (
        <TokenComp vault={vault} project={project} />
      ) : (
        <ClaimComp
          project={project}
          vault={vault}
          isAdmin={isAdmin}
          setClaimValue={setClaimValue}
          claim={claim}
          claimValue={claimValue}
          projTokenBalance={projTokenBalance}
          setClaimAddress={setClaimAddress}
          claimAddress={claimAddress}
          disableButton={disableButton}
          setDisableButton={setDisableButton}
        />
      )}
      <Flex w="100%" justifyContent={'center'} mt="40px">
        <Text
          fontFamily={theme.fonts.fld}
          fontSize="15px"
          color={colorMode === 'light' ? '#7e8993' : '#9d9ea5'}
          textAlign={'center'}
          w="178px"
          wordBreak={'break-word'}>
          All tokens are used initially. There is no claim schedule
        </Text>
      </Flex>
    </Flex>
  );
};

const ClaimComp: React.FC<ClaimCompProps> = ({
  project,
  vault,
  isAdmin,
  claim,
  setClaimValue,
  claimValue,
  projTokenBalance,
  setClaimAddress,
  claimAddress,
  disableButton,
  setDisableButton,
}) => {
  const {colorMode} = useColorMode();
  const theme = useTheme();

  const network = BASE_PROVIDER._network.name;
  const gridItemStyle = {
    display: 'flex',
    flexDire: 'row',
    justifyContent: 'space-between',
    paddingLeft: '20px',
    paddingRight: '20px',
    height: '60px',
    alignItems: 'center',
  };
  const leftText = {
    fontFamily: theme.fonts.fld,
    fontSize: '14px',
    color: colorMode === 'light' ? '#7e8993' : '#9d9ea5',
  };
  const rightText = {
    fontFamily: theme.fonts.fld,
    fontSize: '14px',
    fontWeight: 'bold',
    color: colorMode === 'light' ? '#353c48' : '#fff',
  };
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
    <Grid
      h={'100%'}
      bg={colorMode === 'light' ? '#fff' : 'transparent'}
      boxShadow={
        colorMode === 'light' ? '0 1px 1px 0 rgba(61, 73, 93, 0.1)' : 'none'
      }
      border={colorMode === 'light' ? 'none' : 'solid 1px #373737'}
      borderRadius="15px">
      <GridItem
        style={gridItemStyle}
        borderBottom={
          colorMode === 'light' ? '1px solid #e6eaee' : '1px solid #373737'
        }>
        {' '}
        <Text style={rightText} fontWeight={600}>
          Claim
        </Text>
      </GridItem>
      <GridItem
        style={gridItemStyle}
        borderBottom={
          colorMode === 'light' ? '1px solid #e6eaee' : '1px solid #373737'
        }>
        <Flex>
          <Flex
            borderRadius={'4px'}
            w={'170px'}
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
              fontFamily={theme.fonts.roboto}
              fontSize={'12px'}
              px={'5px'}
              _focus={{norder: 'none'}}
              onChange={(e) => setClaimValue(Number(e.target.value))}></Input>
            {vault.isDeployed ? (
              <Text
                mr={'15px'}
                fontSize={'12px'}
                fontFamily={theme.fonts.roboto}
                color={colorMode === 'light' ? '#86929d' : '#818181'}>
                {project.tokenSymbol}
              </Text>
            ) : (
              <></>
            )}
          </Flex>
          <Flex alignItems={'center'}>
            <Text
              fontFamily={theme.fonts.fld}
              fontSize="13px"
              color={colorMode === 'light' ? '#353c48' : '#949494'}>
              Balance:{' '}
            </Text>
            <Text
              ml="3px"
              fontFamily={theme.fonts.fld}
              fontSize="13px"
              color={'#0070ed'}>
              {Number(projTokenBalance).toLocaleString()} {project.tokenSymbol}
            </Text>
          </Flex>
        </Flex>
      </GridItem>
      <GridItem style={gridItemStyle}>
        <Flex>
        <Flex
          borderRadius={'4px'}
          h={'32px'}
          alignItems={'baseline'}
          border={'1px solid #dfe4ee'}
          mr={'10px'}
          fontWeight={'bold'}>
          <Input
            border={'none'}
            h={'32px'}
            w={'170px'}
            textAlign={'right'}
            alignItems={'center'}
            value={claimAddress}
            fontFamily={theme.fonts.roboto}
            fontSize={'12px'}
            placeholder="Receiving Address"
            color={colorMode === 'light' ? '#86929d' : '#818181'}
            isInvalid={!ethers.utils.isAddress(claimAddress)}
            _focus={{norder: 'none'}}
            _invalid={{
              height: '32px',
              marginTop: '-1px',
              border: '1px solid red',
              borderRadius: '4px',
            }}
            onChange={(e: any) => setClaimAddress(e.target.value)}></Input>
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
                 
                }
          }
          _active={
            disableButton
              ? {}
              : {
                 
                }
          }
          onClick={claim}>
          Claim
        </Button>
        </Flex>
      </GridItem>
    </Grid>
  );
};

const TokenComp: React.FC<TokenCompProps> = ({vault, project}) => {
  const {colorMode} = useColorMode();
  const theme = useTheme();

  const network = BASE_PROVIDER._network.name;
  const gridItemStyle = {
    display: 'flex',
    flexDire: 'row',
    justifyContent: 'space-between',
    paddingLeft: '20px',
    paddingRight: '20px',
    height: '60px',
    alignItems: 'center',
  };
  const leftText = {
    fontFamily: theme.fonts.fld,
    fontSize: '14px',
    color: colorMode === 'light' ? '#7e8993' : '#9d9ea5',
  };
  const rightText = {
    fontFamily: theme.fonts.fld,
    fontSize: '14px',
    fontWeight: 'bold',
    color: colorMode === 'light' ? '#353c48' : '#fff',
  };
  return (
    <Grid
      h={'100%'}
      bg={colorMode === 'light' ? '#fff' : 'transparent'}
      boxShadow={
        colorMode === 'light' ? '0 1px 1px 0 rgba(61, 73, 93, 0.1)' : 'none'
      }
      border={colorMode === 'light' ? 'none' : 'solid 1px #373737'}
      borderRadius="15px">
      <GridItem
        style={gridItemStyle}
        borderBottom={
          colorMode === 'light' ? '1px solid #e6eaee' : '1px solid #373737'
        }>
        {' '}
        <Text
          fontFamily={theme.fonts.fld}
          fontSize="14px"
          color={colorMode === 'light' ? '#353c48' : '#fff'}
          fontWeight={600}>
          Token
        </Text>
        {vault.isDeployed ? (
          <Flex>
            <Text letterSpacing={'1.3px'} style={rightText} mr={'5px'}>
              {Number(vault.vaultTokenAllocation).toLocaleString()}{' '}
              {project.tokenSymbol}
            </Text>
            <Text
              fontFamily={theme.fonts.fld}
              letterSpacing={'1.3px'}
              fontSize={'14px'}
              color={colorMode === 'light' ? '#7e8993' : '#9d9ea5'}>
              {'('}
              {(
                (vault.vaultTokenAllocation / project.totalTokenAllocation) *
                100
              )
                .toString()
                .match(/^\d+(?:\.\d{0,2})?/)}
              {'%)'}
            </Text>
          </Flex>
        ) : (
          <></>
        )}
      </GridItem>
      <GridItem
        style={gridItemStyle}
        borderBottom={
          colorMode === 'light' ? '1px solid #e6eaee' : '1px solid #373737'
        }>
        <Text style={leftText} w={'103px'}>
          Vault Admin Address
        </Text>
        <Link
          isExternal
          href={
            vault.adminAddress && network === 'rinkeby'
              ? `https://rinkeby.etherscan.io/address/${vault.adminAddress}`
              : vault.adminAddress && network !== 'rinkeby'
              ? `https://etherscan.io/address/${vault.adminAddress}`
              : ''
          }
          style={rightText}
          textDecor={'underline'}>
          {vault.adminAddress ? shortenAddress(vault.adminAddress) : 'NA'}
        </Link>
      </GridItem>
      <GridItem style={gridItemStyle}>
        <Text style={leftText} w={'103px'}>
          Vault Contract Address
        </Text>
        <Link
          isExternal
          href={
            vault.vaultAddress && network === 'rinkeby'
              ? `https://rinkeby.etherscan.io/address/${vault.vaultAddress}`
              : vault.vaultAddress && network !== 'rinkeby'
              ? `https://etherscan.io/address/${vault.vaultAddress}`
              : ''
          }
          style={rightText}
          textDecor={'underline'}>
          {vault.vaultAddress ? shortenAddress(vault.vaultAddress) : 'NA'}
        </Link>
      </GridItem>
    </Grid>
  );
};
