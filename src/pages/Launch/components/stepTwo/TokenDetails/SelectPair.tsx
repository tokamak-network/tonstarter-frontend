import {Select} from '@chakra-ui/react';
import {Projects} from '@Launch/types';
import {useFormikContext} from 'formik';
import {useState} from 'react';

type TokenPair = 'Eth' | 'DAI' | 'USDC';

const SelectPair = () => {
  const [pair, setPair] = useState<string | undefined>(undefined);
  const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPair(e.target.value);
  };
  const pairList: TokenPair[] = ['Eth', 'DAI', 'USDC'];
  const {values} = useFormikContext<Projects['CreateProject']>();

  return (
    <Select
      onChange={onChange}
      h={'32px'}
      fontSize={13}
      defaultValue={pair === undefined ? 'Custom' : pair}>
      <option value={'Custom'}>Custom</option>
      {pairList.map((pairName: TokenPair) => {
        const pairAddress = '';
        return (
          <option value={pairName}>
            {pairName}-{values.tokenSymbol}
          </option>
        );
      })}
    </Select>
  );
};

export default SelectPair;
