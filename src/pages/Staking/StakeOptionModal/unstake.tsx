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
import {unstake} from '../staking.reducer';
import {useWeb3React} from '@web3-react/core';
import {useAppDispatch, useAppSelector} from 'hooks/useRedux';
import {closeModal, selectModalType} from 'store/modal.reducer';

export const UnstakeOptionModal = () => {
  const {account, library} = useWeb3React();
  const {data} = useAppSelector(selectModalType);
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const {colorMode} = useColorMode();

  let balance = data?.data?.mystaked;

  return (
    <Modal
      isOpen={data.modal === 'unstake' ? true : false}
      isCentered
      onClose={() => dispatch(closeModal())}>
      <ModalOverlay />
      <ModalContent
        fontFamily={theme.fonts.roboto}
        bg={colorMode === 'light' ? 'white.100' : 'black.200'}
        w="350px"
        pt="25px"
        pb="25px">
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
              You can earn TON and POWER
            </Text>
          </Box>

          <Stack
            as={Flex}
            py={10}
            flexDir={'row'}
            justifyContent={'center'}
            alignItems={'center'}
            w={'full'}
            borderBottom={
              colorMode === 'light' ? '1px solid #f4f6f8' : '1px solid #373737'
            }
            mb={'25px'}>
            <Text
              variant={'outline'}
              borderWidth={0}
              textAlign={'center'}
              fontWeight={'bold'}
              fontSize={'4xl'}
              width={'xs'}
              mr={6}
              _focus={{
                borderWidth: 0,
              }}>
              {balance ? balance : '0.00'}
            </Text>
          </Stack>

          <Box as={Flex} justifyContent={'center'}>
            <Button
              w={'150px'}
              bg={'blue.500'}
              color="white.100"
              fontSize="14px"
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
              disabled={+balance <= 0}>
              Unstake
            </Button>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
