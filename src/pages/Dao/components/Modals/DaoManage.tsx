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
  Input,
  Stack,
  useTheme,
  useColorMode,
  Select,
} from '@chakra-ui/react';
import React from 'react';
import {useAppSelector} from 'hooks/useRedux';
import {selectModalType} from 'store/modal.reducer';
import {onKeyDown, useInput} from 'hooks/useInput';
import {useModal} from 'hooks/useModal';
import {useUser} from 'hooks/useUser';
import {useState, useEffect, useRef} from 'react';

type SelectPeriod = '1month' | '6months' | '1year' | '3year';

const themeDesign = {
  border: {
    light: 'solid 1px #d7d9df',
    dark: 'solid 1px #535353',
  },
  font: {
    light: 'black.300',
    dark: 'gray.475',
  },
  tosFont: {
    light: 'gray.250',
    dark: 'black.100',
  },
};

export const DaoManageModal = () => {
  const {data} = useAppSelector(selectModalType);
  const {colorMode} = useColorMode();
  const theme = useTheme();
  const {signIn, account, library} = useUser();
  const {btnStyle} = theme;
  const {handleCloseModal, handleOpenConfirmModal} = useModal();

  useEffect(() => {}, []);

  if (signIn === false) {
    return <></>;
  }

  return (
    <Modal
      isOpen={data.modal === 'dao_manage' ? true : false}
      isCentered
      onClose={() => {
        handleCloseModal();
      }}>
      <ModalOverlay />
      <ModalContent
        fontFamily={theme.fonts.roboto}
        bg={colorMode === 'light' ? 'white.100' : 'black.200'}
        w="350px"
        pt="25px"
        pb="25px">
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
              Manage
            </Heading>
            <Text color="gray.175" fontSize={'0.750em'} textAlign={'center'}>
              You can manage your Staking
            </Text>
          </Box>

          <Box as={Flex} justifyContent={'center'}>
            <Button
              {...(signIn
                ? {...btnStyle.btnAble()}
                : {...btnStyle.btnDisable({colorMode})})}
              w={'150px'}
              fontSize="14px"
              _hover={theme.btnHover.checkDisable({signIn})}
              disabled={!signIn}
              onClick={() => {
                handleOpenConfirmModal({
                  type: 'confirm',
                  data: {
                    // amount: value,
                    // period,
                    action: () => {},
                  },
                });
              }}>
              Manage
            </Button>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
