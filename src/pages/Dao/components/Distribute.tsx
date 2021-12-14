import {
  Flex,
  Text,
  Button,
  Box,
  useColorMode,
  useTheme,
} from '@chakra-ui/react';
import {useActiveWeb3React} from 'hooks/useWeb3';
import {useEffect} from 'react';
import {useState} from 'react';
import {openModal} from 'store/modal.reducer';
import {useAppDispatch} from 'hooks/useRedux';

export const Distribute = () => {
  const dispatch = useAppDispatch();
  const [btnDisabled, setBtnDisabled] = useState(true);
  const theme = useTheme();
  const {btnStyle, btnHover} = theme;
  const {colorMode} = useColorMode();
  const {account, library, active} = useActiveWeb3React();

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
    setBtnDisabled(!active);
    /*eslint-disable*/
  }, [active, account, library]);

  return (
    <Flex
      alignItems="center"
      justifyContent="space-between"
      fontFamily={theme.fonts.roboto}
      height={'51px'}>
      <Box fontWeight={'bold'}>
        <Flex color={themeDesign.fontColor[colorMode]}>
          <Text fontSize={'1.250em'} mr="5px">
            Airdrop Distribution
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
              type: 'Admin_Distribute',
              data: {},
            }),
          )
        }>
        Distribute
      </Button>
    </Flex>
  );
};
