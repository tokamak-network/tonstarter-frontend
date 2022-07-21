import {useEffect, useMemo, useState, Dispatch, SetStateAction} from 'react';
import {
  Flex,
  Text,
  Button,
  Link,
  useTheme,
  useColorMode,
  IconButton,
  Grid,
  GridItem,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  Select,
  DrawerOverlay,
  Image,
Tooltip,
  DrawerContent,
  DrawerCloseButton,
} from '@chakra-ui/react';
import {HamburgerIcon, CloseIcon} from '@chakra-ui/icons';
import {LoadingComponent} from 'components/Loading';
import {useDispatch} from 'react-redux';
import moment from 'moment';
import useAirdropList from '@Dao/hooks/useAirdropList';
import commafy from 'utils/commafy';
import {useDisclosure} from '@chakra-ui/react';
import {useAppSelector} from 'hooks/useRedux';
import {selectModalType} from 'store/modal.reducer';
import {useModal} from 'hooks/useModal';
import {useActiveWeb3React} from 'hooks/useWeb3';
import {CloseButton} from 'components/Modal';
import {CustomInput, CustomSelectBox} from 'components/Basic';
import AdminActions from '@Admin/actions';
import {useBlockNumber} from 'hooks/useBlock';
import {DEPLOYED} from 'constants/index';
import {useERC20Token} from 'hooks/useERC20Token';
import {selectTransactionType} from 'store/refetch.reducer';
import tooltipIcon from 'assets/svgs/input_question_icon.svg';
import {MobileDistributeTable} from './MobileDistributeTable';

