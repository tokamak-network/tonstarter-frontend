import {toChecksumAddress} from 'web3-utils';
import * as Yup from 'yup';

const ProjectSchema = Yup.object().shape({
  tokenName: Yup.string().required('Required').max(15),
  projectName: Yup.string().required('Required'),
  owner: Yup.string()
    .required('Required')
    .test('onwer-check', 'Invalid Onwer Address', (value) => {
      try {
        if (value) {
          const result = toChecksumAddress(String(value));
          if (!result) {
            return false;
          }
        }
        return true;
      } catch (e) {
        return false;
      }
    }),
  tokenOwnerAccount: Yup.string()
    .required('Required')
    .test('onwer-check', 'Invalid Onwer Address', (value) => {
      try {
        if (value) {
          const result = toChecksumAddress(String(value));
          if (!result) {
            return false;
          }
        }
        return true;
      } catch (e) {
        return false;
      }
    }),
  tokenSymbol: Yup.string().required('Required').max(8),
  tokenSymbolImage: Yup.string().url(),
  sector: Yup.string().required('Required'),
  totalSupply: Yup.number().required('Required'),
  website: Yup.string().url(),
  medium: Yup.string().url(),
  telegram: Yup.string().url(),
  twitter: Yup.string().url(),
  discord: Yup.string().url(),
});

export default ProjectSchema;
