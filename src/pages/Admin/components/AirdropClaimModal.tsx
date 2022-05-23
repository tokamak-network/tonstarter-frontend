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
  Checkbox,
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
import {useERC20Token} from 'hooks/useERC20Token';

export const AirdropClaimModal = () => {
  const {TON_ADDRESS, WTON_ADDRESS, TOS_ADDRESS, DOC_ADDRESS} = DEPLOYED;
  const {data} = useAppSelector(selectModalType);
  const {colorMode} = useColorMode();
  const theme = useTheme();
  const {account, library} = useActiveWeb3React();
  const {btnStyle} = theme;

  const [tokenAddress, setTokenAddress] = useState<string>(TON_ADDRESS);
  const [tokenAmount, setTokenAmount] = useState('');
  const [allowance, setAllowance] = useState<string>('');
  const [ableDistribute, setAbleDistribute] = useState<boolean>(false);
  const [timeStamp, setTimeStamp] = useState<string>('');
  const [isRay, setIsRay] = useState<boolean>(false);

  const {blockNumber} = useBlockNumber();
  const {handleCloseModal} = useModal(setTokenAmount);

  const {tokenSymbol, genesisAirdropBalance} = data?.data;

  console.log('data: ', data);

  const themeDesign = {
    fontColorTitle: {
      light: 'gray.250',
      dark: 'white.100',
    },
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
      light: 'dashed 1px #dfe4ee',
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

  useEffect(() => {
    setIsRay(tokenAddress === WTON_ADDRESS);
  }, [tokenAddress, WTON_ADDRESS]);

  useEffect(() => {
    async function getAllowanceAmount() {
      if (!account) {
        return;
      }
      const allowanceAmount = await AdminActions.checkApprove({
        account,
        library,
        address: tokenAddress,
        isRay,
      });
      setAllowance(allowanceAmount);
    }
    if (account && tokenAddress !== '') {
      getAllowanceAmount();
    } else {
      setAllowance('0.00');
    }
  }, [account, library, tokenAddress, blockNumber, isRay]);

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
    'CUSTOM TOKEN',
  ];
  const selectOptionNames = ['TON', 'WTON', 'TOS', 'DOC', 'CUSTOM TOKEN'];

  useEffect(() => {
    if (tokenAddress === 'CUSTOM TOKEN') return setTokenAddress('');
  }, [tokenAddress]);

  // const {tokenBalance, tokenSymbol} = useERC20Token({
  //   tokenAddress: tokenAddress,
  //   isRay: tokenAddress === WTON_ADDRESS,
  // });
  // const [isTokenBalanceExceed, setIsTokenBalanceExceed] =
  //   useState<boolean>(true);

  // useEffect(() => {
  //   const checkedTokenBalanceExceed =
  //     Number(tokenAmount.replaceAll(',', '')) >
  //     Number(tokenBalance.replaceAll(',', ''));
  //   return setIsTokenBalanceExceed(checkedTokenBalanceExceed);
  // }, [tokenAmount, tokenBalance]);

  return (
    <Modal
      isOpen={data.modal === 'Airdrop_Claim' ? true : false}
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
              Airdrop Claim
            </Heading>
          </Box>

          <Text
            textAlign={'center'}
            mt={'20px'}
            fontSize={'13px'}
            fontFamily={theme.fonts.roboto}
            fontWeight={'bold'}
            color={'#2a72e5'}>
            Amount
          </Text>

          <Flex
            flexDir="column"
            mt={'15px'}
            pl={'30px'}
            pr={'30px'}
            fontSize={'13px'}
            fontWeight={600}
            color={colorMode === 'light' ? 'black.300' : 'white.100'}>
            <Box mb={'24px'}>
              <Flex alignItems={'baseline'} justifyContent={'center'}>
                <Text
                  fontSize={'35px'}
                  mr={'3px'}
                  fontFamily={theme.fonts.roboto}>
                  2,000.00
                </Text>
                <Text fontSize={'13px'} fontFamily={theme.fonts.roboto}>
                  {tokenSymbol}
                </Text>
              </Flex>
            </Box>
            {tokenSymbol === 'TOS' && (
              <Box d="flex" mb={'29px'}>
                <Checkbox mr={'10px'} />
                <Text mr={'4px'} fontSize={'15px'}>
                  {data?.data?.genesisAirdropBalance || '0.00'} TOS
                </Text>
                <Text color={'#949494'} fontSize={'15px'}>
                  (Genesis Airdrop)
                </Text>
              </Box>
            )}
            {tokenSymbol === 'sTOS' && (
              <Box d="flex" mb={'29px'}>
                <Checkbox mr={'10px'} />
                <Text mr={'4px'} fontSize={'15px'}>
                  100 {tokenSymbol}
                </Text>
                <Text color={'#949494'} fontSize={'15px'}>
                  (DAO Airdrop)
                </Text>
              </Box>
            )}
            {tokenSymbol === 'TON' && (
              <Box d="flex" mb={'29px'}>
                <Checkbox mr={'10px'} />
                <Text mr={'4px'} fontSize={'15px'}>
                  100 {tokenSymbol}
                </Text>
                <Text color={'#949494'} fontSize={'15px'}>
                  (TON Staker)
                </Text>
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
              {...(!ableDistribute
                ? {...btnStyle.btnDisable({colorMode})}
                : {...btnStyle.btnAble()})}
              w={'150px'}
              fontSize="14px"
              fontFamily={theme.fonts.roboto}
              color={'#fff'}
              _hover={{}}
              onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button
              {...btnStyle.btnAble()}
              w={'150px'}
              fontSize="14px"
              _hover={{}}
              onClick={() => {
                account &&
                  AdminActions.getERC20ApproveTOS({
                    account,
                    library,
                    amount: tokenAmount,
                    address: tokenAddress,
                    isRay: WTON_ADDRESS === tokenAddress,
                  });
              }}>
              Claim
            </Button>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};