import {Flex} from '@chakra-ui/layout';
import {Switch, Route} from 'react-router-dom';
import {StarterMain} from './StartetMain';

export const Starter = () => {
  return (
    <Flex mt={'72px'}>
      <Switch>
        <Route exact path="/starter" component={StarterMain} />
        {/* <Route exact path=`/starter/${}` component={FLDstarter} />
      <Route exact path="/starter" component={FLDstarter} /> */}
      </Switch>
    </Flex>
  );
};
