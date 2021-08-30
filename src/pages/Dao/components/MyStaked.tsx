import {
  Flex,
  Text,
  Button,
  Box,
  useColorMode,
  useTheme,
} from '@chakra-ui/react';
import {getUserTOSStaked} from 'client/getUserBalance';
import {useAppDispatch, useAppSelector} from 'hooks/useRedux';
import {useUser} from 'hooks/useUser';
import {useEffect, useState} from 'react';
import {openModal} from 'store/modal.reducer';
import {useBlockNumber} from 'hooks/useBlock';
import {selectDao} from '../dao.reducer';

export const MyStaked = () => {
  const dispatch = useAppDispatch();
  const {data: stakeList} = (useAppSelector as any)(selectDao);
  const [balance, setbalance] = useState('-');
  const [isEnd, setIsEnd] = useState(true);
  const theme = useTheme();
  const {btnStyle, btnHover} = theme;
  const {colorMode} = useColorMode();
  const {account, library, signIn} = useUser();
  const {blockNumber} = useBlockNumber();

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
      setIsEnd(true);
      stakeList.map((stake: any) => {
        if (stake.end === true) {
          return setIsEnd(false);
        }
        return null;
      });
    } else {
      setbalance('-');
    }
  }, [signIn, account, library, stakeList, dispatch, blockNumber]);

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
