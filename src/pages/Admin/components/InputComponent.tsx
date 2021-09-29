import {useInput} from '@Admin/hooks/useInput';
import {Flex, Input} from '@chakra-ui/react';

type InputComponentProp = {
  name: string;
};

export const InputComponent = (prop: InputComponentProp) => {
  const {name} = prop;
  const {value, onChange} = useInput(undefined);
  return (
    <Flex flexDir={'column'}>
      <Text>{name}</Text>
      <Input onChange={onChange}></Input>
    </Flex>
  );
};