export const MobileAirDropDistributeTable = () => {
  const {colorMode} = useColorMode();
  const theme = useTheme();
  const dispatch = useDispatch();
  const {isOpen, onOpen, onClose} = useDisclosure();
  const [isLabelOpen, setIsLabelOpen] = useState(false)

  const [distributedTosTokens, setDistributedTosTokens] = useState<
    any[] | undefined
  >(undefined);
  const {TON_ADDRESS, WTON_ADDRESS, TOS_ADDRESS, DOC_ADDRESS, tokens} =
    DEPLOYED;
  const {data} = useAppSelector(selectModalType);
  const [loadingData, setLoadingData] = useState<boolean>(true);
  const {airdropList} = useAirdropList();
  const {account, library} = useActiveWeb3React();
  const {btnStyle} = theme;
  const [tokenAddress, setTokenAddress] = useState<string>(TON_ADDRESS);
  const [distributeToValue, setDistributeToValue] =
    useState<string>('TON Holder');
  const [tokenAmount, setTokenAmount] = useState('');
  const [allowance, setAllowance] = useState<string>('');
  const [ableDistribute, setAbleDistribute] = useState<boolean>(false);
  const [timeStamp, setTimeStamp] = useState<string>('');
  const [isRay, setIsRay] = useState<boolean>(false);
  const {transactionType, blockNumber} = useAppSelector(selectTransactionType);
  const [isApproveDisable, setIsApproveDisable] = useState<boolean>(true);
  const [empty, setEmpty] = useState(false);
  useEffect(() => {
    if (airdropList) return setDistributedTosTokens(airdropList);
  }, [airdropList]);

  useEffect(() => {
    if (distributedTosTokens) {
      const isEmpty = distributedTosTokens.every((token:any) => {
        return token.amount === '0.00'
      })
     setEmpty(isEmpty)
      
      setLoadingData(false);
    }
  }, [distributedTosTokens]);

  useEffect(() => {
    //GET NEXT THUR
    const dayINeed = 4; // for Thursday
    const today = moment().isoWeekday();
    const thisWed = moment().isoWeekday(dayINeed).format('YYYY-MM-DD');
    const nextWed = moment().add(1, 'weeks').isoWeekday(dayINeed).format('LL');

    if (today === dayINeed || today < dayINeed) {
      return setTimeStamp(thisWed);
    } else {
      return setTimeStamp(nextWed);
    }
  }, []);
  useEffect(() => {
    if (Number(tokenAmount) > 0) {
      setIsApproveDisable(false);
    } else {
      setIsApproveDisable(true);
    }
  }, [tokenAmount, transactionType, blockNumber]);

  useEffect(() => {
    setIsRay(tokenAddress === WTON_ADDRESS);
  }, [tokenAddress, WTON_ADDRESS]);

  useEffect(() => {
    async function getAllowanceAmount() {
      if (!account) {
        return;
      }
      if (distributeToValue === 'TON Holder') {
        const allowanceAmount = await AdminActions.checkApproveTON({
          account,
          library,
          address: tokenAddress,
          isRay,
        });
        setAllowance(allowanceAmount);
      } else {
        const allowanceAmount = await AdminActions.checkApprove({
          account,
          library,
          address: tokenAddress,
          isRay,
        });
        setAllowance(allowanceAmount);
      }
    }
    if (account && tokenAddress !== '') {
      getAllowanceAmount();
    } else {
      setAllowance('0.00');
    }
  }, [
    account,
    library,
    tokenAddress,
    isRay,
    distributeToValue,
    transactionType,
    blockNumber,
  ]);

  useEffect(() => {
    if (tokenAmount === '') {
      return setAbleDistribute(false);
    }
    if (
      Number(allowance.replaceAll(',', '')) > 0 &&
      Number(allowance.replaceAll(',', '')) >=
        Number(tokenAmount.replaceAll(',', '')) &&
      Number(tokenAmount.replaceAll(',', '')) > 0
    ) {
      return setAbleDistribute(true);
    } else {
      return setAbleDistribute(false);
    }
  }, [allowance, tokenAmount]);

  useEffect(() => {
    //GET NEXT THUR
    //Which is lock period for sTOS

    const dayINeed = 4; // for Thursday
    const today = moment().isoWeekday();
    const thisWed = moment().isoWeekday(dayINeed).format('YYYY-MM-DD');
    const nextWed = moment()
      .add(1, 'weeks')
      .isoWeekday(dayINeed)
      .format('YYYY-MM-DD');
    if (today === dayINeed || today < dayINeed) {
      return setTimeStamp(thisWed);
    } else {
      return setTimeStamp(nextWed);
    }
  }, []);

  const selectOptionValues = [
    TON_ADDRESS,
    WTON_ADDRESS,
    TOS_ADDRESS,
    DOC_ADDRESS,
    tokens.AURA_ADDRESS,
    tokens.LYDA_ADDRESS,
    'CUSTOM TOKEN',
  ];
  const selectDistributeOptionValues = [
    'TON Holder',
    // 'TOS Holder',
    'sTOS Holder',
  ];
  const selectOptionNames = [
    'TON',
    'WTON',
    'TOS',
    'DOC',
    'AURA',
    'LYDA',
    'CUSTOM TOKEN',
  ];

  useEffect(() => {
    if (tokenAddress === 'CUSTOM TOKEN') return setTokenAddress('');
  }, [tokenAddress]);

  const {tokenBalance, tokenSymbol} = useERC20Token({
    tokenAddress: tokenAddress,
    isRay: tokenAddress === WTON_ADDRESS,
  });
  const [isTokenBalanceExceed, setIsTokenBalanceExceed] =
    useState<boolean>(true);

  useEffect(() => {
    const checkedTokenBalanceExceed =
      Number(tokenAmount.replaceAll(',', '')) >
      Number(tokenBalance.replaceAll(',', ''));
    return setIsTokenBalanceExceed(checkedTokenBalanceExceed);
  }, [tokenAmount, tokenBalance]);

  const distributeAction = () => {
    if (!account) {
      return;
    }
    if (distributeToValue !== 'TON Holder') {
      AdminActions.distributeTOS({
        account,
        library,
        amount: tokenAmount,
        address: tokenAddress,
        isRay: WTON_ADDRESS === tokenAddress,
      });
    } else if (distributeToValue === 'TON Holder') {
      AdminActions.distributeTON({
        account,
        library,
        amount: tokenAmount,
        address: tokenAddress,
        isRay: WTON_ADDRESS === tokenAddress,
      });
    }
  };

  const approveAction = () => {
    if (!account) {
      return;
    }
    if (distributeToValue === 'TON Holder') {
      AdminActions.getERC20ApproveTON({
        account,
        library,
        amount: tokenAmount,
        address: tokenAddress,
        isRay: WTON_ADDRESS === tokenAddress,
      });
    } else if (distributeToValue !== 'TON Holder') {
      AdminActions.getERC20ApproveTOS({
        account,
        library,
        amount: tokenAmount,
        address: tokenAddress,
        isRay: WTON_ADDRESS === tokenAddress,
      });
    }
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
    scheduleColor: {
      light: '#808992',
      dark: '#9d9ea5',
    },
    dateColor: {
      light: '#353c48',
      dark: '#f3f4f1',
    },
  };
  console.log(distributedTosTokens);

  return loadingData ? (
    <Flex
      alignItems={'center'}
      mt={'50px'}
      justifyContent={'center'}
      w={'100%'}>
      <LoadingComponent />
    </Flex>
  ) : (
    <Flex flexDir={'column'}>
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
          // _hover={{background: 'transparent'}}
          onClick={onOpen}>
          Distribute
        </Button>
        <Drawer placement={'bottom'} onClose={onClose} isOpen={isOpen}>
          <DrawerOverlay />
          <DrawerContent
            h={'601px'}
            borderTopRadius={'10px'}
            borderTop={colorMode === 'light' ? 'none' : '1px solid #363636'}
            bg={colorMode === 'dark' ? '#222222' : '#ffffff'}>
            <DrawerHeader p={'0px'}>
              <Flex
                mx={'20px'}
                h={'71px'}
                borderBottomWidth="1px"
                alignItems={'center'}
                justifyContent="space-between">
                <Text fontFamily={theme.fonts.fld} fontSize={'20px'}>
                  Airdrop Distribution
                </Text>
                <IconButton
                  onClick={onClose}
                  aria-label={`Close Navigation`}
                  ml={'27px'}
                  bg={'transparent'}
                  icon={<CloseIcon h={4} w={4} />}
                  _focus={{bg: 'transparent'}}
                  _active={{bg: 'transparent'}}
                />
              </Flex>
            </DrawerHeader>
            <DrawerBody p={'30px'}>
              <Flex flexDir={'column'} fontFamily={theme.fonts.roboto}>
                <Text
                  fontSize={'13px'}
                  mb={'9px'}
                  color={colorMode === 'light' ? '#304156' : '#ffffff'}>
                  Distribute To
                </Text>
                <Select
                  h="32px"
                  fontSize={'12px'}
                  mb={'24px'}
                  onChange={(e) => {
                    setDistributeToValue(e.target.value);
                  }}>
                  {selectDistributeOptionValues.map(
                    (value: any, index: number) => {
                      return <option>{value}</option>;
                    },
                  )}
                </Select>
                <Flex justifyContent={'space-between'}>
                  <Text
                    fontSize={'13px'}
                    mb={'9px'}
                    color={colorMode === 'light' ? '#304156' : '#ffffff'}>
                    Token Address
                  </Text>
                  <Flex>
                    <Text
                      fontSize={'13px'}
                      mr={'2px'}
                      mb={'9px'}
                      color={colorMode === 'light' ? '#7e8993' : '#949494'}>
                      Balance:
                    </Text>
                    <Text
                      fontSize={'13px'}
                      mb={'9px'}
                      color={colorMode === 'light' ? '#304156' : '#ffffff'}>
                      {tokenBalance} {tokenSymbol}
                    </Text>
                  </Flex>
                </Flex>
                <Select
                  h="32px"
                  fontSize={'12px'}
                  mb={'24px'}
                  onChange={(e) => {
                    setTokenAddress(e.target.value);
                  }}>
                  {selectOptionValues.map((value: any, index: number) => {
                    return (
                      <option value={value}>{selectOptionNames[index]}</option>
                    );
                  })}
                </Select>
                <Text
                  fontSize={'13px'}
                  mb={'9px'}
                  color={colorMode === 'light' ? '#304156' : '#ffffff'}>
                  Token Amount
                </Text>
                <Flex mb={'24px'} w={'100%'} flexDir='column'>
                  <CustomInput
                    w={'100%'}
                    h={'32px'}
                    border={'1px solid #dfe4ee'}
                    style={{
                      fontSize: '12px',
                      textAlign: 'left',
                      border: '1px solid #dfe4ee',
                    }}
                    value={tokenAmount}
                    setValue={setTokenAmount}
                    placeHolder={'0.00'}
                    fontWeight={500}
                    numberOnly={true}
                    error={isTokenBalanceExceed}
                    color={
                      tokenAmount !== ''
                        ? colorMode === 'light'
                          ? 'gray.225'
                          : 'white.100'
                        : 'gray.175'
                    }></CustomInput>
                  {isTokenBalanceExceed && (
                    <Text color={'red.100'} mt='3px' fontSize='11px'>You don't have enough balance</Text>
                  )}
                </Flex>

                <Text
                  fontSize={'13px'}
                  mb={'9px'}
                  color={colorMode === 'light' ? '#304156' : '#ffffff'}>
                  Token Allowance Amount
                </Text>

                <Flex
                  w={'100%'}
                  h={'32px'}
                  pl={'15px'}
                  fontWeight={500}
                  fontFamily={theme.fonts.roboto}
                  borderRadius={'4px'}
                  mb={'24px'}
                  alignItems="center"
                  fontSize={'12px'}
                  border={
                    colorMode === 'light'
                      ? '1px solid rgba(223, 228, 238, 0.6)'
                      : '1px solid #424242'
                  }
                  color={colorMode === 'light' ? '#3e495c' : '#f3f4f1'}>
                  {allowance}
                </Flex>
                {/* <CustomInput
                    w={'100%'}
                    h={'32px'}
                    border={'1px solid #dfe4ee'}
                    style={{
                      fontSize: '12px',
                      textAlign: 'left',
                      border: '1px solid #dfe4ee',
                    }}
                    value={allowance}
                    placeHolder={'0.00'}
                    fontWeight={500}
                    color={
                      allowance !== ''
                        ? colorMode === 'light'
                          ? 'gray.225'
                          : 'white.100'
                        : 'gray.175'
                    }></CustomInput> */}

                {distributeToValue !== 'TON Holder' && (
                  <Flex flexDir={'column'}>
                    <Text
                      fontSize={'13px'}
                      mb={'9px'}
                      color={colorMode === 'light' ? '#304156' : '#ffffff'}>
                      Distribution Timestamp
                    </Text>
                    <Flex mb={'24px'} w={'100%'}>
                      <Flex
                        w={'100%'}
                        h={'32px'}
                        pl={'15px'}
                        fontWeight={500}
                        fontFamily={theme.fonts.roboto}
                        borderRadius={'4px'}
                        alignItems="center"
                        fontSize={'12px'}
                        border={
                          colorMode === 'light'
                            ? '1px solid rgba(223, 228, 238, 0.6)'
                            : '1px solid #424242'
                        }
                        color={
                          colorMode === 'light' ? '#3e495c' : '#f3f4f1'
                        }>{`${timeStamp} 00:00:00 UTC`}</Flex>
                      {/* <CustomInput
                        w={'100%'}
                        h={'32px'}
                        border={'1px solid #dfe4ee'}
                        style={{
                          fontSize: '12px',
                          textAlign: 'left',
                          border: '1px solid #dfe4ee',
                        }}
                        value={`${timeStamp} 00:00:00 UTC`}
                        placeHolder={'0.00'}
                        fontWeight={500}
                        color={
                          timeStamp !== ''
                            ? colorMode === 'light'
                              ? 'gray.225'
                              : 'white.100'
                            : 'gray.175'
                        }></CustomInput> */}
                    </Flex>
                  </Flex>
                )}

                <Flex justifyContent={'space-between'}>
                  <Button
                    {...btnStyle.btnAble()}
                    w={'150px'}
                    h={'38px'}
                    fontSize="14px"
                  
                    disabled={isApproveDisable}
                    onClick={approveAction}>
                    Approve
                  </Button>
                  <Button
                    {...(!ableDistribute
                      ? {...btnStyle.btnDisable({colorMode})}
                      : {...btnStyle.btnAble()})}
                    w={'150px'}
                    fontSize="14px"
                    h={'38px'}
                 
                    isDisabled={!ableDistribute || isTokenBalanceExceed}
                    onClick={() => {
                      distributeAction();
                      onClose();
                    }}>
                    Distribute
                  </Button>
                </Flex>
              </Flex>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </Flex>
      <Flex
        mt={'12px'}
        fontFamily={theme.fonts.fld}
        flexDir='column'
        justifyContent="center"
        alignItems={'center'}
        fontSize={'13px'}>
          <Flex alignItems={'center'}> <Text color={colorMode === 'light' ? '#7e8993' : '#9d9ea5'} mr={'2px'}>
        sTOS Holder distribution schedule
        </Text>
        <Tooltip
        isOpen={isLabelOpen}
      
              hasArrow
              placement="top"
              label="sTOS Holder distributions follow the schedule displayed, whereas TON Holder distributions happen immediately."
              color={theme.colors.white[100]}
              bg={theme.colors.gray[375]}>
              <Image   h={'14px'}  w={'14px'} src={tooltipIcon}   onClick={() => setIsLabelOpen(!isLabelOpen)}/>
            </Tooltip></Flex>
       
        <Text color={colorMode === 'light' ? '#353c48' : '#f3f4f1'}>
          {' '}
          Next(Thu.) {timeStamp} 00:00:00 (UTC)
        </Text>
      </Flex>
      {distributedTosTokens !== undefined &&
      distributedTosTokens.length === 0 || empty? (
        <Flex
          justifyContent={'center'}
          alignItems={'center'}
          w={'100%'}
          mt={'20px'}
         h={'100px'}
         borderRadius='10px'
          fontFamily={theme.fonts.fld}
          fontSize={'16px'}
          border={themeDesign.border[colorMode]}>
          <Text>No distributions scheduled this round.</Text>
        </Flex>
      ) : (
        <MobileDistributeTable
          distributedTosTokens={distributedTosTokens}
          airdropList={airdropList}
        />
      )}
    </Flex>
  );
};
