import {Button, Flex, useColorMode} from '@chakra-ui/react';
import {saveProject, editProject} from '@Launch/utils/saveProject';
import {useFormikContext} from 'formik';
import {useActiveWeb3React} from 'hooks/useWeb3';
import {useRouteMatch} from 'react-router-dom';
import {Box} from 'rebass';

type StepTitleProp = {
  title: string;
  fontSize?: number;
  isSaveButton?: boolean;
  lineHeight?: number;
  err?: boolean;
  fontStyle?: {};
};

const StepTitle: React.FC<StepTitleProp> = (prop) => {
  const {title, fontSize, isSaveButton, lineHeight, err, fontStyle} = prop;
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
        color={
          err === true
            ? '#ff3b3b'
            : colorMode === 'light'
            ? '#304156'
            : 'white.100'
        }
        fontWeight={600}
        {...fontStyle}>
        {title}
      </Box>
      {isSaveButton && (
        <Button
          w={'120px'}
          h={'38px'}
          fontSize={14}
          color={'white.100'}
          _hover={{}}
          bg={colorMode ? 'blue.500' : 'blue.500'}
          // disabled={isDisable || isSubmitting}
          onClick={() =>
            account && isExist === 'createproject'
              ? saveProject(values, account)
              : editProject(values, account as string, isExist)
          }>
          Save
        </Button>
      )}
    </Flex>
  );
};

export default StepTitle;
