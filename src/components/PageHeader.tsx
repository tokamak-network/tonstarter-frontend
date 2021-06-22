import {FC} from 'react';
import {Heading, Box, Text, Container,useTheme} from '@chakra-ui/react';
import {useColorMode} from '@chakra-ui/react';

type HeadProps = {
  title?: string;
  subtitle?: string;
};

export const PageHeader: FC<HeadProps> = ({title, subtitle}) => {
  const {colorMode} = useColorMode();
  const theme = useTheme();
  return (
    <Container pt={12}>
      <Box textAlign={'center'}>
        <Heading
          fontWeight={'bold'}
          fontSize={'38'}
          className={'page-title'}
          color={theme.colors.gray[150]}
          fontFamily={theme.fonts.fld}>
          {title}
        </Heading>

        <Text fontWeight={'bold'}
          fontSize={'20'}
          className={'page-title'}
          color={colorMode === 'light' ? theme.colors.gray[75] : 'currentcolor'}
          fontFamily={theme.fonts.fld}>{subtitle}</Text>
      </Box>
    </Container>
  );
};
