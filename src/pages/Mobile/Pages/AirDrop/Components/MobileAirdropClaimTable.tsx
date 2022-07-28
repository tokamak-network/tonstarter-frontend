import {useEffect, useMemo, useState, Dispatch, SetStateAction} from 'react';
import {
  Flex,
  Text,
  Button,
  Link,
  useTheme,
  useColorMode,
  Select,
  Grid,
  GridItem,
} from '@chakra-ui/react';
import {useActiveWeb3React} from 'hooks/useWeb3';
import {useAppSelector} from 'hooks/useRedux';
import {selectTransactionType} from 'store/refetch.reducer';
import {DEPLOYED} from 'constants/index';
import {Contract} from '@ethersproject/contracts';
import * as LockTOSDividendABI from 'services/abis/LockTOSDividend.json';
import * as ERC20 from 'services/abis/erc20ABI(SYMBOL).json';
import {fetchAirdropPayload} from 'components/Airdrop/utils/fetchAirdropPayload';
import * as TOKENDIVIDENDPOOLPROXY from 'services/abis/TokenDividendProxyPool.json';
import {ethers} from 'ethers';
import AdminActions from '@Admin/actions';
import {getClaimalbeList} from '@Dao/actions';
import {convertNumber} from 'utils/number';
import {LoadingComponent} from 'components/Loading';
import {MobileGenesisTable} from './MobileGenesisTable';
import {MobileDAOTable} from './MobileDAOTable';
import {MobileTONTable} from './MobileTONTable';
import {claimAirdrop} from 'components/Airdrop/actions';
type Round = {
  allocatedAmount: string;
  amount: string;
  roundNumber: number;
  myAmount: string;
};
type AirDropList = [Round] | undefined;

