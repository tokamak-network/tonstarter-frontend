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

export const RemoveLiquidity = () => {
  const theme = useTheme();
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

  const localBtnStyled = {
    btn: () => ({
      bg: 'transparent',
      borderRadius: '4px',
      border: colorMode === 'light' ? '1px solid #d7d9df' : '1px solid #535353',
      w: '70px',
      h: '26px',
      py: '10px',
      px: '29.5px',
      fontFamily: 'Roboto',
      fontSize: '12px',
      fontWeight: '500',
      _hover: {border: '1px solid #2a72e5', color: 'blue.100'},
    }),
  };
  const changePercentage = (percent: number) => {
    setPerentage(percent);
  };
  return (
    <Modal
      isOpen={data.modal === 'remove_liquidity' ? true : false}
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
              Remove Liquidity
            </Heading>
            <Text color="gray.175" fontSize={'0.750em'} textAlign={'center'}>
              You can remove liquidity on UniswapV3
            </Text>
          </Box>
          <Box as={Flex} flexDir="column" alignItems="center">
            <Box d="flex">
              <Text
                pt={'20px'}
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
              mb={'30px'}>
              Amount
            </Text>
            <Box
              as={Flex}
              d="flex"
              maxW={
                percentage.toString().length == 1
                  ? '40px'
                  : percentage.toString().length == 2
                  ? '60px'
                  : '80px'
              }>
              <Box borderBottom={'3px solid #2a72e5'}>
                <CustomInput
                  fontSize={'38px'}
                  percentage={true}
                  value={percentage}
                  setValue={changePercentage}
                  numberOnly={true}
                />
              </Box>
              <Text alignSelf="flex-end" mb={'3px'} ml={'4px'}>
                %
              </Text>
            </Box>
            <Box d="flex" mt={'43px'} w={'92%'} justifyContent="space-around">
              <Button
                {...localBtnStyled.btn()}
                onClick={() => changePercentage(25)}>
                25%
              </Button>
              <Button
                {...localBtnStyled.btn()}
                onClick={() => changePercentage(50)}>
                50%
              </Button>
              <Button
                {...localBtnStyled.btn()}
                onClick={() => changePercentage(75)}>
                75%
              </Button>
              <Button
                {...localBtnStyled.btn()}
                onClick={() => changePercentage(100)}>
                MAX
              </Button>
            </Box>
            <Text mt={'40px'} color={fontColorBlack} fontSize={'13px'}>
              Removed Amount
            </Text>
            <Box
              d="flex"
              w={'92%'}
              mt={'19px'}
              justifyContent="space-between"
              alignItems={'center'}>
              <Text fontSize={'13px'} color={fontColorGray}>
                Removed WTON
              </Text>
              <Text fontSize={'15px'} color={fontColorBlack}>
                {(token1Amount * (percentage / 100)).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </Text>
            </Box>
            <Box
              d="flex"
              w={'92%'}
              mt={'27px'}
              justifyContent="space-between"
              alignItems={'center'}
              pb={'33px'}
              borderBottom={
                colorMode === 'light'
                  ? '1px solid #f4f6f8'
                  : '1px solid #373737'
              }>
              <Text fontSize={'13px'} color={fontColorGray}>
                Removed TOS
              </Text>
              <Text fontSize={'15px'} color={fontColorBlack}>
                {(token2Amount * (percentage / 100)).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </Text>
            </Box>
            <Button
              disabled={Number(percentage) === 0}
              w={'150px'}
              mt={'25px'}
              bg={'blue.500'}
              color="white.100"
              fontSize="14px"
              _hover={{backgroundColor: 'blue.100'}}
              onClick={() =>
                remove({
                  token1Id: 'WTON',
                  token2Id: 'TOs',
                  token1Amount: '0',
                  token2Amount: '0',
                  userAddress: account,
                  library: library,
                  handleCloseModal: handleCloseModal(),
                })
              }>
              Remove
            </Button>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
