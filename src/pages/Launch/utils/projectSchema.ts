import * as Yup from 'yup';

const ProjectSchema = Yup.object().shape({
  tokenName: Yup.string().required('Required'),
  projectName: Yup.string().required('Required'),
  owner: Yup.string().required('Required'),
  tokenSymbol: Yup.number().required('Required'),
  tokenSupply: Yup.string().required('Required'),
});

export default ProjectSchema;
