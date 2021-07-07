import {motion} from 'framer-motion';
import {Image} from '@chakra-ui/react';
import tosSymbol from 'assets/svgs/tos_symbol.svg';

export const LoadingComponent = () => {
  //@ts-ignore
  return (
    <motion.div
      style={{width: '2em'}}
      initial={{rotate: 0}}
      animate={{rotate: 360}}
      transition={{flip: Infinity, duration: 2, ease: 'easeInOut'}}>
      <Image src={tosSymbol}></Image>
    </motion.div>
  );
};
