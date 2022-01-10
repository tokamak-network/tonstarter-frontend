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
  useTheme,
  useColorMode,
} from '@chakra-ui/react';
import React, {useEffect, useState} from 'react';
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

export const DistributeModal = () => {
  const {TON_ADDRESS, WTON_ADDRESS, TOS_ADDRESS, DOC_ADDRESS} = DEPLOYED;
  const {data} = useAppSelector(selectModalType);
  const {colorMode} = useColorMode();
  const theme = useTheme();
  const {account, library} = useActiveWeb3React();
  const {handleCloseModal} = useModal();
  const {btnStyle} = theme;

  const [tokenAddress, setTokenAddress] = useState<string>(TON_ADDRESS);
  const [tokenAmount, setTokenAmount] = useState('');
  const [allowance, setAllowance] = useState<string>('');
  const [ableDistribute, setAbleDistribute] = useState<boolean>(false);
  const [timeStamp, setTimeStamp] = useState<string>('');

  const {blockNumber} = useBlockNumber();

  useEffect(() => {
    async function getAllowanceAmount() {
      if (!account) {
        return;
      }
      const allowanceAmount = await AdminActions.checkApprove({
        account,
        library,
        address: tokenAddress,
      });
      setAllowance(allowanceAmount);
    }
    if (account && tokenAddress !== '') {
      getAllowanceAmount();
    } else {
      setAllowance('0.00');
    }
  }, [account, library, tokenAddress, blockNumber]);

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

    return setTimeStamp(nextWed);
  }, []);
  const selectOptionValues = [
    TON_ADDRESS,
    WTON_ADDRESS,
    TOS_ADDRESS,
    DOC_ADDRESS,
    'CUSTOM TOKEN',
  ];
  const selectOptionNames = ['TON', 'WTON', 'TOS', 'DOC', 'CUSTOM TOKEN'];

  useEffect(() => {
    if (tokenAddress === 'CUSTOM TOKEN') return setTokenAddress('');
  }, [tokenAddress]);

  return (
    <Modal
      isOpen={data.modal === 'Admin_Distribute' ? true : false}
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
              <Text mb={'9px'}>Token Address</Text>
              <CustomSelectBox
                w={'290px'}
                h={'32px'}
                list={selectOptionValues}
                optionName={selectOptionNames}
                setValue={setTokenAddress}
                fontSize={'12px'}></CustomSelectBox>
              {[TON_ADDRESS, WTON_ADDRESS, TOS_ADDRESS, DOC_ADDRESS].indexOf(
                tokenAddress,
              ) === -1 && (
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
              onClick={() => {
                account &&
                  AdminActions.getERC20Approve({
                    account,
                    library,
                    amount: tokenAmount,
                    address: tokenAddress,
                  });
              }}>
              Approve
            </Button>
            <Button
              {...(!ableDistribute
                ? {...btnStyle.btnDisable({colorMode})}
                : {...btnStyle.btnAble()})}
              w={'150px'}
              fontSize="14px"
              _hover={{}}
              isDisabled={!ableDistribute}
              onClick={() => {
                account &&
                  AdminActions.distribute({
                    account,
                    library,
                    amount: tokenAmount,
                    address: tokenAddress,
                  });
              }}>
              Distribute
            </Button>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
