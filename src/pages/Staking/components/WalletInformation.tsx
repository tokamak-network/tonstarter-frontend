import {
  Container,
  Center,
  Box,
  Text,
  Heading,
  Button,
  Grid,
  Flex,
  useColorMode,
  useTheme,
} from '@chakra-ui/react';
import React, {FC, useState, useCallback} from 'react';
import {AppDispatch} from 'store';
import {openModal, ModalType} from 'store/modal.reducer';
import {Stake} from '../staking.reducer';
import {
  checkSaleClosed,
  checkIsUnstake,
  fetchManageModalPayload,
} from '../utils';
import {LoadingComponent} from 'components/Loading';
import {getUserBalance, getUserTonBalance} from 'client/getUserBalance';
import {useEffect} from 'react';
import {closeSale} from '../actions';
import {LoadingDots} from 'components/Loader/LoadingDots';
import {useActiveWeb3React} from 'hooks/useWeb3';
import {selectTransactionType} from 'store/refetch.reducer';
import {useAppSelector} from 'hooks/useRedux';

type WalletInformationProps = {
  dispatch: AppDispatch;
  data: Stake;
};

export const WalletInformation: FC<WalletInformationProps> = ({
  data,
  dispatch,
}) => {
  const {colorMode} = useColorMode();
  const [loading, setLoading] = useState(false);
  const {account, library} = useActiveWeb3React();

  //Balances
  const [userTonBalance, setUserTonBalance] = useState<string | undefined>(
    undefined,
  );
  const [stakeBalance, setStakeBalance] = useState<string | undefined>(
    undefined,
  );
  const [tosBalance, setTosBalance] = useState<string | undefined>(undefined);
  const [saleClosed, setSaleClosed] = useState(false);

  //Buttons
  const [stakeDisabled, setStakeDisabled] = useState(true);
  const [unstakeDisabled, setUnstakeDisabled] = useState(true);
  const [claimDisabled, setClaimDisabled] = useState(true);
  const [manageDisabled, setManageDisabled] = useState(true);
  const [endSaleBtnDisabled, setEndSaleBtnDisabled] = useState(true);

  const {transactionType, blockNumber} = useAppSelector(selectTransactionType);

  useEffect(() => {
    async function checkSale() {
      if (library && data.vault) {
        const res = await checkSaleClosed(data.vault, library);
        setSaleClosed(res);
      }
    }

    checkSale();
    /*eslint-disable*/
  }, [
    account,
    library,
    data,
    dispatch,
    tosBalance,
    transactionType,
    blockNumber,
  ]);

  const {status} = data;
  const currentBlock: number = Number(data.fetchBlock);
  const miningStart: number = Number(data.miningStartTime);
  const miningEnd: number = Number(data.miningEndTime);
  const saleStart: number = Number(data.saleStartTime);
  const manageBtnDisabled = account === undefined ? true : false;

  const endSaleBtnDisable = () => {
    return account === undefined || miningStart >= currentBlock
      ? setEndSaleBtnDisabled(true)
      : setEndSaleBtnDisabled(false);
  };

  const btnDisabledStake = () => {
    return account === undefined ||
      saleStart >= currentBlock ||
      status !== 'sale'
      ? setStakeDisabled(true)
      : setStakeDisabled(false);
  };

  const btnDisabledUnstake = async () => {
    const res =
      library && data.vault && account
        ? await checkIsUnstake(data.contractAddress, account, library)
        : null;

    return account === undefined ||
      stakeBalance === '0.00' ||
      stakeBalance === undefined ||
      status !== 'end' ||
      res
      ? setUnstakeDisabled(true)
      : setUnstakeDisabled(false);
  };

  const btnDisabledClaim = () => {
    return account === undefined ||
      tosBalance === undefined ||
      tosBalance === '0.00'
      ? setClaimDisabled(true)
      : setClaimDisabled(false);
  };

  const manageDisableClaim = () => {
    return account === undefined || saleClosed === false
      ? setManageDisabled(true)
      : setManageDisabled(false);
  };

  useEffect(() => {
    if (account !== undefined) {
      getWalletTonBalance();
    }
    if (transactionType === undefined || transactionType === 'Staking') {
      btnDisabledStake();
      btnDisabledUnstake();
      btnDisabledClaim();
      manageDisableClaim();
      endSaleBtnDisable();
    }
    /*eslint-disable*/
  }, [account, data, dispatch, tosBalance, transactionType, blockNumber]);

  const modalPayload = async (args: any) => {
    const {account, library, contractAddress, vault} = args;
    const result = await fetchManageModalPayload(
      library,
      account,
      contractAddress,
      vault,
    );

    return result;
  };

  const getWalletTonBalance = async () => {
    if (!account || !library) {
      return;
    }

    const result = await getUserTonBalance({
      account,
      library,
    });
    const userBalance = await getUserBalance(
      account,
      library,
      data.contractAddress,
    );

    if (result && userBalance) {
      const trimNum = Number(result).toLocaleString(undefined, {
        minimumFractionDigits: 2,
      });
      setUserTonBalance(trimNum);
      setStakeBalance(userBalance.totalStakedBalance);
      setTosBalance(userBalance.rewardTosBalance);
    }
  };

  const modalData = useCallback(
    async (modal: ModalType) => {
      setLoading(true);
      let payload;
      const {contractAddress, vault} = data;
      try {
        if (modal === 'manage') {
          const payloadModal = await modalPayload({
            account,
            library,
            contractAddress,
            vault,
          });
          payload = {
            ...data,
            ...payloadModal,
          };
        } else if (modal === 'claim') {
          payload = {
            contractAddress,
            tosBalance,
          };
        } else if (modal === 'unstake') {
          if (!account || !library) {
            return;
          }
          const payloadModal = await getUserBalance(
            account,
            library,
            data.contractAddress,
          );
          payload = {
            ...data,
            totalStakedBalance: payloadModal?.totalStakedBalance,
          };
        } else {
          payload = {
            ...data,
            userTonBalance,
          };
        }
      } catch (e) {
        console.log(e);
        setLoading(false);
      }

      setLoading(false);
      dispatch(openModal({type: modal, data: payload}));
    },
    [data, tosBalance, transactionType, blockNumber],
  ); // eslint-disable-line react-hooks/exhaustive-deps

  const theme = useTheme();
  const {btnStyle} = theme;

  return (
    <Container
      maxW={'sm'}
      shadow={'md'}
      borderRadius={'lg'}
      border={
        colorMode === 'light' ? 'solid 1px #f4f6f8' : 'solid 1px #373737'
      }>
      <Box w={'100%'} p={0} textAlign={'center'} py={10} px={5}>
        <Heading
          color={'blue.300'}
          display="flex"
          alignItems="center"
          justifyContent="center">
          {userTonBalance === undefined && account !== undefined ? (
            <LoadingDots />
          ) : (
            userTonBalance
          )}{' '}
          TON
        </Heading>
        <Box py={5}>
          <Text fontSize={'15px'} color={'gray.400'}>
            Available in wallet
          </Text>
        </Box>
        <Grid pos="relative" templateColumns={'repeat(2, 1fr)'} gap={6}>
          <Button
            {...(stakeDisabled === true
              ? {...btnStyle.btnDisable({colorMode})}
              : {...btnStyle.btnAble()})}
            isDisabled={stakeDisabled}
            fontSize={'14px'}
            opacity={loading === true ? 0.5 : 1}
            onClick={() => modalData('stake')}>
            Stake
          </Button>
          <Button
            {...(unstakeDisabled === true
              ? {...btnStyle.btnDisable({colorMode})}
              : {...btnStyle.btnAble()})}
            isDisabled={unstakeDisabled}
            fontSize={'14px'}
            opacity={loading === true ? 0.5 : 1}
            onClick={() => modalData('unstake')}>
            Unstake
          </Button>
          <Button
            {...(claimDisabled === true
              ? {...btnStyle.btnDisable({colorMode})}
              : {...btnStyle.btnAble()})}
            isDisabled={claimDisabled}
            fontSize={'14px'}
            opacity={loading === true ? 0.5 : 1}
            onClick={() => modalData('claim')}>
            Claim
          </Button>
          {manageDisabled === true ? (
            <Button
              {...(data.saleClosed || endSaleBtnDisabled === true
                ? {...btnStyle.btnDisable({colorMode})}
                : {...btnStyle.btnAble()})}
              isDisabled={endSaleBtnDisabled || data.saleClosed}
              fontSize={'14px'}
              opacity={loading === true ? 0.5 : 1}
              onClick={() =>
                data.miningEndTime !== undefined
                  ? closeSale({
                      userAddress: account,
                      vaultContractAddress: data.vault,
                      library,
                    })
                  : null
              }>
              {status === 'start' ? 'Manage' : 'End Sale'}
            </Button>
          ) : (
            <Button
              {...(manageBtnDisabled === true
                ? {...btnStyle.btnDisable({colorMode})}
                : {...btnStyle.btnAble()})}
              isDisabled={manageBtnDisabled}
              fontSize={'14px'}
              opacity={loading === true ? 0.5 : 1}
              onClick={() => modalData('manage')}>
              Manage
            </Button>
          )}

          {loading === true ? (
            <Flex
              pos="absolute"
              zIndex={100}
              w="100%"
              h="100%"
              alignItems="cneter"
              justifyContent="center">
              <Center>
                <LoadingComponent></LoadingComponent>
              </Center>
            </Flex>
          ) : null}
        </Grid>
      </Box>
    </Container>
  );
};
