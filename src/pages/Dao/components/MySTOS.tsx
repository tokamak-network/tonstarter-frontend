import {
  Flex,
  Text,
  Button,
  Box,
  useColorMode,
  useTheme,
} from '@chakra-ui/react';
import {getUserSTOSBalance} from 'client/getUserBalance';
import {useEffect} from 'react';
import {useState} from 'react';
import {useDispatch} from 'react-redux';
import {User} from 'store/app/user.reducer';
import {openModal} from 'store/modal.reducer';

type PropsType = {
  userData: User;
  signIn: boolean;
};

export const MySTOS = (props: PropsType) => {
  const {userData, signIn} = props;
  const dispatch = useDispatch();
  const [balance, setbalance] = useState('-');
  const theme = useTheme();
  const {btnStyle, btnHover} = theme;
  const {colorMode} = useColorMode();
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
    const {address, library} = userData;
    async function getTosBalance() {
      const res = await getUserSTOSBalance({account: address, library});
      if (res !== undefined) {
        setbalance(res);
      }
    }
    if (signIn) {
      getTosBalance();
    } else {
      setbalance('-');
    }
  }, [signIn, userData]);

  return (
    <Flex
      alignItems="center"
      justifyContent="space-between"
      fontFamily={theme.fonts.roboto}>
      <Box fontWeight={'bold'}>
        <Text
          fontSize={'0.875em'}
          color={themeDesign.fontColorTitle[colorMode]}>
          My sTOS
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
        _hover={btnHover.checkDisable({signIn})}
        onClick={() =>
          dispatch(
            openModal({
              type: 'dao_manage',
              data: {userData, userTosBalance: balance},
            }),
          )
        }>
        Manage
      </Button>
    </Flex>
  );
};