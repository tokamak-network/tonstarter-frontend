import {Button, Flex, useColorMode} from '@chakra-ui/react';
import {saveProject, editProject} from '@Launch/utils/saveProject';
import {useFormikContext} from 'formik';
import {useActiveWeb3React} from 'hooks/useWeb3';
import {useRouteMatch} from 'react-router';
import {Box} from 'rebass';

type StepTitleProp = {
  title: string;
  fontSize?: number;
  isSaveButton?: boolean;
  lineHeight?: number;
};

const StepTitle: React.FC<StepTitleProp> = (prop) => {
  const {title, fontSize, isSaveButton, lineHeight} = prop;
  const {colorMode} = useColorMode();
  const {account} = useActiveWeb3React();
  const {values} = useFormikContext();
  const match = useRouteMatch();
  const {url} = match;
  const isExist = url.split('/')[2];

  return (
    <Flex
      justifyContent={'space-between'}
      h={'100%'}
      textAlign="center"
      verticalAlign={'middle'}
      lineHeight={lineHeight || '36px'}>
      <Box
        fontSize={fontSize || 20}
        color={colorMode === 'light' ? '#304156' : 'white.100'}
        fontWeight={600}>
        {title}
      </Box>
    </Flex>
  );
};

export default StepTitle;
