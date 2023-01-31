import {FC, useEffect, useState, Dispatch, SetStateAction} from 'react';
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
import {DEPLOYED} from 'constants/index';
import * as ERC20 from 'services/abis/erc20ABI(SYMBOL).json';
import * as PublicSaleLogic from 'services/abis/PublicSaleLogic.json';
import * as VestingPublicFund from 'services/abis/VestingPublicFund.json';
import { color } from 'd3';
const {TOS_ADDRESS, UniswapV3Factory, NPM_Address} = DEPLOYED;

const provider = BASE_PROVIDER;
type Vesting = {vault: any; project: any; setVaultInfo: Function};

export const Vesting: FC<Vesting> = ({vault, project, setVaultInfo}) => {
  const {colorMode} = useColorMode();
  const theme = useTheme();
  const {account, library} = useActiveWeb3React();
  const [distributable, setDistributable] = useState<number>(0);
  const [claimTime, setClaimTime] = useState<number>(0);
  const {transactionType, blockNumber} = useAppSelector(selectTransactionType);
  const [distributeDisable, setDistributeDisable] = useState<boolean>(true);
  //   const vaultC = new Contract(vault.vaultAddress, VaultCLogicAbi.abi, library);
  const [claimAddress, setClaimAddress] = useState<string>('');
  const [showDate, setShowDate] = useState<boolean>(false);
  const network = BASE_PROVIDER._network.name;
  const [completedRounds, setCompletedRounds] = useState(0);
  const [accTotal, setAccTotal] = useState(0);
  const [accRound, setAccRound] = useState(0);
  const [initialized, setInitialized] = useState(false);
  const [funds, setFunds] = useState(0);
  const [totalRounds, setTotalRounds] = useState(0);
  const [currentClaimAmount, setCurrentClaimAmount] = useState(0);
const [currentRnd, setCurrentRnd] = useState(0)
const [claimDisabled, setclaimDisabled] = useState(true)
  useEffect(() => {
    async function getInfo() {
      if (account === null || account === undefined || library === undefined) {
        return;
      }
      const signer = getSigner(library, account);
      const publicSaleLogic = new Contract(
        project.vaults[0].vaultAddress,
        PublicSaleLogic.abi,
        library,
      );
      const vestingVault = new Contract(
        vault.vaultAddress,
        VestingPublicFund.abi,
        library,
      );
      const isExchangeTOS = await publicSaleLogic.exchangeTOS();
      const isCurrentSqrtPrice = await vestingVault.currentSqrtPriceX96();
      setFunds(Number(isCurrentSqrtPrice));
      // setInitialized(isExchangeTOS)
      setInitialized(true);

      const currentRound = await vestingVault.currentRound(); //now round
      const nowClaimRound = await vestingVault.nowClaimRound(); //now claim round
      const totalClaimCounts = await vestingVault.totalClaimCounts(); // total rounds
      const totalClaimsAmount = await vestingVault.totalClaimsAmount(); //unit
      const totalAllocatedAmount = await vestingVault.totalAllocatedAmount(); //unit
      const calculClaimAmount = await vestingVault.calculClaimAmount(
        currentRound,
      ); //claim amount of current round

      const disabled = Number(currentRound) > 0 && Number(calculClaimAmount) === 0 || Number(isCurrentSqrtPrice) ===0
      setclaimDisabled(disabled)
      
      setAccTotal(Number(totalAllocatedAmount));
      setAccRound(Number(totalClaimsAmount));
      setCompletedRounds(
        Number(nowClaimRound) === 0 ? 0 : Number(nowClaimRound) - 1,
      );
      setTotalRounds(Number(totalClaimCounts));
      setCurrentClaimAmount(Number(calculClaimAmount));
      setCurrentRnd(Number(currentRound))
    }
    getInfo();
  }, [account, project, vault, library, transactionType, blockNumber]);

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
                <Text mr={'5px'}>
                  {Number(vault.vaultTokenAllocation).toLocaleString()}
                  {` `}
                  {project.tokenSymbol}
                </Text>
                <Text
                  letterSpacing={'1.3px'}
                  fontSize={'13px'}
                  color={'#7e8993'}>
                  {(
                    (vault.vaultTokenAllocation /
                      project.totalTokenAllocation) *
                    100
                  )
                    .toString()
                    .match(/^\d+(?:\.\d{0,2})?/)}
                  %
                </Text>
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
              Claim
            </Text>
            {!initialized ? (
              <Text fontSize={'11px'} w="260px">
                To initiate a vesting round, please go to{' '}
                <span
                  style={{
                    color: '#257eee',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                  }}
                  onClick={() => setVaultInfo(project.vaults[0], 0)}>
                  Public Vault
                </span>{' '}
                and send funds to the initial liquidity vault
              </Text>
            ) : funds !== 0 ? (
              <Flex>
                <Text fontSize={'11px'} w="260px">
                  Funds was sent to the initial liquidity vault, but You need to
                  push set price button in{' '}
                  <span
                    style={{
                      color: '#257eee',
                      textDecoration: 'underline',
                      cursor: 'pointer',
                    }}
                    onClick={() => setVaultInfo(project.vaults[1], 1)}>
                    Initial Liquidity Vault{' '}
                  </span>
                </Text>
              </Flex>
            ) : (
              <Flex flexDir={'column'} fontSize={'14px'}>
                <Flex justifyContent="flex-end">
                  <Text>{completedRounds} Rounds Completed</Text>
                  <Text
                    ml="3px"
                    color={colorMode === 'light' ? '#7e8993' : '#9d9ea5'}>
                    [Total {totalRounds}]
                  </Text>
                </Flex>
                <Flex justifyContent="flex-end">
                  <Text>{`${accRound.toLocaleString()} TON / ${accTotal.toLocaleString()} TON`}</Text>
                  <Text
                    ml="3px"
                    color={colorMode === 'light' ? '#7e8993' : '#9d9ea5'}>
                    {accRound === 0 || accTotal === 0
                      ? 0
                      : ((accRound / accTotal) * 100).toLocaleString()}
                    % claimed
                  </Text>
                </Flex>
              </Flex>
            )}
          </GridItem>
          <GridItem
            border={themeDesign.border[colorMode]}
            borderBottom={'none'}
            className={'chart-cell'}
            fontFamily={theme.fonts.fld}>
            <Text
              fontSize={'13px'}
              w={'156px'}
              color={colorMode === 'light' ? '#7e8993' : '#9d9ea5'}>
              {' '}
              Current vesting round
            </Text>
            <Flex>
              <Flex flexDir={'column'} mr='25px'>
                <Text fontSize={'16px'} color={colorMode==='light'?"#353c48":"#ffffff"} lineHeight='15px'>
                  {currentClaimAmount.toLocaleString()}
                  <span style={{fontSize:'12px', color:colorMode==='light'?'7e8993':'#9d9ea5'}}> TON</span>
                </Text>
                <Text fontSize={'11px'} color={colorMode==='light'?'#7e8993' :'#9d9ea5'}>{`(Round ${currentRnd})`}</Text>
              </Flex>
              <Button
                w={'100px'}
                h={'32px'}
                bg={'#257eee'}
                color={'#ffffff'}
                disabled={claimDisabled}
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
                // onClick={()=>{}}
                >
                Claim
              </Button>
            </Flex>
          </GridItem>

          <GridItem
            border={themeDesign.border[colorMode]}
            className={'chart-cell'}
            fontFamily={theme.fonts.fld}
            borderBottomRightRadius={'4px'}>
            <Text
              fontSize={'13px'}
              w={'156px'}
              color={colorMode === 'light' ? '#7e8993' : '#9d9ea5'}>
              Address for Receiving Funds from the Vesting Vault
            </Text>
            <Link
              isExternal
              href={
                project.vaults[0].addressForReceiving && network === 'goerli'
                  ? `https://goerli.etherscan.io/address/${project.vaults[0].addressForReceiving}`
                  : vault.adminAddress && network !== 'goerli'
                  ? `https://etherscan.io/address/${project.vaults[0].addressForReceiving}`
                  : ''
              }
              color={colorMode === 'light' ? '#353c48' : '#9d9ea5'}
              _hover={{color: '#2a72e5'}}
              fontFamily={theme.fonts.fld}>
              {project.vaults[0].addressForReceiving
                ? shortenAddress(project.vaults[0].addressForReceiving)
                : 'NA'}
            </Link>
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
