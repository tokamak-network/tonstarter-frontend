import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  Box,
  Heading,
  Text,
  Button,
  Flex,
  Tooltip,
  Image,
  useTheme,
  useColorMode,
} from '@chakra-ui/react';
import {useEffect, useState} from 'react';
import {useAppSelector} from 'hooks/useRedux';
import {selectModalType} from 'store/modal.reducer';
import {useModal} from 'hooks/useModal';
import {useActiveWeb3React} from 'hooks/useWeb3';
import {CloseButton} from 'components/Modal';
import {CustomInput, CustomSelectBox} from 'components/Basic';
import AdminActions from '@Admin/actions';
import moment from 'moment';
import {useBlockNumber} from 'hooks/useBlock';
import {DEPLOYED} from 'constants/index';
import {useERC20Token} from 'hooks/useERC20Token';
import {selectTransactionType} from 'store/refetch.reducer';
import tooltipIcon from 'assets/svgs/input_question_icon.svg';

export const AirdropDistributeModal = () => {
  const {TON_ADDRESS, WTON_ADDRESS, TOS_ADDRESS, DOC_ADDRESS, tokens} =
    DEPLOYED;
  const {data} = useAppSelector(selectModalType);
  const {colorMode} = useColorMode();
  const theme = useTheme();
  const {account, library} = useActiveWeb3React();
  const {btnStyle} = theme;
  const [tokenAddress, setTokenAddress] = useState<string>(TON_ADDRESS);
  const [distributeToValue, setDistributeToValue] =
    useState<string>('sTOS Holder');
  const [tokenAmount, setTokenAmount] = useState('');
  const [allowance, setAllowance] = useState<string>('');
  const [ableDistribute, setAbleDistribute] = useState<boolean>(false);
  const [timeStamp, setTimeStamp] = useState<string>('');
  const [isRay, setIsRay] = useState<boolean>(false);
  const {transactionType, blockNumber} = useAppSelector(selectTransactionType);

  const {handleCloseModal} = useModal(setTokenAmount);

  const [isApproveDisable, setIsApproveDisable] = useState<boolean>(true);

  useEffect(() => {
    if (Number(tokenAmount) > 0) {
      setIsApproveDisable(false);
    } else {
      setIsApproveDisable(true);
    }
  }, [tokenAmount]);

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
    // 'TON Holder',
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

  return (
    <Modal
      isOpen={data.modal === 'Airdrop_Distribute' ? true : false}
      isCentered
      onClose={() => {
        setTokenAddress(TON_ADDRESS);
        setTokenAmount('');
        setAllowance('');
        handleCloseModal();
      }}>
      <ModalOverlay />
      <ModalContent
        fontFamily={theme.fonts.roboto}
        bg={colorMode === 'light' ? 'white.100' : 'black.200'}
        w="350px"
        pt="25px"
        pb="25px">
        <CloseButton closeFunc={handleCloseModal}></CloseButton>
        <ModalBody p={0}>
          <Box
            pb={'1.250em'}
            borderBottom={
              colorMode === 'light' ? '1px solid #f4f6f8' : '1px solid #373737'
            }>
            <Heading
              fontSize={'1.250em'}
              fontWeight={'bold'}
              fontFamily={theme.fonts.titil}
              color={colorMode === 'light' ? 'gray.250' : 'white.100'}
              textAlign={'center'}>
              Airdrop Distribution
            </Heading>
            <Text color="gray.175" fontSize={'0.750em'} textAlign={'center'}>
              You can manage airdrop tokens
            </Text>
          </Box>

          <Flex
            flexDir="column"
            mt={'30px'}
            pl={'30px'}
            pr={'30px'}
            fontSize={'13px'}
            fontWeight={600}
            color={colorMode === 'light' ? 'black.300' : 'white.100'}>
            <Box d="flex" flexDir="column" mb={'24px'}>
              <Flex alignItems={'center'} mb={'9px'}>
                <Text mr={'7px'}>Distribute To</Text>
                <Tooltip
                  hasArrow
                  placement="top"
                  label="sTOS Holder distributions follow the timestamp displayed, whereas TON Holder distributions happen immediately."
                  color={theme.colors.white[100]}
                  bg={theme.colors.gray[375]}>
                  <Image src={tooltipIcon} />
                </Tooltip>
              </Flex>
              <CustomSelectBox
                w={'290px'}
                h={'32px'}
                list={selectDistributeOptionValues}
                optionName={selectDistributeOptionValues}
                setValue={setDistributeToValue}
                fontSize={'12px'}></CustomSelectBox>
            </Box>
            <Box d="flex" flexDir="column" mb={'24px'}>
              <Flex justifyContent={'space-between'}>
                <Text mb={'9px'}>Token Address</Text>
                <Text mb={'9px'}>
                  Balance : {tokenBalance} {tokenSymbol}
                </Text>
              </Flex>
              <CustomSelectBox
                w={'290px'}
                h={'32px'}
                list={selectOptionValues}
                optionName={selectOptionNames}
                setValue={setTokenAddress}
                fontSize={'12px'}></CustomSelectBox>
              {[
                TON_ADDRESS,
                WTON_ADDRESS,
                TOS_ADDRESS,
                DOC_ADDRESS,
                tokens.AURA_ADDRESS,
                tokens.LYDA_ADDRESS,
              ].indexOf(tokenAddress) === -1 && (
                <CustomInput
                  w={'290px'}
                  h={'32px'}
                  style={{
                    fontSize: '12px',
                    textAlign: 'left',
                    marginTop: '10px',
                  }}
                  value={tokenAddress}
                  setValue={setTokenAddress}
                  placeHolder={'Enter token address'}
                  fontWeight={500}
                  startWithZero={true}
                  color={
                    tokenAddress !== 'CUSTOM TOKEN'
                      ? colorMode === 'light'
                        ? 'gray.225'
                        : 'white.100'
                      : 'gray.175'
                  }></CustomInput>
              )}
            </Box>
            <Box d="flex" flexDir="column" mb={'29px'}>
              <Text mb={'9px'}>Token Amount</Text>
              <CustomInput
                w={'290px'}
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
                color={
                  tokenAmount !== ''
                    ? colorMode === 'light'
                      ? 'gray.225'
                      : 'white.100'
                    : 'gray.175'
                }></CustomInput>
              {isTokenBalanceExceed && (
                <Text color={'red.100'}>You don't have enough balance</Text>
              )}
            </Box>
            <Box d="flex" flexDir="column" mb={'29px'}>
              <Text mb={'9px'}>Token Allowance Amount</Text>
              <CustomInput
                w={'290px'}
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
                }></CustomInput>
            </Box>
            {distributeToValue !== 'TON Holder' && (
              <Box d="flex" flexDir="column" mb={'29px'}>
                <Text mb={'9px'}>Distribution Timestamp</Text>
                <CustomInput
                  w={'290px'}
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
                  }></CustomInput>
              </Box>
            )}
          </Flex>

          <Box
            as={Flex}
            justifyContent={'space-between'}
            pt={5}
            px={'20px'}
            borderTop={
              colorMode === 'light' ? '1px solid #f4f6f8' : '1px solid #373737'
            }>
            <Button
              {...btnStyle.btnAble()}
              w={'150px'}
              fontSize="14px"
              _hover={{}}
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
              _hover={{}}
              isDisabled={!ableDistribute || isTokenBalanceExceed}
              onClick={() => {
                distributeAction();
                handleCloseModal();
              }}>
              Distribute
            </Button>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
