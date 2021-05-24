import {FC} from 'react';
import {Box, Text, useTheme} from '@chakra-ui/react';

type HeadProps = {
  title?: string;

};

export const PageHeader: FC<HeadProps> = ({title}) => {
  const theme = useTheme();

  return (
    <Box>
        <Text textAlign={'center'} fontWeight={'bold'} fontSize={'38'} fontFamily={ 'heading'} className={'page-title'}>
        {title}
        </Text>
        
    </Box>
  );
};
