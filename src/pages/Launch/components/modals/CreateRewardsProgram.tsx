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
  Input,
} from '@chakra-ui/react';
import React, {useEffect, useState} from 'react';
import {useAppSelector} from 'hooks/useRedux';
import {selectModalType} from 'store/modal.reducer';
import {useModal} from 'hooks/useModal';
import {CloseButton} from 'components/Modal';
import {Projects} from '@Launch/types';
import {useFormikContext} from 'formik';
import useValues from '@Launch/hooks/useValues';
import Line from '@Launch/components/common/Line';
import {CustomButton} from 'components/Basic/CustomButton';
import {CustomSelectBox} from 'components/Basic';
import {color} from 'd3';

const CreateRewardsProgramModal = () => {
  const {data} = useAppSelector(selectModalType);
  const {colorMode} = useColorMode();
  const theme = useTheme();
  const {handleCloseModal} = useModal();
  const [selectVaultType, setSelectVaultType] = useState<
    'C' | 'DAO' | 'Liquidity Incentive'
  >('C');

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
    <Modal
      isOpen={data.modal === 'Launch_CreateRewardProgram' ? true : false}
      isCentered
      onClose={() => {
        handleCloseModal();
      }}>
      <ModalOverlay />
      <ModalContent
        fontFamily={theme.fonts.roboto}
        bg={colorMode === 'light' ? 'white.100' : 'black.200'}
        w="350px"
        pt="20px"
        pb="25px">
        <CloseButton closeFunc={handleCloseModal}></CloseButton>
        <ModalBody p={0}>
          <Box
            pb={'1.250em'}
            borderBottom={
              colorMode === 'light' ? '1px solid #f4f6f8' : '1px solid #373737'
            }>
            <Heading
              fontSize={'20px'}
              fontWeight={'bold'}
              fontFamily={theme.fonts.titil}
              color={colorMode === 'light' ? 'gray.250' : 'white.100'}
              textAlign={'center'}>
              Create Rewards Program
            </Heading>
          </Box>

          <Flex
            flexDir="column"
            alignItems="center"
            mt={'20px'}
            fontSize={13}
            color={colorMode === 'light' ? 'gray.250' : 'white.100'}>
            <Flex
              w={'350px'}
              h={'45px'}
              flexDir={'row'}
              justifyContent={'space-between'}
              px={'20px'}
              alignItems={'center'}
              fontWeight={'bold'}>
              <Text color={colorMode === 'light' ? '#808992' : '#949494'}>
                Rewards Duration
              </Text>
              <Text
                w={'103px'}
                color={colorMode === 'light' ? '#3d495d' : '#f3f4f1'}>
                2022.03.09 20:00 ~04.04 17:00
              </Text>
            </Flex>
            <Flex
              w={'350px'}
              h={'45px'}
              flexDir={'row'}
              justifyContent={'space-between'}
              px={'20px'}
              alignItems={'center'}
              fontWeight={'bold'}>
              <Text color={colorMode === 'light' ? '#808992' : '#949494'}>
                Rewards Token
              </Text>
              <Text
                w={'103px'}
                color={colorMode === 'light' ? '#3d495d' : '#f3f4f1'}>
                TON
              </Text>
            </Flex>
            <Flex
              w={'350px'}
              h={'45px'}
              flexDir={'row'}
              justifyContent={'space-between'}
              px={'20px'}
              alignItems={'center'}
              fontWeight={'bold'}>
              <Text color={colorMode === 'light' ? '#808992' : '#949494'}>
                Token Amount
              </Text>
              <Text
                w={'103px'}
                color={colorMode === 'light' ? '#3d495d' : '#f3f4f1'}>
                {(20000000).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </Text>
            </Flex>
          </Flex>

          <Box
            mt={'20px'}
            mb={'25px'}
            mx={'15px'}
            width={'320px'}
            height={'1px'}
            bg={colorMode === 'light' ? '#f4f6f8' : '#373737'}></Box>

          <Box
            as={Flex}
            flexDir="row"
            alignItems="center"
            justifyContent={'space-between'}
            px={'19px'}>
            <Button
              fontSize={'14px'}
              w="150px"
              h="38px"
              color={colorMode === 'light' ? '#3e495c' : '#ffffff'}
              bg={'transparent'}
              alignItems={'center'}
              border={themeDesign.border[colorMode]}
              fontFamily={theme.fonts.fld}
              _hover={{
                background: 'transparent',
                border: 'solid 1px #2a72e5',
                color: themeDesign.font[colorMode],
                cursor: 'pointer',
              }}
              _active={{
                background: '#2a72e5',
                border: 'solid 1px #2a72e5',
                color: '#fff',
              }}
              onClick={() => handleCloseModal()}>
              Cancel
            </Button>
            <Button
              fontSize={'14px'}
              w="150px"
              h="38px"
              bg={'#257eee'}
              color={'#ffffff'}
              _hover={{
                background: 'transparent',
                border: 'solid 1px #2a72e5',
                color: themeDesign.tosFont[colorMode],
                cursor: 'pointer',
              }}
              _active={{
                background: '#2a72e5',
                border: 'solid 1px #2a72e5',
                color: '#fff',
              }}>
              Confirm
            </Button>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default CreateRewardsProgramModal;
