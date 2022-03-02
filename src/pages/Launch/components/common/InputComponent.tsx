import {Box, Flex, Input, Text, useColorMode} from '@chakra-ui/react';
import {ErrorMessage, Field, useFormikContext} from 'formik';
import './input.css';

type InputComponentProps = {
  name: string;
  placeHolder: string;
  nameDisplay?: boolean;
  inputStyle?: {};
};

const InputComponentStyle = {
  color: {
    light: '#2d3136',
    dark: '#2d3136',
  },
};

const InputComponent: React.FC<InputComponentProps> = (props) => {
  const {name, placeHolder, nameDisplay, inputStyle} = props;
  const {errors} = useFormikContext();
  const {colorMode} = useColorMode();
  const title = name
    .split(/(?=[A-Z])/)
    .map((e) => `${e.charAt(0).toUpperCase() + e.slice(1)} `);

  return (
    <Flex flexDir={'column'} fontSize={13} pos={'relative'}>
      {nameDisplay === false ? (
        <></>
      ) : (
        <Text h={18} mb={2.5} color={InputComponentStyle.color[colorMode]}>
          {title}
        </Text>
      )}
      <Field name={name}>
        {(
          //@ts-ignore
          {field, meta: {touched, error}},
        ) => {
          //@ts-ignore
          const isError = errors[name] === undefined ? false : true;
          return (
            <Input
              className={
                isError
                  ? 'input-err'
                  : colorMode === 'light'
                  ? 'input-light'
                  : 'input-dark'
              }
              {...field}
              id={name}
              h={'32px'}
              _focus={{}}
              placeholder={`input ${name}`}
              {...inputStyle}></Input>
          );
        }}
      </Field>
      <Box pos={'absolute'} right={0}>
        <ErrorMessage
          name={name}
          render={(msg) => (
            <Text color={'red.100'}>{`Invalid ${name}`}</Text>
          )}></ErrorMessage>
      </Box>
    </Flex>
  );
};

export default InputComponent;
