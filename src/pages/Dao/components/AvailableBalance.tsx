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
import {useUser} from 'hooks/useUser';
import {useEffect} from 'react';
import {useState} from 'react';
import {openModal} from 'store/modal.reducer';

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
  const theme = useTheme();
  const {btnStyle, btnHover} = theme;
  const {colorMode} = useColorMode();
  const dispatch = useAppDispatch();
  const {account, library, signIn} = useUser();

  useEffect(() => {
    async function getTosBalance() {
      if (account) {
        const res = await getUserTosBalance(account, library);
        if (res !== undefined) {
          setbalance(res);
        }
      }
    }
    if (signIn) {
      getTosBalance();
    } else {
      setbalance('-');
    }
  }, [signIn, account, library]);

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
        {...(signIn
          ? {...btnStyle.btnAble()}
          : {...btnStyle.btnDisable({colorMode})})}
        w={'150px'}
        h="38px"
        p={0}
        fontSize={'14px'}
        fontWeight={400}
        isDisabled={!signIn}
        _hover={btnHover.backgroundColor}
        onClick={() =>
          dispatch(
            openModal({
              type: 'dao_stake',
              data: {userTosBalance: balance},
            }),
          )
        }>
        Stake
      </Button>
    </Flex>
  );
};
