import {
  ButtonGroup,
  Text,
  Image,
  Flex,
  Link,
  useTheme,
  useColorMode,
  Tooltip,
} from '@chakra-ui/react';
import SimplifiedMainScreen from './SimplifiedMainScreen';
import MainScreen from './MainScreen';
import {selectLaunch, setMode} from '@Launch/launch.reducer';
import {useAppDispatch, useAppSelector} from 'hooks/useRedux';

const CreateMain = () => {
  const {
    data: {mode},
  } = useAppSelector(selectLaunch);

  console.log('mode', mode);

  return (
    <Flex>
      {mode === 'simplified' ? <SimplifiedMainScreen /> : <MainScreen />}
    </Flex>
  );
};

export default CreateMain;
