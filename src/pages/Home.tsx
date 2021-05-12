import {Box} from '@chakra-ui/layout';
import {FC, HTMLAttributes, useEffect, useState} from 'react';
import {ethers} from 'ethers';
import {useSelector, useDispatch} from 'react-redux';
import {add} from 'store/features/user/userSlice';
import number from 'utils/number';
import {useContract} from '../hooks/useContract';
export interface HomeProps extends HTMLAttributes<HTMLDivElement> {
  classes?: string;
}

const test = async (result: any) => {
  const dd = await result.totalSupply();
  console.log(dd);
};

export const Home: React.FC<HomeProps> = (prop) => {
  // const test = useSelector((state) => state);
  // // const testGo = useDispatch();
  // // const gogo = () => testGo(add(10));
  // console.log(test);

  const contractAbi = [
    'function approve(address, uint256) returns (bool)',
    // view functions
    'function balanceOf(address) view returns (uint256)',
    'function totalSupply() view returns (uint256)',
  ];

  const [testContract, getTestContract] = useState('');
  const contract = useContract(
    '0x44d4f5d89e9296337b8c48a332b3b2fb2c190cd0',
    contractAbi,
  );

  // useEffect(() => {
  //   if (!testContract) {
  //     test(contract);
  //   }
  // }, []);

  const test = async (contract: any) => {
    const result = await contract?.totalSupply();
    getTestContract(result);
  };

  //  if (!testContract) {
  //    test(contract);
  //  }

  return (
    <Box>
      Home
      <button onClick={() => console.log(testContract)}>Test</button>
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
