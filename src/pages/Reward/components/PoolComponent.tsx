import {
    Flex,
    Text,
    Button,
    Box,
    useColorMode,
    useTheme,
    Container,
    Select,
  } from '@chakra-ui/react';
  
  import {FC, useState, useEffect} from 'react';
  import {useAppSelector} from 'hooks/useRedux';
  import {useActiveWeb3React} from 'hooks/useWeb3';
  import {CustomInput} from 'components/Basic';
  
  const themeDesign = {
    border: {
      light: 'solid 1px #d7d9df',
      dark: 'solid 1px #535353',
    },
    font: {
      light: 'black.300',
      dark: 'gray.475',
    },
    tosFont: {
      light: 'gray.250',
      dark: 'black.100',
    },
  };
  type PoolComponentProps = {
    pools: any[];
  };
  
  export const PoolComponent: FC<PoolComponentProps> = ({pools}) => {
    const {colorMode} = useColorMode();
    const theme = useTheme();
    const {account, library} = useActiveWeb3React();
    return (
      <Container>
        <Box
          border={themeDesign.border[colorMode]}
          h={'300px'}
          w={'400px'}
          p={'10px'}>
         </Box>
      </Container>
    );
  };
  