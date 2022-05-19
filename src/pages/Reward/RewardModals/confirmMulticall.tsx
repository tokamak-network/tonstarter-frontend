import {useState, useMemo, useEffect, useRef, useCallback} from 'react';
import {
  Text,
  Flex,
  Box,
  useTheme,
  useColorMode,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Divider,
} from '@chakra-ui/react';
import {useAppDispatch, useAppSelector} from 'hooks/useRedux';
import {checkTokenType} from 'utils/token';
import {selectTransactionType} from 'store/refetch.reducer';
import {closeModal, selectModalType, openModal} from 'store/modal.reducer';
import {DEPLOYED} from 'constants/index';
import {stakeMultiple, refundMultiple} from '../actions';
import * as STAKERABI from 'services/abis/UniswapV3Staker.json';
import {utils, ethers} from 'ethers';
import {useWeb3React} from '@web3-react/core';
import {CloseButton} from 'components/Modal/CloseButton';
import {useERC20WithTokenList} from 'hooks/useERC20WithTokenList';

const {
  WTON_ADDRESS,
  TON_ADDRESS,
  TOS_ADDRESS,
  AURA_ADDRESS,
  DOC_ADDRESS,
  UniswapStaking_Address,
  UniswapStaker_Address,
} = DEPLOYED;

export const ConfirmMulticallModal = () => {
  const {account, library} = useWeb3React();
  const theme = useTheme();
  const {colorMode} = useColorMode();
  const {data} = useAppSelector(selectModalType);
  const dispatch = useAppDispatch();
  const [stakeList, setStakeList] = useState<any[]>([]);
  const [unstakeList, setUnstakeList] = useState<any[]>([]);
  const [action, setAction] = useState<string>('');
  const [currentToken, setCurrentToken] = useState<number>();
  const [currentAddress, setCurrentAddress] = useState<string>('');
  const [currentLibrary, setCurrentLibrary] = useState<any>();
  const [currentSelectedRewards, setCurrentSelectedRewards] = useState<any[]>(
    [],
  );
  const [currentStakedPools, setCurrentStakedPools] = useState<any[]>([]);
  const [currentMultipleRefundList, setCurrentMultipleRefundList] = useState<
    any[]
  >([]);

  const handleCloseModal = useCallback(() => {
    dispatch(closeModal());
  }, [dispatch]);

  useEffect(() => {
    const {
      stakeKeyList,
      unstakeKeyList,
      tokenid,
      userAddress,
      library,
      selectedRewards,
      multipleRefundList,
      stakedPools,
    } = data?.data;
    setStakeList(stakeKeyList);
    setUnstakeList(unstakeKeyList);
    setCurrentToken(tokenid);
    setCurrentLibrary(library);
    setCurrentAddress(userAddress);
    setCurrentSelectedRewards(selectedRewards);
    setCurrentStakedPools(stakedPools);
    setCurrentMultipleRefundList(multipleRefundList);

    if (stakeKeyList?.length > 0) {
      setAction('stake');
    } else if (unstakeKeyList?.length > 0) {
      setAction('unstake');
    }
  }, [data]);

  const confirmAction = () => {
    handleCloseModal();
    if (!currentMultipleRefundList) {
      stakeMultiple({
        userAddress: currentAddress,
        tokenid: Number(currentToken),
        library: currentLibrary,
        stakeKeyList: stakeList,
        unstakeKeyList: unstakeList,
      });
    } else {
      refundMultiple({
        userAddress: account,
        library: library,
        refundKeyList: currentMultipleRefundList,
        stakedPools: currentStakedPools,
      });
    }
  };

  const updatedRewards = useERC20WithTokenList(currentSelectedRewards);

  return stakeList?.length > 0 ||
    unstakeList?.length > 0 ||
    currentMultipleRefundList?.length > 0 ? (
    <Modal
      isOpen={data.modal === 'confirmMulticall' ? true : false}
      onClose={handleCloseModal}
      size={'xl'}>
      <ModalOverlay />
      <ModalContent
        fontFamily={theme.fonts.roboto}
        bg={colorMode === 'light' ? 'white.100' : 'black.200'}>
        <CloseButton closeFunc={handleCloseModal}></CloseButton>
        <ModalBody>
          {stakeList?.length > 0 && unstakeList?.length === 0 ? (
            <Box>
              <Box
                display={'flex'}
                justifyContent={'center'}
                alignItems={'center'}>
                Are you sure you want to stake {stakeList.length} token(s) using
                the LP token with ID {currentToken}?
              </Box>
              <Box mt={'10px'}>
                The following reward programs will be affected:
              </Box>
            </Box>
          ) : unstakeList?.length > 0 && stakeList?.length === 0 ? (
            <Box>
              <Box
                display={'flex'}
                justifyContent={'center'}
                alignItems={'center'}>
                Are you sure you want to unstake {unstakeList.length} token(s)
                using the LP token with ID {currentToken}?
              </Box>
              <Box mt={'10px'}>
                The following reward programs will be affected:
              </Box>
            </Box>
          ) : unstakeList?.length > 0 && stakeList?.length > 0 ? (
            <Box>
              <Box
                display={'flex'}
                justifyContent={'center'}
                alignItems={'center'}>
                Are you sure you want to stake {stakeList.length} token(s) and
                unstake {unstakeList.length} token(s) using the LP token with ID{' '}
                {currentToken}?
              </Box>
              <Box mt={'10px'}>
                The following reward programs will be affected:
              </Box>
            </Box>
          ) : currentMultipleRefundList?.length > 0 ? (
            <Box>
              <Box
                display={'flex'}
                justifyContent={'center'}
                alignItems={'center'}>
                Are you sure you want to refund{' '}
                {currentMultipleRefundList.length} token(s)?
              </Box>
              <Box mt={'10px'}>
                The following reward programs will be affected:
              </Box>
            </Box>
          ) : null}
          {updatedRewards.map((reward) => {
            return (
              <Box display={'flex'} justifyContent={'space-between'}>
                <Box>
                  #{reward.index} {reward.poolName}
                </Box>
                <Box>Reward Token: {reward.symbol}</Box>
              </Box>
            );
          })}
        </ModalBody>

        <Divider />

        <ModalFooter display={'flex'} justifyContent={'center'}>
          <Button
            colorScheme="gray"
            mr={3}
            onClick={handleCloseModal}
            color={colorMode === 'light' ? 'black.200' : 'white'}>
            Cancel
          </Button>
          <Button
            colorScheme="blue"
            mr={3}
            onClick={confirmAction}
            color={'white'}>
            Confirm
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  ) : null;
};