export const MobileAirdropClaimTable = () => {
  const {colorMode} = useColorMode();
  const theme = useTheme();
  const {account, library} = useActiveWeb3React();
  const [isCheckAll, setIsCheckAll] = useState<boolean>(false);
  const [loadingData, setLoadingData] = useState<boolean>(true);
  const [isCheck, setIsCheck] = useState<any[]>([]);
  const [checkedAllBoxes, setCheckedAllBoxes] = useState<boolean>(false);
  const [airdropData, setAirdropData] = useState<any[]>([]);
  const [checkedTokenAddresses, setCheckedTokenAddresses] = useState<any[]>([]);
  const [radioValue, setRadioValue] = useState<string>('Genesis Airdrop');
  const {transactionType, blockNumber} = useAppSelector(selectTransactionType);
  const [tonStakerAirdropTokens, setTonStakerAirdropTokens] = useState<any[]>(
    [],
  );
  const [daoAirdropTokens, setDaoAirdropTokens] = useState<any[]>([]);

  const [genesisAirdropBalance, setGenesisAirdropBalance] = useState<
    string | undefined
  >('');
  const {LockTOSDividend_ADDRESS, TokenDividendProxyPool_ADDRESS} = DEPLOYED;

  const LOCKTOS_DIVIDEND_CONTRACT = new Contract(
    LockTOSDividend_ADDRESS,
    LockTOSDividendABI.abi,
    library,
  );

  const TOKEN_DIVIDEND_PROXY_POOL_CONTRACT = new Contract(
    TokenDividendProxyPool_ADDRESS,
    TOKENDIVIDENDPOOLPROXY.abi,
    library,
  );

  useEffect(() => {
    async function getClaimableAirdropTonAmounts() {
      if (account === undefined || account === null) {
        return;
      }
      const tonRes =
        await TOKEN_DIVIDEND_PROXY_POOL_CONTRACT.getAvailableClaims(account);

      const claimList = await getClaimalbeList({account, library});

      if (tonRes === undefined && claimList === undefined) {
        return;
      }

      const {claimableAmounts, claimableTokens} = tonRes;

      let claimableArr: any[] = [];
      let tempTonStakerArr: any[] = [];
      let tempDaoAirdropArr: any[] = [];

      if (claimableAmounts.length > 0 && claimableTokens) {
        await Promise.all(
          claimableTokens.map(async (tokenAddress: string, idx: number) => {
            const ERC20_CONTRACT = new Contract(
              tokenAddress,
              ERC20.abi,
              library,
            );
            let tokenSymbol = await ERC20_CONTRACT.symbol();
            claimableArr.push({
              address: tokenAddress,
              amount: claimableAmounts[idx],
              tokenSymbol: tokenSymbol,
              id: idx,
              tonStaker: true,
            });
          }),
        );
      }
      if (claimList) {
        if (claimList?.length > 0) {
          await Promise.all(
            claimList?.map((token: any, idx: number) => {
              claimableArr.push({
                address: token?.tokenAddress,
                amount: token?.claimAmount,
                tokenSymbol: token?.tokenName,
                id: idx,
                tosStaker: true,
              });
            }),
          );
        }
      }
      if (claimableArr.length > 0) {
        // Push to Ton Staker arr
        await Promise.all(
          claimableArr.map((token: any) => {
            if (token.tonStaker === true && token.amount !== '0.00') {
              tempTonStakerArr.push(token);
            }
          }),
        );

        // Push to DAO airdrop arr
        await Promise.all(
          claimableArr.map((token: any) => {
            if (token.tosStaker === true && token.amount !== '0.00') {
              tempDaoAirdropArr.push(token);
            }
          }),
        );
      }

      const sortedTonStakerArr = tempTonStakerArr.sort((a, b) => a.id - b.id);
      const sortedDaoAirdropArr = tempDaoAirdropArr.sort((a, b) => a.id - b.id);

      setTonStakerAirdropTokens(
        sortedTonStakerArr.filter((tonStakerData) => {
          if (
            convertNumber({amount: tonStakerData.amount.toString()}) !== '0.00'
          ) {
            return tonStakerData;
          }
        }),
      );
      setDaoAirdropTokens(
        sortedDaoAirdropArr.filter((daoAirdropData) => {
          if (daoAirdropData.amount !== '0.00') {
            return daoAirdropData;
          }
        }),
      );

      let filteredAirdropData = claimableArr.filter(
        (data) => data.amount !== '0.00',
      );
      const sortedArr = filteredAirdropData.sort((a, b) => a.id - b.id);
      setLoadingData(false);
      setAirdropData(sortedArr);
    }
    if (account !== undefined && library !== undefined) {
      getClaimableAirdropTonAmounts();
    }
    /*eslint-disable*/
  }, [account, transactionType, blockNumber]);

  const availableGenesisAmount = (
    roundInfo: AirDropList,
    claimedAmount: string | undefined,
    unclaimedAmount: string | undefined,
  ) => {
    if (roundInfo !== undefined && claimedAmount !== undefined) {
      setGenesisAirdropBalance(unclaimedAmount);
    }
  };

  useEffect(() => {
    async function callAirDropData() {
      if (account === undefined || account === null) {
        return;
      }
      const res = await fetchAirdropPayload(account, library);
      if (res === undefined) {
        return;
      }
      const {roundInfo, claimedAmount, unclaimedAmount} = res;
      availableGenesisAmount(roundInfo, claimedAmount, unclaimedAmount);
    }
    if (account !== undefined && library !== undefined) {
      callAirDropData();
    }
    /*eslint-disable*/
  }, [account, transactionType, blockNumber]);
  const handleSelectAll = () => {
    setIsCheckAll(!isCheckAll);
    setCheckedAllBoxes(!checkedAllBoxes);

    if (radioValue === 'TON Staker') {
      setIsCheck(tonStakerAirdropTokens.map((data) => String(data.id)));
      setCheckedTokenAddresses(
        tonStakerAirdropTokens.map((data) => data.address),
      );
    } else if (radioValue === 'DAO Airdrop') {
      setIsCheck(daoAirdropTokens.map((data) => String(data.id)));
      setCheckedTokenAddresses(daoAirdropTokens.map((data) => data.address));
    } else if (radioValue === 'Genesis Airdrop') {
      setIsCheck(['Genesis']);
      setCheckedTokenAddresses(['Genesis']);
    }
    if (isCheckAll) {
      setIsCheck([]);
      setCheckedTokenAddresses([]);
    }
  };

  const handleClick = (e: any) => {
    const {id, checked, value} = e.target;
    let tempCheckedAddresses = checkedTokenAddresses;
    setIsCheck([...isCheck, id]);
    if (!checked) {
      setIsCheck(isCheck.filter((item) => item !== id));
    }
    if (!checkedTokenAddresses.includes(value)) {
      tempCheckedAddresses.push(value);
    } else if (checkedTokenAddresses.includes(value)) {
      tempCheckedAddresses = tempCheckedAddresses.filter(
        (address) => address !== value,
      );
    }
    setCheckedTokenAddresses(tempCheckedAddresses);
  };
  const themeDesign = {
    fontColorTitle: {
      light: 'gray.250',
      dark: 'white.100',
    },
    bg: {
      light: '#fff',
      dark: '#222',
    },
    border: {
      light: 'solid 1px #e6eaee',
      dark: 'solid 1px #373737',
    },
    font: {
      light: '#304156',
      dark: '#fff',
    },
    tosFont: {
      light: '#2a72e5',
      dark: '#2a72e5',
    },
    borderTos: {
      light: 'solid 1px #2a72e5',
      dark: 'solid 1px #2a72e5',
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

  return loadingData || !airdropData ? (
    <Flex
      alignItems={'center'}
      mt={'50px'}
      justifyContent={'center'}
      w={'100%'}>
      <LoadingComponent />
    </Flex>
  ) : (
    <Flex flexDir="column">
      <Flex w="100%" mt={'20px'} h={'26px'} justifyContent={'space-between'}>
        <Text
          fontFamily={theme.fonts.fld}
          fontSize="16px"
          color={colorMode === 'light' ? '#353c48' : '#ffffff'}>
          Token List
        </Text>
        <Button
          color={themeDesign.tosFont[colorMode]}
          border={themeDesign.borderTos[colorMode]}
          height={'26px'}
          width={'120px'}
          padding={'9px 23px 8px'}
          borderRadius={'4px'}
          fontSize={'13px'}
          fontFamily={theme.fonts.roboto}
          background={'transparent'}
          disabled={checkedTokenAddresses.length < 1}
          // _hover={{background: 'transparent'}}
          onClick={() => {
            account &&
              AdminActions.claimMultipleTokens({
                account,
                library,
                addresses: checkedTokenAddresses,
                type: radioValue,
              });
          }}>
          Claim Selected
        </Button>
      </Flex>
      <Flex alignItems={'center'}>
 <Text fontWeight={'bold'} mr='16px' fontFamily={theme.fonts.fld} color={colorMode ==='light'? '#7e8993':'#9d9ea5'}>From</Text>
      <Select
        w={'100%'}
        mt={'10px'}
        h="32px"
        mb={'10px'}
        fontFamily={theme.fonts.fld}
        fontSize="13px"
        color={colorMode === 'light' ? '#3e495c' : '#ffffff'}
        border={
          colorMode === 'light' ? '1px solid #dfe4ee' : '1px solid #424242'
        }
        onChange={(e) => {
          setRadioValue(e.target.value);
        }}>
        <option value={'DAO Airdrop'}>DAO Airdrop</option>
        <option value={'TON Staker'}>TON Staker</option>
        <option value={'Genesis Airdrop'}>Genesis Airdrop</option>
      </Select>
      </Flex>
     

      {radioValue === 'Genesis Airdrop' ? (
        <MobileGenesisTable
          genesisAirdropBalance={genesisAirdropBalance}
          checkedAllBoxes={checkedAllBoxes}
          handleSelectAll={handleSelectAll}
          isCheck={isCheck}
          claimAirdrop={claimAirdrop}
          handleClick={handleClick}
        />
      ) : radioValue === 'DAO Airdrop' ? (
        <MobileDAOTable
          daoAirdropTokens={daoAirdropTokens}
          isCheck={isCheck}
          checkedAllBoxes={checkedAllBoxes}
          handleSelectAll={handleSelectAll}
          handleClick={handleClick}
          claimToken={AdminActions.claimToken}
          setIsCheck={setIsCheck}
          setCheckedTokenAddresses={setCheckedTokenAddresses}
          setIsCheckAll={setIsCheckAll}
          setCheckedAllBoxes={setCheckedAllBoxes}
        />
      ) : (
        <MobileTONTable
          tonStakerAirdropTokens={tonStakerAirdropTokens}
          isCheck={isCheck}
          checkedAllBoxes={checkedAllBoxes}
          handleSelectAll={handleSelectAll}
          handleClick={handleClick}
          claimToken={AdminActions.claimToken}
          setIsCheck={setIsCheck}
          setCheckedTokenAddresses={setCheckedTokenAddresses}
          setIsCheckAll={setIsCheckAll}
          setCheckedAllBoxes={setCheckedAllBoxes}
        />
      )}
    </Flex>
  );
};
