import {Box} from 'rebass';

type StepTitleProp = {
  title: string;
};

const StepTitle: React.FC<StepTitleProp> = (prop) => {
  const {title} = prop;
  return (
    <Box fontSize={20} color={'black.300'}>
      {title}
    </Box>
  );
};

export default StepTitle;
