import {
  Flex,
  Text,
  Button,
  Box,
  useColorMode,
  useTheme,
} from '@chakra-ui/react';
import {getUserTOSStaked} from 'client/getUserBalance';
import {useAppDispatch} from 'hooks/useRedux';
import {useUser} from 'hooks/useUser';
import {useEffect} from 'react';
import {useState} from 'react';
import {openModal} from 'store/modal.reducer';

type PropsType = {
  stakeList: any;
  transactionType: string | undefined;
  blockNumber: number | undefined;
};

export const MyStaked = (props: PropsType) => {
  const {stakeList, transactionType, blockNumber} = props;
  const [balance, setbalance] = useState('-');
  const [isEnd, setIsEnd] = useState(true);
  const theme = useTheme();
  const {btnStyle, btnHover} = theme;
  const {colorMode} = useColorMode();
  const {account, library, signIn} = useUser();

  const dispatch = useAppDispatch();
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

  useEffect(() => {
    async function getTosBalance() {
      const res = await getUserTOSStaked({account, library});
      if (res !== undefined) {
        setbalance(res);
      }
    }
    if (account) {
      getTosBalance();
      stakeList.map((stake: any) => {
        if (stake.end === true) {
          return setIsEnd(false);
        }
        return null;
      });
    } else {
      setbalance('-');
    }
  }, [signIn, account, library, stakeList]);

  useEffect(() => {
    async function getTosBalance() {
      const res = await getUserTOSStaked({account, library});
      if (res !== undefined) {
        setbalance(res);
      }
    }
    if (transactionType === 'Dao') {
      getTosBalance();
    }
    /*eslint-disable*/
  }, [transactionType, blockNumber]);

  return (
    <Flex
      alignItems="center"
      justifyContent="space-between"
      fontFamily={theme.fonts.roboto}>
      <Box fontWeight={'bold'}>
        <Text
          fontSize={'0.875em'}
          color={themeDesign.fontColorTitle[colorMode]}>
          My Staked
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
        {...(signIn && !isEnd
          ? {...btnStyle.btnAble()}
          : {...btnStyle.btnDisable({colorMode})})}
        w={'150px'}
        h="38px"
        p={0}
        fontSize={'14px'}
        fontWeight={400}
        isDisabled={!signIn || isEnd}
        _hover={btnHover.backgroundColor}
        onClick={() =>
          dispatch(
            openModal({
              type: 'dao_unstake',
              data: {userTosBalance: balance, lockList: stakeList},
            }),
          )
        }>
        UnStake
      </Button>
    </Flex>
  );
};
