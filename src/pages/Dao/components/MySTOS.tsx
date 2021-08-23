import {
  Flex,
  Text,
  Button,
  Box,
  useColorMode,
  useTheme,
} from '@chakra-ui/react';
import {getUserSTOSBalance} from 'client/getUserBalance';
import {useUser} from 'hooks/useUser';
import {useEffect} from 'react';
import {useState} from 'react';
import {useDispatch} from 'react-redux';
import {openModal} from 'store/modal.reducer';

type PropsType = {
  stakeList: any;
};

export const MySTOS = (props: PropsType) => {
  const {stakeList} = props;
  console.log('**USER TOS STAKE LIST**');
  console.log(stakeList);
  const dispatch = useDispatch();
  const [balance, setbalance] = useState('-');
  const [btnDisabled, setBtnDisabled] = useState(true);
  const theme = useTheme();
  const {btnStyle, btnHover} = theme;
  const {colorMode} = useColorMode();
  const {account, library, signIn} = useUser();

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
      const res = await getUserSTOSBalance({account, library});
      console.log(res);
      if (res !== undefined) {
        setbalance(res);
        if (stakeList.length !== 0) {
          setBtnDisabled(false);
        }
      }
    }
    if (account) {
      getTosBalance();
    } else {
      setbalance('-');
    }
  }, [signIn, account, library, stakeList]);

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
            sTOS
          </Text>
        </Flex>
      </Box>
      <Button
        {...(signIn && !btnDisabled
          ? {...btnStyle.btnAble()}
          : {...btnStyle.btnDisable({colorMode})})}
        w={'150px'}
        h="38px"
        p={0}
        fontSize={'14px'}
        fontWeight={400}
        isDisabled={!signIn || btnDisabled}
        _hover={btnHover.backgroundColor}
        onClick={() =>
          dispatch(
            openModal({
              type: 'dao_manage',
              data: {userTosBalance: balance, stakeList},
            }),
          )
        }>
        Manage
      </Button>
    </Flex>
  );
};
