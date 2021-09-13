import {
  Flex,
  Text,
  Button,
  Box,
  useColorMode,
  useTheme,
} from '@chakra-ui/react';
import {getUserSTOSBalance} from 'client/getUserBalance';
import {useActiveWeb3React} from 'hooks/useWeb3';
import {useEffect} from 'react';
import {useState} from 'react';
import {openModal} from 'store/modal.reducer';
import {selectDao} from '../dao.reducer';
import {useAppDispatch, useAppSelector} from 'hooks/useRedux';

export const MySTOS = () => {
  const dispatch = useAppDispatch();
  const {data: stakeList} = (useAppSelector as any)(selectDao);
  const [balance, setbalance] = useState('-');
  const [btnDisabled, setBtnDisabled] = useState(true);
  const theme = useTheme();
  const {btnStyle, btnHover} = theme;
  const {colorMode} = useColorMode();
  const {account, library, active} = useActiveWeb3React();
  const filteredStakeList = stakeList.filter((e: any) => e.end === false);

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
      setBtnDisabled(true);
      if (res !== undefined) {
        setbalance(res);
        if (filteredStakeList.length !== 0) {
          setBtnDisabled(false);
        }
      }
    }
    if (account) {
      getTosBalance();
    } else {
      setbalance('-');
    }
    /*eslint-disable*/
  }, [active, account, library, dispatch, stakeList]);

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
        {...(active && !btnDisabled
          ? {...btnStyle.btnAble()}
          : {...btnStyle.btnDisable({colorMode})})}
        w={'150px'}
        h="38px"
        p={0}
        fontSize={'14px'}
        fontWeight={400}
        isDisabled={!active || btnDisabled}
        _hover={btnHover.backgroundColor}
        onClick={() =>
          dispatch(
            openModal({
              type: 'dao_manage',
              data: {userTosBalance: balance, stakeList: filteredStakeList},
            }),
          )
        }>
        Manage
      </Button>
    </Flex>
  );
};
