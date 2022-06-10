import {
  Flex,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputStepper,
  Text,
} from '@chakra-ui/react';
import {saveTempVaultData, selectLaunch} from '@Launch/launch.reducer';
import {useAppDispatch, useAppSelector} from 'hooks/useRedux';
import {useEffect, useState} from 'react';

type NumberInputStepProps = {
  valueProp: string | number;
  formikName: string;
};

const NumberInputField = () => {
  return <></>;
};

const NumberInputStep: React.FC<NumberInputStepProps> = ({
  valueProp,
  formikName,
}) => {
  const dispatch = useAppDispatch();
  const {
    data: {tempVaultData},
  } = useAppSelector(selectLaunch);
  const [inputValue, setInputValue] = useState(valueProp);

  return (
    <NumberInput
      w={'100%'}
      defaultValue={valueProp}
      step={1}
      min={5}
      max={50}
      onChange={(e: any) => {
        dispatch(
          saveTempVaultData({
            data: {
              ...tempVaultData,
              [formikName]: Number(e),
            },
          }),
        );
        return setInputValue(Number(e));
      }}>
      <Flex alignItems={'center'}>
        <Text mr={'35px'}>{inputValue} %</Text>
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </Flex>
    </NumberInput>
  );
};

export {NumberInputField, NumberInputStep};
