import {useCallback} from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  Heading,
  Stack,
  Flex,
  Box,
  Text,
  useColorMode,
  useTheme,
  Wrap,
  WrapItem,
  Button,
  Center,
} from '@chakra-ui/react';
import {useAppDispatch, useAppSelector} from 'hooks/useRedux';
import {closeModal, selectModalType} from 'store/modal.reducer';

const AirdropRecord = ({balance}: {balance: string}) => {
  return (
    <WrapItem w="100%" h="37px">
      <Flex w="100%" justifyContent="space-between" pl="1.875em" pr="1.875em">
        <Text>1st Airdrop</Text>
        <Text>{balance} TOS</Text>
      </Flex>
    </WrapItem>
  );
};

export const AirdropModal = () => {
  const {data} = useAppSelector(selectModalType);
  const dispatch = useAppDispatch();
  const {colorMode} = useColorMode();
  const theme = useTheme();
  const {modalStyle} = theme;

  const handleCloseModal = useCallback(() => {
    dispatch(closeModal());
  }, [dispatch]);

  const dummyData = ['6000', '6000', '6000', '6000'];

  console.log(modalStyle);

  return (
    <Modal
      isOpen={data.modal === 'airdrop' ? true : false}
      isCentered
      onClose={handleCloseModal}>
      <ModalOverlay />
      <ModalContent {...modalStyle.modalContent({colorMode})} h="540px">
        <ModalBody p={0}>
          <Box {...modalStyle.box({colorMode})}>
            <Heading {...modalStyle.head({colorMode})}>Airdrop Claim</Heading>
            <Text {...modalStyle.headText}>You can claim TOS</Text>
          </Box>
          <Stack {...modalStyle.stack({colorMode})} pt="1.875em">
            <Text fontSize={'0.813em'} color="blue.300" mb="1.125em">
              Available Balance
            </Text>
            <Flex
              style={{marginTop: '0', marginBottom: '2.500em'}}
              height="39px">
              <Text
                fontSize="2.000em"
                fontWeight={500}
                color="black.300"
                mr="5px">
                4,000.00
              </Text>
              <Text fontSize="0.813em" color="gray.250" alignSelf="flex-end">
                TOS
              </Text>
            </Flex>
            <Text
              style={{marginTop: '0', marginBottom: '0.313em'}}
              fontSize="0.750em"
              color="gray.400">
              Detail
            </Text>
            <Flex style={{marginTop: '0', marginBottom: '0.875em'}} h="24px">
              <Text fontSize="1.125em" fontWeight={500} color="gray.250" mr={1}>
                Genesis Airdrop 6,000
              </Text>
              <Text fontSize="0.750em" alignSelf="flex-end" fontWeight="bold">
                TOS
              </Text>
            </Flex>
            <Wrap
              display="flex"
              height="135px"
              overflowY="auto"
              overflowX="hidden"
              style={{marginTop: '0', marginBottom: '20px'}}>
              {dummyData.map((data) => (
                <AirdropRecord balance={data}></AirdropRecord>
              ))}
            </Wrap>
          </Stack>
          <Center mt="25px">
            <Button {...modalStyle.button}>Claim</Button>
          </Center>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
