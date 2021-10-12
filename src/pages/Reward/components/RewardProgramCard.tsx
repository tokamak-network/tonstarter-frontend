import {FC, useState, useMemo, useEffect, useRef} from 'react';
import {
    Text,
    Flex,
    Select,
    Box,
    useTheme,
    useColorMode,
  } from '@chakra-ui/react';
  import {useAppSelector} from 'hooks/useRedux';

  import {
    chakra,
    // useTheme
  } from '@chakra-ui/react';


  const themeDesign = {
    border: {
      light: 'solid 1px #dfe4ee',
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
  type RewardProgramCardProps = {
      name: string
  };

  export const RewardProgramCard: FC<RewardProgramCardProps> =({name }) =>{
        const {colorMode} = useColorMode();
        const theme = useTheme();
        const {REWARD_STYLE} = theme;
        return (
            <Flex {...REWARD_STYLE.containerStyle({colorMode})}>
               <Text>{name}</Text>
              <Flex>
            
              </Flex>
            </Flex>
        )
  }