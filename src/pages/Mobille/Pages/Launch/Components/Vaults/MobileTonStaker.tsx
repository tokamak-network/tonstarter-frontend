//MobileInitialLiquidity

import {FC, useState, useEffect, Dispatch, SetStateAction} from 'react';
import {
  Flex,
  Box,
  Text,
  useColorMode,
  useTheme,
  Link,
  Grid,
  GridItem,
  Button
} from '@chakra-ui/react';
import {shortenAddress} from 'utils';
import {MobileVaultTable} from './MobileVaultTable';
import {useActiveWeb3React} from 'hooks/useWeb3';
import {getSigner} from 'utils/contract';
import {Contract} from '@ethersproject/contracts';
import * as TOSStakerAbi from 'services/abis/TOSStakerAbi.json';
import {ethers} from 'ethers';
import momentTZ from 'moment-timezone';
import moment from 'moment';
import * as TONStakerAbi from 'services/abis/TONStakerAbi.json';
import * as TONStakerInitializeAbi from 'services/abis/TONStakerInitializeAbi.json';
import store from 'store';
import {toastWithReceipt} from 'utils';
import {setTxPending} from 'store/tx.reducer';
import {openToast} from 'store/app/toast.reducer';
import {useAppSelector} from 'hooks/useRedux';
import {selectTransactionType} from 'store/refetch.reducer';
import {BASE_PROVIDER} from 'constants/index';

type TonStaker = {
  vault: any;
  project: any;
};

type TokenCompProps = {
  vault: any;
  project: any;
};

type DistributeCompProps = {
  vault: any;
  project: any;
  distributable: number;
  claimTime: number;
  showDate: boolean;
  distributeDisable: boolean;
  distribute: Dispatch<SetStateAction<any>>;
};

export const MobileTonStaker: FC<TonStaker> = ({vault, project}) => {
  const theme = useTheme();
  const {colorMode} = useColorMode();
  const [buttonState, setButtonState] = useState('Token');
  const {account, library} = useActiveWeb3React();
  const [distributable, setDistributable] = useState<number>(0);
  const [claimTime, setClaimTime] = useState<number>(0);
  const [showDate, setShowDate] = useState<boolean>(false);
  const network = BASE_PROVIDER._network.name;
  const {transactionType, blockNumber} = useAppSelector(selectTransactionType);
  const [distributeDisable, setDistributeDisable] = useState<boolean>(true);
  const TONStaker = new Contract(
    vault.vaultAddress,
    TONStakerInitializeAbi.abi,
    library,
  );
  useEffect(() => {
    async function getLPToken() {
      if (account === null || account === undefined || library === undefined) {
        return;
      }
      const now = moment().unix();
      const signer = getSigner(library, account);
      const currentRound = await TONStaker.connect(signer).currentRound();
      const nowClaimRound = await TONStaker.connect(signer).nowClaimRound();
      const amount = await TONStaker.connect(signer).calculClaimAmount(
        currentRound,
      );
      const totalClaimCount = await TONStaker.totalClaimCounts();
      setDistributeDisable(Number(nowClaimRound) >= Number(currentRound));
      const disabled = Number(nowClaimRound) >= Number(currentRound);
      const claimDate =
        Number(currentRound) === Number(totalClaimCount)
          ? await TONStaker.connect(signer).claimTimes(Number(currentRound) - 1)
          : await TONStaker.connect(signer).claimTimes(currentRound);
      const amountFormatted = parseInt(ethers.utils.formatEther(amount));
      setShowDate(amountFormatted === 0 && Number(claimDate) > now);
      setClaimTime(claimDate);
      setDistributable(amountFormatted);
    }
    getLPToken();
  }, [account, library, transactionType, blockNumber, project, vault]);


  async function distribute() {
    if (account === null || account === undefined || library === undefined) {
      return;
    }
    const signer = getSigner(library, account);
    try {
      const receipt = await TONStaker.connect(signer).claim();
      store.dispatch(setTxPending({tx: true}));

      if (receipt) {
        toastWithReceipt(receipt, setTxPending, 'Launch');
        const blah = await receipt.wait();
        const blockNum = blah.blockNumber;
        const block = await BASE_PROVIDER.getBlock(blockNum);
        const timeStamp = block.timestamp;
        const startTime = Number(timeStamp);
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
          fontWeight={buttonState === 'Distribute' ? 'bold' : 'normal'}
          color={
            buttonState === 'Distribute'
              ? colorMode === 'light'
                ? '#304156'
                : '#ffffff'
              : '#9d9ea5'
          }
          onClick={() => setButtonState('Distribute')}>
          Distribute
        </Text>
      </Flex>
      {buttonState === 'Token' ? (
        <TokenComp vault={vault} project={project} />
      ) : (
        <DistributeComp
          vault={vault}
          project={project}
          claimTime={claimTime}
          showDate={showDate}
          distributeDisable={distributeDisable}
          distributable={distributable}
          distribute={distribute}
        />
      )}
      <MobileVaultTable claim={vault.claim} />
    </Flex>
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

const DistributeComp: React.FC<DistributeCompProps> = ({
  project,
  vault,
  claimTime,
  showDate,
  distributeDisable,
  distributable,
  distribute,
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
          Distribute
        </Text>
      </GridItem>
      <GridItem
        style={gridItemStyle}
        borderBottom={
          colorMode === 'light' ? '1px solid #e6eaee' : '1px solid #373737'
        }>
        <Flex alignItems={'center'}>
          <Text style={rightText} mr="3px">
            {distributable.toLocaleString()}
          </Text>
          <Text
            fontFamily={theme.fonts.fld}
            fontSize={'12px'}
            color={colorMode === 'light' ? '#7e8993' : '#9d9ea5'}>
            {project.tokenSymbol}
          </Text>
        </Flex>
        <Button
              fontSize={'13px'}
              w={'100px'}
              h={'32px'}
              bg={'#257eee'}
              color={'#ffffff'}
              isDisabled={distributeDisable}
              _disabled={{
                color: colorMode === 'light' ? '#86929d' : '#838383',
                bg: colorMode === 'light' ? '#e9edf1' : '#353535',
                cursor: 'not-allowed',
              }}
              _hover={
                distributeDisable
                  ? {}
                  : {
                    
                      cursor: 'pointer',
                    }
              }
              _active={
                distributeDisable
                  ? {}
                  : {
                      background: '#2a72e5',
                      border: 'solid 1px #2a72e5',
                      color: '#fff',
                    }
              }
              onClick={ distribute}>
              Distribute
            </Button>
      </GridItem>
      <GridItem style={gridItemStyle}>
       <Flex flexDir={'column'}>
       <Text
            fontFamily={theme.fonts.fld}
            fontSize={'12px'}
            color={colorMode === 'light' ? '#7e8993' : '#9d9ea5'}>
           You can distribute on
          </Text>
          <Text style={rightText}>  {moment.unix(claimTime).format('MMM, DD, yyyy HH:mm:ss')}{' '}
                    {momentTZ.tz(momentTZ.tz.guess()).zoneAbbr()}</Text>
       </Flex>
      </GridItem>
    </Grid>
  );
};
