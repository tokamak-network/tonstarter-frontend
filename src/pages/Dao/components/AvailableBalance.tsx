import {
  Flex,
  Text,
  Button,
  Box,
  useColorMode,
  useTheme,
} from '@chakra-ui/react';
import {getUserTosBalance} from 'client/getUserBalance';
import {useAppDispatch} from 'hooks/useRedux';
import {useBlockNumber} from 'hooks/useBlock';
import {useActiveWeb3React} from 'hooks/useWeb3';
import {useState, useEffect} from 'react';
import {openModal} from 'store/modal.reducer';
import {checkApprove, getAllowance} from '../actions/';

const themeDesign = {
  fontColorTitle: {
    light: 'gray.400',
    dark: 'gray.425',
  },
  fontColor: {
    light: 'black.300',
    dark: 'white.200',
  },
};

export const AvailableBalance = () => {
  const [balance, setbalance] = useState('-');
  const [btnType, setBtnType] = useState<string>('-');
  const theme = useTheme();
  const {btnStyle, btnHover} = theme;
  const {colorMode} = useColorMode();
  const dispatch = useAppDispatch();
  const {account, library, active} = useActiveWeb3React();
  const {blockNumber} = useBlockNumber();

  useEffect(() => {
    async function getTosBalance() {
      if (account) {
        const res = await getUserTosBalance(account, library);
        if (res !== undefined) {
          setbalance(res);
        }
      }
    }
    if (account) {
      getTosBalance();
    } else {
      setbalance('-');
    }
  }, [active, account, library, blockNumber, dispatch]);

  //set btn condition
  useEffect(() => {
    async function checkApproved(account: string, library: any) {
      const isApproved = await checkApprove(account, library);
      setBtnType(isApproved === true ? 'Stake' : 'Approve');
    }

    if (account && library) {
      checkApproved(account, library);
    }
  }, [active, account, library, blockNumber]);

  return (
    <Flex
      alignItems="center"
      justifyContent="space-between"
      fontFamily={theme.fonts.roboto}>
      <Box fontWeight={'bold'}>
        <Text
          fontSize={'0.875em'}
          color={themeDesign.fontColorTitle[colorMode]}>
          Available Balance
        </Text>
        <Flex color={themeDesign.fontColor[colorMode]}>
          <Text fontSize={'1.250em'} mr="5px">
            {balance}
          </Text>
          <Text fontSize={'0.813em'} alignSelf="flex-end" mb={0.5}>
            TOS
          </Text>
        </Flex>
      </Box>
      <Button
        // {...(!active || (btnType === 'Stake' && balance === '0.00')
        //   ? {...btnStyle.btnDisable({colorMode})}
        //   : {...btnStyle.btnAble()})}
        {...btnStyle.btnDisable({colorMode})}
        w={'150px'}
        h="38px"
        p={0}
        fontSize={'14px'}
        fontWeight={400}
        // isDisabled={!active || (btnType === 'Stake' && balance === '0.00')}
        isDisabled={true}
        _hover={btnHover.backgroundColor}
        onClick={() =>
          btnType === 'Approve' && account
            ? getAllowance(account, library)
            : dispatch(
                openModal({
                  type: 'dao_stake',
                  data: {userTosBalance: balance},
                }),
              )
        }>
        {btnType}
      </Button>
    </Flex>
  );
};
