import {Formik, Form, Field, ErrorMessage} from 'formik';
import * as Yup from 'yup';
import {Flex, Text, Button, Input} from '@chakra-ui/react';
import {AdminObject, StepNameArrOneOf} from '@Admin/types';

type InputFormProps = {
  name: string;
};

type StepProps = {
  names: StepNameArrOneOf;
  data: AdminObject;
  next: ({}, final?: boolean) => void;
  lastStep: boolean;
};

const InputForm: React.FC<InputFormProps> = (props) => {
  const {name} = props;
  return (
    <Flex flexDir="column">
      <Text>{name}</Text>
      <Field name={name} />
      <ErrorMessage name={name} />
    </Flex>
  );
};

export const Step: React.FC<StepProps> = (props) => {
  const {names, data, lastStep} = props;
  const handleSubmit = (values: any) => {
    props.next(values, lastStep);
  };
  const obj = {};
  const validatationSchema = names.map((name: any) => {
    //@ts-ignore
    const nameType = typeof data[name];
    if (nameType === 'string') {
      //@ts-ignore
      return (obj[name] = Yup.string().required().label(name));
    }
    if (nameType === 'number') {
      //@ts-ignore
      return (obj[name] = Yup.number().required().label(name));
    }
    //@ts-ignore
    return (obj[name] = Yup.boolean().required().label(name));
  });

  const stepOneValidationSchema = Yup.object({
    ...obj,
  });

  return (
    <Formik
      validationSchema={stepOneValidationSchema}
      initialValues={data}
      onSubmit={handleSubmit}>
      {() => (
        <Form>
          {names.map((name: string) => {
            return <InputForm name={name}></InputForm>;
          })}
          <Button type="submit">Next</Button>
        </Form>
      )}
    </Formik>
  );
};
