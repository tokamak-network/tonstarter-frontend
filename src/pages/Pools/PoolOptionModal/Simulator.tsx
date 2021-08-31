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
  Stack,
  useTheme,
  useColorMode,
} from '@chakra-ui/react';
import {useAppDispatch, useAppSelector} from 'hooks/useRedux';
import {closeModal, selectModalType} from 'store/modal.reducer';
import {useCallback, useState} from 'react';
import {CloseButton} from 'components/Modal/CloseButton';
import {useUser} from 'hooks/useUser';
import {selectUser} from 'store/app/user.reducer';

export const Simulator = () => {
  // const {account, library} = useUser();
  const theme = useTheme();
  const {colorMode} = useColorMode();

  const {data} = useAppSelector(selectModalType);
  const {data: userData} = useAppSelector(selectUser);

  const dispatch = useAppDispatch();

  const handleCloseModal = useCallback(() => {
    dispatch(closeModal());
  }, [dispatch]);

  if (!userData) {
    return <></>;
  }

  const {
    balance: {wton, tos},
  } = userData;

  return (
    <Modal
      isOpen={data.modal === 'pool_simulator' ? true : false}
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
              LP Reward Simulator
            </Heading>
            <Text color="gray.175" fontSize={'0.750em'} textAlign={'center'}>
              You can calculate how much WTON and TOS you need to provide LP &
              Expected APY
            </Text>
            <Text color="gray.175" fontSize={'0.750em'} textAlign={'center'}>
              Price Range Current Price: xx,xxx TOS per WTON
            </Text>
          </Box>

          <Stack
            as={Flex}
            justifyContent={'center'}
            alignItems={'center'}
            borderBottom={
              colorMode === 'light' ? '1px solid #f4f6f8' : '1px solid #373737'
            }
            mb={'25px'}>
            <Box textAlign={'center'} pt="20px" pb="20px">
              <Text
                fontSize={'26px'}
                fontWeight={600}
                color={colorMode === 'light' ? 'gray.250' : 'white.100'}>
                {wton} WTON
              </Text>
            </Box>
            <Box textAlign={'center'} pt="20px" pb="20px">
              <Text
                fontSize={'26px'}
                fontWeight={600}
                color={colorMode === 'light' ? 'gray.250' : 'white.100'}>
                {tos} TOS
              </Text>
            </Box>
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
