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
import {claimReward} from '../actions';
import {useWeb3React} from '@web3-react/core';
import {useAppDispatch, useAppSelector} from 'hooks/useRedux';
import {closeModal, selectModalType} from 'store/modal.reducer';

export const ClaimOptionModal = () => {
  const {account, library} = useWeb3React();
  const theme = useTheme();
  const {colorMode} = useColorMode();

  const {data} = useAppSelector(selectModalType);
  const dispatch = useAppDispatch();
  let claimed = data?.data?.canRewardAmount;
  let earned = data?.data?.myearned;

  return (
    <Modal
      isOpen={data.modal === 'claim' ? true : false}
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
              Claim
            </Heading>
            <Text color="gray.175" fontSize={'0.750em'} textAlign={'center'}>
              You can claim {claimed ? claimed : '0.00'} TOS and earned{' '}
              {earned ? earned : '0.00'} TOS
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
              {claimed ? claimed : '0.00'} TOS
            </Text>
          </Stack>

          <Box as={Flex} justifyContent={'center'}>
            <Button
              disabled={Number(claimed) <= 0}
              w={'150px'}
              bg={'blue.500'}
              color="white.100"
              fontSize="14px"
              _hover={{backgroundColor: 'blue.100'}}
              onClick={() =>
                claimReward({
                  userAddress: account,
                  stakeContractAddress: data.data.contractAddress,
                  saleEndTime: data.data.saleEndTime,
                  library: library,
                  canRewardAmount: data.data.canRewardAmount,
                  myEarned: data.data.myearned,
                  handleCloseModal: dispatch(closeModal()),
                })
              }>
              Claim
            </Button>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
