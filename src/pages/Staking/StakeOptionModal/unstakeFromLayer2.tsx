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
import {unstakeL2} from '../actions';
import React from 'react';
import {useAppSelector} from 'hooks/useRedux';
import {selectModalType} from 'store/modal.reducer';
import {useActiveWeb3React} from 'hooks/useWeb3';
import {useModal} from 'hooks/useModal';
import {CloseButton} from 'components/Modal/CloseButton';

export const UnStakeFromLayer2Modal = () => {
  const {account, library} = useActiveWeb3React();
  const {sub} = useAppSelector(selectModalType);
  const theme = useTheme();
  const {colorMode} = useColorMode();
  const {handleCloseConfirmModal} = useModal();

  const {
    data: {contractAddress, canUnstakedL2, unstakeAll, name},
  } = sub;

  const handleCloseModal = () => {
    handleCloseConfirmModal();
  };

  return (
    <Modal
      isOpen={sub.type === 'manage_unstakeL2' ? true : false}
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
              Unstake TON from the {name} Product
            </Heading>
            <Text color="gray.175" fontSize={'0.750em'} textAlign={'center'}>
              You can earn TON and POWER
            </Text>
          </Box>

          <Stack
            as={Flex}
            pt={'1.875em'}
            pl={'1.875em'}
            pr={'1.875em'}
            justifyContent={'center'}
            alignItems={'center'}
            mb={'25px'}>
            <Box
              display={'flex'}
              justifyContent="center"
              flexDir="column"
              w={'100%'}>
              <Flex justifyContent="center" alignItems="center" h="15px">
                <Text
                  color={colorMode === 'light' ? 'gray.250' : 'white.100'}
                  fontWeight={500}
                  fontSize={'18px'}>
                  {canUnstakedL2} TON
                </Text>
              </Flex>
            </Box>
          </Stack>

          <Box as={Flex} justifyContent={'center'}>
            <Button
              w={'150px'}
              bg={'blue.500'}
              color="white.100"
              fontSize="14px"
              _hover={{...theme.btnHover}}
              onClick={() => {
                unstakeL2({
                  type: unstakeAll,
                  userAddress: account,
                  amount: canUnstakedL2,
                  contractAddress,
                  library: library,
                });
                handleCloseModal();
              }}
              colorScheme={'blue'}>
              Unstake
            </Button>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
