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
  // Wrap,
  WrapItem,
  Button,
  Center,
} from '@chakra-ui/react';
import {useAppDispatch, useAppSelector} from 'hooks/useRedux';
import {closeModal, selectModalType} from 'store/modal.reducer';
import {claimAirdrop} from './actions';
import {useState, useEffect} from 'react';
// import {Scrollbars} from 'react-custom-scrollbars-2';
import {LoadingComponent} from 'components/Loading';
import {fetchAirdropPayload} from './utils/fetchAirdropPayload';
import {useActiveWeb3React} from 'hooks/useWeb3';

type Round = {
  allocatedAmount: string;
  amount: string;
  roundNumber: number;
  myAmount: string;
};

type AirDropList = [Round] | undefined;

const AirdropRecord = ({
  roundNumber,
  amount,
}: {
  roundNumber: any;
  amount: any;
}) => {
  return (
    <WrapItem w="100%" h="37px">
      <Flex w="100%" justifyContent="space-between" pl="1.875em" pr="1.875em">
        <Text>
          {roundNumber - 1}
          {checker(roundNumber)} Airdrop
        </Text>
        <Text>{amount} TOS</Text>
      </Flex>
    </WrapItem>
  );
};

const checker = (roundNumber: any) => {
  if (roundNumber === 2) {
    return 'st';
  } else if (roundNumber === 3) {
    return 'nd';
  } else if (roundNumber === 4) {
    return 'rd';
  } else {
    return 'th';
  }
};

export const AirdropModal = () => {
  const [airdropData, setAirdropData] = useState<AirDropList>(undefined);
  const [balance, setBalance] = useState<string | undefined>(undefined);
  const {data} = useAppSelector(selectModalType);
  const {account, library} = useActiveWeb3React();
  const dispatch = useAppDispatch();
  const {colorMode} = useColorMode();
  const theme = useTheme();
  const {modalStyle, btnStyle} = theme;

  const availableAmount = (
    roundInfo: AirDropList,
    claimedAmount: string | undefined,
    unclaimedAmount: string | undefined,
  ) => {
    if (roundInfo !== undefined && claimedAmount !== undefined) {
      return setBalance(unclaimedAmount);
    }
  };

  useEffect(() => {
    async function callAirDropData() {
      if (account === undefined || account === null) {
        return;
      }
      const res = await fetchAirdropPayload(account, library);
      if (res === undefined) {
        return;
      }
      const {roundInfo, claimedAmount, unclaimedAmount} = res;
      setAirdropData(roundInfo);
      availableAmount(roundInfo, claimedAmount, unclaimedAmount);
    }
    if (account !== undefined && library !== undefined) {
      callAirDropData();
    }
    /*eslint-disable*/
  }, [account]);

  const handleCloseModal = () => {
    dispatch(closeModal());
  };

  return (
    <Modal
      isOpen={data.modal === 'airdrop' ? true : false}
      isCentered
      onClose={handleCloseModal}>
      <ModalOverlay />
      <ModalContent
        {...modalStyle.modalContent({colorMode})}
        borderRadius={15}
        pos="relative">
        {airdropData === undefined && (
          <Flex
            pos="absolute"
            w="100%"
            h="100%"
            alignItems="center"
            justifyContent="center"
            pb={25}
            zIndex={100}>
            <Center w="100%" h="100%">
              <LoadingComponent></LoadingComponent>
            </Center>
          </Flex>
        )}
        <ModalBody p={0} opacity={airdropData === undefined ? 0.5 : 1}>
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
                {balance}
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
                Genesis Airdrop{' '}
                {airdropData !== undefined && airdropData[0]?.myAmount}
                {airdropData !== undefined &&
                airdropData[0]?.myAmount === undefined
                  ? '0.00'
                  : null}
              </Text>
              <Text fontSize="0.750em" alignSelf="flex-end" fontWeight="bold">
                TOS
              </Text>
            </Flex>
            {/* {airdropData !== undefined && airdropData.length > 1 && (
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
                  {airdropData.slice(1).map((data: any, index: number) => (
                    <AirdropRecord
                      roundNumber={data.roundNumber}
                      amount={data.amount}
                      key={index}
                    />
                  ))}
                </Wrap>
              </Scrollbars>
            )} */}
          </Stack>
          <Center mt="30px">
            <Button
              {...(airdropData === undefined ||
              airdropData[0]?.myAmount === '0.00'
                ? {...btnStyle.btnDisable({colorMode})}
                : {...btnStyle.btnAble()})}
              w={'150px'}
              // bg={'blue.500'}
              // color="white.100"
              fontSize="14px"
              isDisabled={
                airdropData === undefined ||
                airdropData[0]?.myAmount === '0.00' ||
                balance === '0.00'
                  ? true
                  : false
              }
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
