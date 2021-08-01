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
import {useAppSelector} from 'hooks/useRedux';
import {selectModalType} from 'store/modal.reducer';
import {useEffect, useState} from 'react';
import {getUserBalance} from 'client/getUserBalance';
import {useUser} from 'hooks/useUser';
import {useModal} from 'hooks/useModal';
import {CloseButton} from 'components/Modal/CloseButton';

export const ClaimOptionModal = () => {
  const {account, library} = useUser();
  const theme = useTheme();
  const {colorMode} = useColorMode();
  const [claimAmount, setClaimAmount] = useState('0');

  const {data} = useAppSelector(selectModalType);
  const {handleCloseModal} = useModal();
  const claimed = data?.data?.canRewardAmount;

  useEffect(() => {
    async function getCanClaimAmount() {
      if (data.data.contractAddress) {
        const result = await getUserBalance(data.data.contractAddress);
        console.log(result);
        if (result) {
          const claimAmount = result.rewardTosBalance;
          if (claimAmount) {
            setClaimAmount(claimAmount);
          }
        }
      }
    }
    getCanClaimAmount();
    /*eslint-disable*/
  }, []);

  return (
    <Modal
      isOpen={data.modal === 'claim' ? true : false}
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
              You can claim {claimAmount} TOS
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
                {claimAmount} TOS
              </Text>
            </Box>
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
