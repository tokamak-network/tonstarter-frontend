import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalFooter,
  Box,
  Heading,
  Text,
  Button,
  Flex,
  useTheme,
  useColorMode,
  Input,
  NumberInput,
  NumberInputField,
  Image,
  Progress,
} from '@chakra-ui/react';
import React, {useCallback, useEffect, useState} from 'react';
import {useAppSelector} from 'hooks/useRedux';
import {selectModalType} from 'store/modal.reducer';
import {useModal} from 'hooks/useModal';
import {CloseButton} from 'components/Modal';
import {DEPLOYED} from 'constants/index';
import {useERC20Token} from 'hooks/useERC20Token';
import {useActiveWeb3React} from 'hooks/useWeb3';
import swapArrow from 'assets/svgs/swap_arrow_icon.svg';
import Line from '../common/Line';
import {useContract} from 'hooks/useContract';
import * as vestingAbi from 'services/abis/VestingPublicFund.json';

const VestingClaimModal = () => {
  const {data} = useAppSelector(selectModalType);
  const {TON_ADDRESS, WTON_ADDRESS} = DEPLOYED;
  const {account, library} = useActiveWeb3React();
  const {colorMode} = useColorMode();
  const theme = useTheme();
  const {handleCloseModal} = useModal();

  const VestingVaultContract = useContract(
    data?.data?.vestingVaultAddress,
    vestingAbi.abi,
  );

  const claim = useCallback(() => {
    if (VestingVaultContract) {
      return VestingVaultContract.claim();
    }
  }, [VestingVaultContract]);

  return (
    <Modal
      isOpen={data.modal === 'Launch_Vesting' ? true : false}
      isCentered
      onClose={() => {
        handleCloseModal();
      }}>
      <ModalOverlay />
      <ModalContent
        fontFamily={theme.fonts.roboto}
        bg={colorMode === 'light' ? 'white.100' : 'black.200'}
        w="350px"
        minH={'574px'}
        maxHeight={'574px'}
        pt="20px"
        pb="25px">
        <CloseButton closeFunc={handleCloseModal}></CloseButton>
        <ModalBody p={0}>
          <Flex flexDir={'column'}>
            <Box d="flex" justifyContent={'center'}>
              <Text fontSize={20} fontWeight={'bold'} color={'#3d495d'}>
                Claim Rounds
              </Text>
            </Box>
            <Box mt={'20px'} mb={'30px'}>
              <Line></Line>
            </Box>
            <Box
              d="flex"
              flexDir={'column'}
              justifyContent={'center'}
              alignItems={'center'}>
              <Flex
                flexDir={'column'}
                justifyContent={'center'}
                alignItems={'center'}
                mb={'35px'}>
                <Text
                  fontSize={20}
                  fontWeight={'bold'}
                  color={'#3d495d'}
                  h={'26px'}
                  mb={'6px'}>
                  Round 3~4
                </Text>
                <Text fontSize={13} fontWeight={500} color={'#86929d'}>
                  of 12 Rounds
                </Text>
              </Flex>
              <Flex
                flexDir={'column'}
                justifyContent={'center'}
                alignItems={'center'}
                mb={'35px'}>
                <Text
                  fontSize={13}
                  fontWeight={500}
                  color={'#304156'}
                  h={'18px'}
                  mb={'12px'}>
                  Claim Amount
                </Text>
                <Flex
                  w={'300px'}
                  h={'78px'}
                  border={'1px solid #d7d9df'}
                  borderRadius={'10px'}
                  p={'14px 14px 16px 25px'}
                  flexDir={'column'}
                  mb={'15px'}>
                  <Box d="flex" justifyContent={'space-between'} w={'100%'}>
                    <Text fontSize={16} color={'#3d495d'}>
                      TON
                    </Text>
                    <Text fontSize={20}>23,648.00</Text>
                  </Box>
                  <Box fontSize={12} color={'#808992'}>
                    Current Value: $37,546
                  </Box>
                </Flex>
                <Flex
                  w={'100%'}
                  h={'45px'}
                  fontSize={13}
                  justifyContent={'space-between'}
                  alignItems="center">
                  <Text color={'#808992'}>Vault Contract Address</Text>
                  <Text color={'#3d495d'}>0xBb4…0090</Text>
                </Flex>
                <Flex
                  w={'100%'}
                  h={'45px'}
                  fontSize={13}
                  justifyContent={'space-between'}
                  alignItems="center"
                  mb={'25px'}>
                  <Text color={'#808992'}>
                    Address for Receiving Funds <br />
                    from the Vesting Vault
                  </Text>
                  <Text color={'#3d495d'}>0xBb4…0090</Text>
                </Flex>
                {/* progress bar part                                   */}
                <Flex
                  flexDir={'column'}
                  w={'100%'}
                  fontSize={13}
                  justifyContent={'space-between'}
                  alignItems="center">
                  <Box
                    d="flex"
                    justifyContent={'space-between'}
                    alignItems={'center'}
                    h={'19px'}
                    mb={'5px'}>
                    <Flex alignItems={'center'} h={'19px'}>
                      <Text fontSize={15} color={'#3f536e'} h={'19px'}>
                        Expected Progress
                      </Text>
                      <Text
                        ml={'8px'}
                        fontSize={13}
                        color={'#0070ed'}
                        height={'23px'}
                        lineHeight={'27px'}
                        verticalAlign={'bottom'}>
                        65.4%
                      </Text>
                    </Flex>
                    <Text
                      fontSize={12}
                      color={'#3a495f'}
                      height={'23px'}
                      lineHeight={'27px'}
                      verticalAlign={'bottom'}>
                      3,981,532 / 5,000,000 TON
                    </Text>
                  </Box>
                  <Progress
                    value={65.4}
                    w={'100%'}
                    h={'6px'}
                    mt={'5px'}
                    borderRadius={'100px'}></Progress>
                </Flex>
              </Flex>
            </Box>
          </Flex>
        </ModalBody>
        <ModalFooter
          justifyContent={'center'}
          p="0px"
          borderTop={
            colorMode === 'light' ? '1px solid #f4f6f8' : '1px solid #373737'
          }>
          <Button
            mt="25px"
            w="150px"
            h="38px"
            bg={'#257eee'}
            _hover={{background: ''}}
            _active={{background: ''}}
            _focus={{background: ''}}
            fontSize="14px"
            color="white"
            onClick={() => claim()}>
            Claim
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default VestingClaimModal;
