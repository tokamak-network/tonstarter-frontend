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
import {useCallback, useEffect, useState} from 'react';
import {fetchClaimablePayload} from '../utils/fetchPositionPayload';
import {ethers} from 'ethers';
import {CloseButton} from 'components/Modal/CloseButton';
import {CustomTabs} from 'components/Basic/index';
import {Tab} from '../types/index';
import {ModalTabs} from '../components/Tabs';

export const ClaimOptionModal = () => {
  const {account, library} = useWeb3React();
  const theme = useTheme();
  const {colorMode} = useColorMode();

  const {data} = useAppSelector(selectModalType);
  const dispatch = useAppDispatch();

  const [swapable, setSwapable] = useState<string | undefined>('0');

  //select tab
  const tabList: Tab[] = ['Reward&Fee', 'Reward', 'Fee'];
  const [tab, setTab] = useState<Tab>('Reward&Fee');

  const amount = async () => {
    if (data.data.id && account) {
      const res = await fetchClaimablePayload(library, account, data.data.id);
      const addedValue = res?.minable.add(res?.expected);
      const expectedAmount = ethers.utils.formatUnits(addedValue, 18);
      setSwapable(Number(expectedAmount).toFixed(9));
    }
  };

  amount();

  const swapableAmount = swapable;

  const handleCloseModal = useCallback(() => {
    dispatch(closeModal());
    setSwapable('0.00');
  }, [dispatch]);

  return (
    <Modal
      isOpen={data.modal === 'claimPool' ? true : false}
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
              Claim
            </Heading>
            <Text color="gray.175" fontSize={'0.750em'} textAlign={'center'}>
              You earned {data?.data.earned ? data?.data.earned : '0.00'} TOS
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
            <Box pt={'15px'} mb="30px">
              <CustomTabs
                w={'90px'}
                h={'26px'}
                list={tabList}
                setValue={setTab}></CustomTabs>
            </Box>
            <Box m={'0 !important'}>
              <ModalTabs
                tab={tab}
                TOS_PER_HOUR={'0'}
                TOS_CLAIM={swapableAmount || '0'}
                TOS_EARNED={'0'}
                TOS_FEE={'0'}
                WTOS_FEE={'0'}
              />
            </Box>

            {/* <Box textAlign={'center'} pt="20px" pb="20px">
              <Text
                fontSize={'26px'}
                fontWeight={600}
                color={colorMode === 'light' ? 'gray.250' : 'white.100'}>
                {swapableAmount} TOS
              </Text>
            </Box> */}
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
              }>
              Claim
            </Button>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
