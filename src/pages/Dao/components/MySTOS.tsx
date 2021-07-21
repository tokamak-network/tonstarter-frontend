import {
  Flex,
  Text,
  Button,
  Box,
  useColorMode,
  useTheme,
} from '@chakra-ui/react';
import {useEffect} from 'react';
import {useState} from 'react';
import {User} from 'store/app/user.reducer';

type PropsType = {
  userData: User;
};

export const MySTOS = (props: PropsType) => {
  const {userData} = props;
  const [balance, setbalance] = useState('-');
  const theme = useTheme();
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
        w={'150px'}
        h="38px"
        p={0}
        bg="blue.500"
        color="white.100"
        fontSize={'14px'}
        fontWeight={400}
        _hover={theme.btnHover}>
        Manage
      </Button>
    </Flex>
  );
};
