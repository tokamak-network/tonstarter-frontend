import {
  Flex,
  Text,
  Button,
  Box,
  useColorMode,
  useTheme,
} from '@chakra-ui/react';
import {useAppDispatch} from 'hooks/useRedux';
import {useEffect} from 'react';
import {useState} from 'react';
import {User} from 'store/app/user.reducer';
import {openModal} from 'store/modal.reducer';

type PropsType = {
  data: User;
};

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

export const AvailableBalance = (props: PropsType) => {
  const {data} = props;
  const [balance, setbalance] = useState('-');
  const theme = useTheme();
  const {colorMode} = useColorMode();
  const dispatch = useAppDispatch();

  useEffect(() => {}, []);

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
        w={'150px'}
        h="38px"
        p={0}
        bg="blue.500"
        color="white.100"
        fontSize={'14px'}
        fontWeight={400}
        _hover={theme.btnHover}
        onClick={() => dispatch(openModal({type: 'dao_stake'}))}>
        Stake
      </Button>
    </Flex>
  );
};
