import {motion} from 'framer-motion';
import {Image} from '@chakra-ui/react';
import tosSymbol from 'assets/svgs/tos_symbol.svg';

export const LoadingComponent = (props: {w?: string; h?: string}) => {
  const {w, h} = props;
  //@ts-ignore
  return (
    <motion.div
      style={{width: w || '2em', height: h}}
      initial={{rotate: 0}}
      animate={{rotate: 360}}
      transition={{flip: Infinity, duration: 2, ease: 'easeInOut'}}>
      <Image src={tosSymbol}></Image>
    </motion.div>
  );
};
