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
import {claimAirdrop} from './actions';
import {useState, useEffect} from 'react';
import {Scrollbars} from 'react-custom-scrollbars-2';
import {useWeb3React} from '@web3-react/core';
import {LoadingComponent} from 'components/Loading';
import {useWindowDimensions} from 'hooks/useWindowDimentions';
import {fetchAirdropPayload} from './utils/fetchAirdropPayload';
import {LoadingDots} from 'components/Loader/LoadingDots';

type Round = {
  allocatedAmount: string;
  amount: string;
  roundNumber: number;
};

type AirDropList = [Round];

const AirdropRecord = ({roundNumber, amount}: {roundNumber: any, amount: any}) => {
  return (
    <WrapItem w="100%" h="37px">
      <Flex w="100%" justifyContent="space-between" pl="1.875em" pr="1.875em">
        <Text>{roundNumber - 1}{checker(roundNumber)} Airdrop</Text>
        <Text>{amount} TOS</Text>
      </Flex>
    </WrapItem>
  );
};

const checker = (roundNumber: any) => {
  if (roundNumber === 2) {
    return 'st'
  } else if (roundNumber === 3) {
    return 'nd'
  } else if (roundNumber === 4) {
    return 'rd'
  } else {
    return 'st'
  }
}

export const AirdropModal = () => {
  const [airdropData, setAirdropData] = useState<AirDropList>([
    {
      allocatedAmount: '',
      amount: '',
      roundNumber: 0,
    },
  ]);
  const {data} = useAppSelector(selectModalType);
  const dispatch = useAppDispatch();
  const {colorMode} = useColorMode();
  const theme = useTheme();
  const {modalStyle} = theme;
  const {account, library} = useWeb3React();

  useEffect(() => {
    async function callAirDropData() {
      const res = await fetchAirdropPayload();
      console.log(res);
      return setAirdropData(res);
    }
    callAirDropData();
  }, []);

  const handleCloseModal = useCallback(() => {
    dispatch(closeModal());
  }, [dispatch]);

  const {height} = useWindowDimensions();

  if (airdropData.length < 1) {
    return (
      <Center h={height}>
        <LoadingComponent />
      </Center>
    )
  }

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
                {airdropData[0]?.allocatedAmount === '' ? (
                  <LoadingDots></LoadingDots>
                ) : (
                  airdropData[0]?.allocatedAmount
                )}
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
                Genesis Airdrop {airdropData[0]?.allocatedAmount}
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
                {airdropData?.length > 0 ? airdropData.map((data: any) => (
                  <AirdropRecord
                    roundNumber={data.roundNumber}
                    amount = {data.amount}
                  />
                )): null}
              </Wrap>
            </Scrollbars>
          </Stack>
          <Center mt="30px">
            <Button
              w={'150px'}
              bg={'blue.500'}
              color="white.100"
              fontSize="14px"
              _hover={{backgroundColor: 'blue.100'}}
              onClick={() =>
                claimAirdrop({
                  userAddress: account,
                  library: library,
                  handleCloseModal: dispatch(closeModal()),
                })
              }>
              Claim
            </Button>
          </Center>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
