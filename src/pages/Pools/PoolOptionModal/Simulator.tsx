import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  Box,
  Heading,
  Text,
  Input,
  Button,
  Flex,
  Stack,
  useTheme,
  useColorMode,
} from '@chakra-ui/react';
import {useAppDispatch, useAppSelector} from 'hooks/useRedux';
import {closeModal, selectModalType} from 'store/modal.reducer';
import {useCallback, useEffect, useState} from 'react';
import {CloseButton} from 'components/Modal/CloseButton';
import {useUser} from 'hooks/useUser';
import {selectUser} from 'store/app/user.reducer';
import {getTOSContract, fetchSwapPayload} from '../utils/simulator';

export const Simulator = () => {
  // const {account, library} = useUser();
  const theme = useTheme();
  const {colorMode} = useColorMode();

  const {data} = useAppSelector(selectModalType);
  const {data: userData} = useAppSelector(selectUser);

  const dispatch = useAppDispatch();

  const [estimatedReward, setEstimatedReward] = useState<number>(0);
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const [wtonValue, setWtonValue] = useState<number>(0);
  const [tosValue, setTosValue] = useState<number>(0);
  // const [estimatedReward, setEstimatedReward] = useState<number>(0);

  const handleCloseModal = useCallback(() => {
    dispatch(closeModal());
  }, [dispatch]);

  useEffect(() => {
    async function init() {
      const d = await getTOSContract();
      const swapPrice = await fetchSwapPayload();
      if (swapPrice) {
        setCurrentPrice(Number(swapPrice));
      }
    }
    init();
  }, []);

  useEffect(() => {
    console.log(currentPrice);
    console.log(wtonValue);
    console.log(tosValue);
  }, []);

  if (!userData) {
    return null;
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
              Price Range Current Price: {currentPrice} TOS per WTON
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
            <Box textAlign={'center'} pt="20px" pb="20px">
              <Text
                fontSize={'26px'}
                fontWeight={600}
                color={colorMode === 'light' ? 'gray.250' : 'white.100'}>
                Estimated Reward
              </Text>
            </Box>
            <Box textAlign={'center'} pt="20px" pb="20px">
              <Text>WTON</Text>
              <Input
                variant={'outline'}
                borderWidth={0}
                textAlign={'center'}
                fontWeight={'bold'}
                fontSize={'4xl'}
                value={wtonValue}
                onChange={(e) => setWtonValue(Number(e.target.value))}
                w="60%"
                mr={6}
                _focus={{
                  borderWidth: 0,
                }}
              />
              <Box position={'absolute'} right={5}>
                <Button
                  onClick={() => setWtonValue(Number(wton))}
                  type={'button'}
                  variant="outline"
                  _focus={{
                    outline: 'none',
                  }}>
                  Max
                </Button>
              </Box>
            </Box>
            <Box textAlign={'center'} pt="20px" pb="20px">
              <Text>TOS</Text>
              <Input
                variant={'outline'}
                borderWidth={0}
                textAlign={'center'}
                fontWeight={'bold'}
                fontSize={'4xl'}
                value={tosValue}
                onChange={(e) => setTosValue(Number(e.target.value))}
                w="60%"
                mr={6}
                _focus={{
                  borderWidth: 0,
                }}
              />
              <Box position={'absolute'} right={5}>
                <Button
                  onClick={() => setTosValue(Number(tos))}
                  type={'button'}
                  variant="outline"
                  _focus={{
                    outline: 'none',
                  }}>
                  Max
                </Button>
              </Box>
            </Box>
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
