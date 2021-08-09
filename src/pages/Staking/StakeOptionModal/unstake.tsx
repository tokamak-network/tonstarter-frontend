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
import {unstake} from '../actions/';
import {useAppDispatch, useAppSelector} from 'hooks/useRedux';
import {closeModal, selectModalType} from 'store/modal.reducer';
import {useUser} from 'hooks/useUser';
import {useModal} from 'hooks/useModal';
import {CloseButton} from 'components/Modal/CloseButton';

export const UnstakeOptionModal = () => {
  const {account, library} = useUser();
  const {data} = useAppSelector(selectModalType);
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const {colorMode} = useColorMode();
  const totalStakedBalance = data?.data?.totalStakedBalance;
  const {handleCloseModal} = useModal();

  return (
    <Modal
      isOpen={data.modal === 'unstake' ? true : false}
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
            my={3}
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
              Unstake
            </Heading>
            <Text color="gray.175" fontSize={'0.750em'} textAlign={'center'}>
              You can earn TOS and POWER
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
                {totalStakedBalance} TON
              </Text>
            </Box>
          </Stack>

          <Box as={Flex} justifyContent={'center'}>
            <Button
              w={'150px'}
              bg={'blue.500'}
              color="white.100"
              fontSize="14px"
              _hover={{...theme.btnHover}}
              onClick={() =>
                unstake({
                  userAddress: account,
                  endTime: data.data.saleEndTime,
                  library: library,
                  stakeContractAddress: data.data.contractAddress,
                  mystaked: data.data.mystaked,
                  handleCloseModal: dispatch(closeModal()),
                })
              }
              disabled={+totalStakedBalance <= 0}>
              Unstake
            </Button>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
