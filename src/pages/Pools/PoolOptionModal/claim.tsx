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
import {claim} from '../actions';
import {useWeb3React} from '@web3-react/core';
import {useAppDispatch, useAppSelector} from 'hooks/useRedux';
import {closeModal, selectModalType} from 'store/modal.reducer';
import {useCallback} from 'react';

export const ClaimOptionModal = () => {
  const {account, library} = useWeb3React();
  const theme = useTheme();
  const {colorMode} = useColorMode();

  const {data} = useAppSelector(selectModalType);
  const dispatch = useAppDispatch();
  
  const swapableAmount = data?.data?.swapableAmount

  const handleCloseModal = useCallback(() => {
    dispatch(closeModal());
  }, [dispatch]);

  return (
    <Modal
      isOpen={data.modal === 'claimPool' ? true : false}
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
              You can claim {swapableAmount ? swapableAmount : '0.00'} TOS
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
                {swapableAmount} TOS
              </Text>
            </Box>
          </Stack>

          <Box as={Flex} justifyContent={'center'}>
            <Button
              disabled={!(Number(swapableAmount) > 0)}
              w={'150px'}
              bg={'blue.500'}
              color="white.100"
              fontSize="14px"
              _hover={{backgroundColor: 'blue.100'}}
              onClick={() =>
                claim({
                  userAddress: account,
                  tokenId: data.data.id,
                  library: library,
                  handleCloseModal: handleCloseModal(),
                })
              }
            >
              Claim
            </Button>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
