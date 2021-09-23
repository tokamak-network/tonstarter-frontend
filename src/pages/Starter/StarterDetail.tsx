import {Grid, Box, useColorMode, useTheme, Text, Flex} from '@chakra-ui/react';
import {useRouteMatch, useParams} from 'react-router-dom';

export const StarterDetail = () => {
  console.log('**StarterDetail');
  const {id}: {id: string} = useParams();
  const {colorMode} = useColorMode();
  const theme = useTheme();

  const {STATER_STYLE} = theme;

  console.log(id);

  return (
    <Flex mt={'122px'} px={363}>
      <Flex
        {...STATER_STYLE.containerStyle({colorMode})}
        w={'100%'}
        h={'367px'}
        _hover={''}
        cursor=""></Flex>
    </Flex>
  );
};
