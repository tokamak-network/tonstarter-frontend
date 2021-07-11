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
import {Scrollbars} from 'react-custom-scrollbars-2';

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
      <ModalContent
        {...modalStyle.modalContent({colorMode})}
        h="540px"
        borderRadius={15}>
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
                {...modalStyle.fontColor({colorMode})}
                mr="5px">
                4,000.00
              </Text>
              <Text
                fontSize="0.813em"
                alignSelf="flex-end"
                {...modalStyle.fontSubColor({colorMode})}>
                TOS
              </Text>
            </Flex>
            <Text
              style={{marginTop: '0', marginBottom: '0.313em'}}
              fontSize="0.750em"
              color="gray.400">
              Detail
            </Text>
            <Flex
              style={{marginTop: '0', marginBottom: '0.875em'}}
              h="24px"
              {...modalStyle.fontSubColor({colorMode})}>
              <Text fontSize="1.125em" fontWeight={500} mr={1}>
                Genesis Airdrop 6,000
              </Text>
              <Text fontSize="0.750em" alignSelf="flex-end" fontWeight="bold">
                TOS
              </Text>
            </Flex>
            <Scrollbars
              style={{
                width: '100%',
                height: '135px',
                display: 'flex',
                position: 'relative',
              }}
              thumbSize={70}
              renderThumbVertical={() => (
                <div
                  style={{
                    background: colorMode === 'light' ? '#007aff' : '#ffffff',
                    position: 'relative',
                    right: '-2px',
                    borderRadius: '3px',
                  }}></div>
              )}
              renderThumbHorizontal={() => (
                <div style={{background: 'black'}}></div>
              )}>
              <Wrap
                display="flex"
                style={{marginTop: '0', marginBottom: '20px'}}>
                {dummyData.map((data) => (
                  <AirdropRecord balance={data}></AirdropRecord>
                ))}
              </Wrap>
            </Scrollbars>
          </Stack>
          <Center mt="30px">
            <Button {...modalStyle.button}>Claim</Button>
          </Center>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
