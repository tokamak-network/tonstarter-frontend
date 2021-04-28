import {Box} from '@chakra-ui/layout';
import {FC, HTMLAttributes} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {add} from 'store/features/user/userSlice';
// import {add, initialize} from 'store/features/userSlice';
export interface HomeProps extends HTMLAttributes<HTMLDivElement> {
  classes?: string;
}

export const Home: React.FC<HomeProps> = (prop) => {
  const test = useSelector((state) => state);
  const testGo = useDispatch();
  const gogo = () => testGo(add(10));

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
