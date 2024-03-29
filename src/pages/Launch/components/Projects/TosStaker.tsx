import {FC, useEffect, useState} from 'react';
import {
  Flex,
  Text,
  Grid,
  GridItem,
  useTheme,
  useColorMode,
  Button,
  Link,
} from '@chakra-ui/react';
import {useActiveWeb3React} from 'hooks/useWeb3';
import {getSigner} from 'utils/contract';
import {shortenAddress} from 'utils/address';
import {PublicPageTable} from './PublicPageTable';
import {Contract} from '@ethersproject/contracts';
import * as TOSStakerAbi from 'services/abis/TOSStakerAbi.json';
import {ethers} from 'ethers';
import momentTZ from 'moment-timezone';
import moment from 'moment';
import commafy from 'utils/commafy';
import * as TOSStakerInitializeAbi from 'services/abis/TOSStakerInitializeAbi.json';
import store from 'store';
import {toastWithReceipt} from 'utils';
import {setTxPending} from 'store/tx.reducer';
import {openToast} from 'store/app/toast.reducer';
import {useAppSelector} from 'hooks/useRedux';
import {selectTransactionType} from 'store/refetch.reducer';
import {BASE_PROVIDER} from 'constants/index';
type TosStaker = {
  vault: any;
  project: any;
};

export const TosStaker: FC<TosStaker> = ({vault, project}) => {
  const {colorMode} = useColorMode();
  const theme = useTheme();
  const {account, library} = useActiveWeb3React();
  const [distributable, setDistributable] = useState<number>(0);
  const [claimTime, setClaimTime] = useState<number>(0);
  const {transactionType, blockNumber} = useAppSelector(selectTransactionType);
  const [distributeDisable, setDistributeDisable] = useState<boolean>(true);
  const [showDate, setShowDate] = useState<boolean>(false);
  const network = BASE_PROVIDER._network.name;
  const TOSStaker = new Contract(
    vault.vaultAddress,
    TOSStakerInitializeAbi.abi,
    library,
  );
  async function distribute() {
    if (account === null || account === undefined || library === undefined) {
      return;
    }
    const signer = getSigner(library, account);
    try {
      const receipt = await TOSStaker.connect(signer).claim();
      store.dispatch(setTxPending({tx: true}));
      if (receipt) {
        toastWithReceipt(receipt, setTxPending, 'Launch');
        await receipt.wait();
      }
    } catch (e) {
      console.log(e);
      
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

  useEffect(() => {
    async function getLPToken() {
      if (account === null || account === undefined || library === undefined) {
        return;
      }
      const now = moment().unix();
      const signer = getSigner(library, account);
      const currentRound = await TOSStaker.connect(signer).currentRound();
      const nowClaimRound = await TOSStaker.connect(signer).nowClaimRound();
      const amount = await TOSStaker.connect(signer).calculClaimAmount(
        currentRound,
      );
      const totalClaimCount = await TOSStaker.connect(
        signer,
      ).totalClaimCounts();

      setDistributeDisable(Number(nowClaimRound) >= Number(currentRound));
      const disabled = Number(nowClaimRound) >= Number(currentRound);
      const claimDate =
        Number(currentRound) === Number(totalClaimCount)
          ? await TOSStaker.connect(signer).claimTimes(Number(currentRound) - 1)
          : await TOSStaker.connect(signer).claimTimes(currentRound);
      const amountFormatted = parseInt(ethers.utils.formatEther(amount));

      setShowDate(amountFormatted === 0 && Number(claimDate) > now);
      setDistributable(amountFormatted);
      setDistributeDisable(disabled);
      setClaimTime(claimDate);
    }
    getLPToken();
  }, [account, library, transactionType, blockNumber]);

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
      light: '#2a72e5',
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
      <Grid templateColumns="repeat(2, 1fr)" w={'100%'} mb={'30px'}>
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
              <Text letterSpacing={'1.3px'} fontSize={'13px'} mr={'5px'}>
                {commafy(Number(vault.vaultTokenAllocation))}{' '}
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
              w={'66px'}
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
              w={'81px'}
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
              Distribute
            </Text>
          </GridItem>
          <GridItem
            border={themeDesign.border[colorMode]}
            borderBottom={'none'}
            className={'chart-cell'}
            fontFamily={theme.fonts.fld}>
            <Flex alignItems={'baseline'} fontWeight={'bold'}>
              {' '}
              <Text
                mr={'3px'}
                fontSize={'20px'}
                color={colorMode === 'light' ? '#353c48' : 'white.0'}>
                {distributable.toLocaleString()}
              </Text>{' '}
              <Text
                color={colorMode === 'light' ? '#7e8993' : '#9d9ea5'}
                fontSize={'13px'}>
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
              onClick={() => distribute()}>
              Distribute
            </Button>
          </GridItem>
          <GridItem
            border={themeDesign.border[colorMode]}
            className={'chart-cell'}
            fontFamily={theme.fonts.fld}
            borderBottomRightRadius={'4px'}>
            {showDate === true ? (
              <>
                <Flex flexDir={'column'}>
                  <Text color={colorMode === 'light' ? '#9d9ea5' : '#7e8993'}>
                    You can distribute on
                  </Text>
                  <Text color={colorMode === 'light' ? '#353c48' : 'white.0'}>
                    {moment.unix(claimTime).format('MMM, DD, yyyy HH:mm:ss')}{' '}
                    {momentTZ.tz(momentTZ.tz.guess()).zoneAbbr()}
                  </Text>
                </Flex>
              </>
            ) : (
              <></>
            )}
          </GridItem>
        </Flex>
      </Grid>
      {vault.isDeployed ? (
        <PublicPageTable claim={vault.claim} />
      ) : (
        <Flex
          justifyContent={'center'}
          width={'100%'}
          mt={'50px'}
          color={colorMode === 'light' ? '#9d9ea5' : '#7e8993'}
          fontFamily={theme.fonts.fld}>
          There are no claim round values
        </Flex>
      )}
    </Flex>
  );
};