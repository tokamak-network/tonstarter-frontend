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
import {DEFAULT_NETWORK} from 'constants/index';
import {useActiveWeb3React} from 'hooks/useWeb3';
import {useRouteMatch, useHistory, Redirect} from 'react-router-dom';

import {useEffect} from 'react'
const CreateMain = () => {
  const {
    data: {mode},
  } = useAppSelector(selectLaunch);

  let historyObj = useHistory();

  useEffect(() => {
    //@ts-ignore
    const unBlock = historyObj.block((loc, action) => {
      if (action === 'POP' || action === 'PUSH') {
        return window.confirm('Are you sure you want to go back?\nClick the Save button to save your progress before you leave.' );
      }
    });
    return () => unBlock();
  }, [historyObj]);

  useEffect(() => {
    // Add the event listener to the window object
    function handleBeforeUnload(event:any) {
      // Cancel the event
      event.preventDefault();
      // Prompt the user with a confirmation dialog
      event.returnValue = '';
      return '';
    }

    // Add the event listener to the window object
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Remove the event listener when the component is unmounted
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);
  return (
    <Flex>
      { mode === 'simplified' ? <SimplifiedMainScreen /> : <MainScreen />}
    </Flex>
  );
};

export default CreateMain;
