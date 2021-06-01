import React from 'react';
import {HTMLChakraProps, chakra, Container} from '@chakra-ui/react';
import {motion, HTMLMotionProps} from 'framer-motion';

type Merge<P, T> = Omit<P, keyof T> & T;
type MotionBoxProps = Merge<HTMLChakraProps<'div'>, HTMLMotionProps<'div'>>;

export const MotionBox: React.FC<MotionBoxProps> = motion(chakra.div);

export const Loader = () => {
  return (
    <Container h="100vh" d="flex" alignItems="center" justifyContent="center">
      <MotionBox
        as="aside"
        animate={{
          scale: [1, 2, 2, 1, 1],
          rotate: [0, 0, 270, 270, 0],
          borderRadius: ['20%', '20%', '50%', '50%', '20%'],
        }}
        transition={{
          duration: 2,
          ease: 'easeInOut',
          times: [0, 0.2, 0.5, 0.8, 1],
          repeat: Infinity,
          repeatType: 'loop',
          repeatDelay: 1,
        }}
        padding="2"
        bgGradient="linear(to-l, #7928CA, #FF0080)"
        width="12"
        height="12"
        display="flex"
      />
    </Container>
  );
};
