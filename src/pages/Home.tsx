import {Box} from '@chakra-ui/layout';
import {FC, HTMLAttributes} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {add} from 'store/features/user/userSlice';
import number from '../utils/number';
export interface HomeProps extends HTMLAttributes<HTMLDivElement> {
  classes?: string;
}

export const Home: React.FC<HomeProps> = (prop) => {
  const test = useSelector((state) => state);
  const testGo = useDispatch();
  const gogo = () => testGo(add(10));
  const num = number({type: 'TON', amount: '1234940000000000000000'});
  const num2 = number({
    type: 'TON',
    amount: '1234940000000000000000',
    optRound: 'roundDown',
  });
  const num3 = number({
    type: 'TON',
    amount: '1234940000000000000000',
    optRound: 'roundup',
  });
  console.log(num);
  console.log(num2);
  console.log(num3);

  return (
    <Box>
      Home
      <button onClick={() => gogo()}>Test</button>
    </Box>
  );
};

// function mapStateToProps(state: any) {
//   // return {good: state};
// }

// function mapDispatchToProps(dispatch) {
//   // return {test: (args) => dispatch(add(args))};
// }

// export default connect(mapStateToProps, mapDispatchToProps)(Home);
