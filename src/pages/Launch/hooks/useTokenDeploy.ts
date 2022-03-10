import {useState} from 'react';

const useTokenDeploy = () => {
  const [isError, setError] = useState(false);
  return {isError, setError};
};

export default useTokenDeploy;
