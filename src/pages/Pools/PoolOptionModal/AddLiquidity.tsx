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

import {useAppDispatch, useAppSelector} from 'hooks/useRedux';
import {closeModal, selectModalType} from 'store/modal.reducer';
import {selectUser} from 'store/app/user.reducer';
import {CloseButton} from 'components/Modal/CloseButton';
import {useCallback, useEffect, useState} from 'react';
// import {CustomTitle} from 'components/Basic/CustomTitle';
import {CustomInput, CustomSelectBox} from 'components/Basic/index';
import {remove} from '../actions';
import {useWeb3React} from '@web3-react/core';
import {number} from 'prop-types';

export const AddLiquidity = () => {
  const theme = useTheme();
  const {btnStyle} = theme;
  const {colorMode} = useColorMode();
  const fontColorGray = colorMode === 'light' ? 'gray.400' : 'gray.475';
  const fontColorBlack = colorMode === 'light' ? 'black.300' : 'white.100';

  const {data} = useAppSelector(selectModalType);
  const {data: userData} = useAppSelector(selectUser);
  const {account, library} = useWeb3React();
  const dispatch = useAppDispatch();
  const handleCloseModal = useCallback(() => {
    dispatch(closeModal());
  }, [dispatch]);
  const [percentage, setPerentage] = useState<number>(0);
  const [token1Amount, setToken1Amount] = useState<number>(10000000);
  const [token2Amount, setToken2Amount] = useState<number>(100000);
  const [token0Approved, setApproveToken0] = useState<boolean>(false);
  const [token1Approved, setApproveToken1] = useState<boolean>(false);
  if (!userData || !userData.balance) {
    return null;
  }

  const {
    balance: {wton, tos},
  } = userData;

  const localBtnStyled = {
    btn: () => ({
      bg: 'transparent',
      borderRadius: '4px',
      w: '80px',
      h: '26px',
      px: '15px',
      fontFamily: 'Roboto',
      fontSize: '13px',
      fontWeight: 600,
      _hover: {border: '1px solid #2a72e5', color: 'blue.100'},
    }),
  };
  const maxBtnStyled = {
    btn: () => ({
      bg: 'transparent',
      borderRadius: '4px',
      color: fontColorBlack,
      w: '50px',
      h: '20px',
      border: colorMode === 'light' ? '1px solid #f4f6f8' : '1px solid #373737',
      px: '15px',
      ml: '10px',
      fontFamily: 'Roboto',
      fontSize: '12px',
      fontWeight: 500,
      _hover: {border: '1px solid #2a72e5', color: 'blue.100'},
    }),
  };
  const changePercentage = (percent: number) => {
    setPerentage(percent);
  };

  return (
    <Modal
      isOpen={data.modal === 'add_liquidity' ? true : false}
      isCentered
      onClose={handleCloseModal}>
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
              Add Liquidity
            </Heading>
            <Text color="gray.175" fontSize={'0.750em'} textAlign={'center'}>
              You can add liquidity on UniswapV3
            </Text>
          </Box>
          <Box as={Flex} flexDir="column" alignItems="center">
            <Text
              mt={'30px'}
              fontSize={'12px'}
              color={fontColorBlack}
              fontWeight={'600'}>
              Deposited Amount
            </Text>
            <Box d="flex">
              <Text
                mt={'18px'}
                fontSize={'20px'}
                fontWeight={500}
                color={fontColorBlack}>
                {data.data.poolName}
              </Text>
              <Text fontSize={16} alignSelf="flex-end" color={fontColorBlack}>
                _#{data.data.id}
              </Text>
            </Box>
            <Text
              fontSize={'12px'}
              color={fontColorGray}
              mt={'24px'}
              mb={'5px'}>
              Details
            </Text>
            <Box d="flex" justifyContent="space-between" w={'72%'}>
              <Text fontSize={'13px'} color={fontColorBlack}>
                {data.data.token0}
              </Text>
              <Text fontWeight={600} fontSize={'13px'} color={fontColorBlack}>
                6,000 {data.data.token0}
              </Text>
              <Text fontSize={'13px'} color={fontColorBlack}>
                /
              </Text>
              <Text fontSize={'13px'} color={fontColorBlack}>
                {data.data.token1}
              </Text>
              <Text fontWeight={600} fontSize={'13px'} color={fontColorBlack}>
                6,000 {data.data.token1}
              </Text>
            </Box>
            <Text
              mt={'35px'}
              fontSize={'12px'}
              color={fontColorBlack}
              fontWeight={600}>
              Add more liquidity
            </Text>
            <Box pb={'30px'} mb={'25px'} borderBottom={
                colorMode === 'light'
                  ? '1px solid #f4f6f8'
                  : '1px solid #373737'
              }>
            <Box
              mt={'12px'}
              w={'300px'}
              h={'78px'}
              borderRadius={'10px'}
              border={
                colorMode === 'light'
                  ? '1px solid #f4f6f8'
                  : '1px solid #373737'
              }
              p={'13px'}>
              <Box
                d="flex"
                justifyContent="space-between"
                alignItems={'center'}
                mb={'4px'}>
                <Text fontSize={'16px'} fontWeight={600} color={fontColorBlack}>
                  {data.data.token0}
                </Text>
                {token0Approved? <Text>dfshdfasjh</Text>:  <Button
                  {...localBtnStyled.btn()}
                  color={'#838383'}
                  {...btnStyle.btnAble()} onClick={()=>{
                    setApproveToken0(true)
                  }}>
                  Approve
                </Button> }
              </Box>
              <Box
                d="flex"
                alignItems={'center'}
                mt={'6px'}
                fontSize={'12px'}
                color={fontColorGray}>
                <Text mr={'2px'}>
                  Balance:{' '}
                  {Number(wton).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}{' '}
                  {data.data.token0}
                </Text>
                <Button {...maxBtnStyled.btn()}>MAX</Button>
              </Box>
            </Box>
            <Box
              mt={'10px'}
              w={'300px'}
              h={'78px'}
              borderRadius={'10px'}
              border={
                colorMode === 'light'
                  ? '1px solid #f4f6f8'
                  : '1px solid #373737'
              }
              p={'13px'}>
              <Box
                d="flex"
                justifyContent="space-between"
                alignItems={'center'}
                mb={'4px'}>
                <Text fontSize={'16px'} fontWeight={600} color={fontColorBlack}>
                  {data.data.token1}
                </Text>
           {token1Approved? <Text>dfshdfasjh</Text>: <Button
                  {...localBtnStyled.btn()}
                  color={'#838383'}
                  {...btnStyle.btnAble()} onClick={()=>{
                    setApproveToken1(true)
                  }}>
                  Approve
                </Button>}
              </Box>
              <Box
                d="flex"
                alignItems={'center'}
                mt={'6px'}
                fontSize={'12px'}
                color={fontColorGray}>
                <Text mr={'2px'}>
                  Balance:{' '}
                  {Number(tos).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}{' '}
                  {data.data.token1}
                </Text>
                <Button {...maxBtnStyled.btn()}>MAX</Button>
              </Box>
            </Box>
            </Box>
            <Button
              w={'150px'}
              bg={'blue.500'}
              color="white.100"
              fontSize="14px"
              _hover={{backgroundColor: 'blue.100'}}
              onClick={() =>
                remove({
                  token1iD: 'wTON',
                  token2iD: 'TOs',
                  token1Amount: '0',
                  token2Amount: '0',
                  userAddress: account,
                  library: library,
                  handleCloseModal: handleCloseModal(),
                })
              }>
              Add
            </Button>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
