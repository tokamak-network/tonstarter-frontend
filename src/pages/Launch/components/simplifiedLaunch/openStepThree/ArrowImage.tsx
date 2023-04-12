// import {Image} from '@chakra-ui/react';
import {useState} from 'react';
import { Image } from '@chakra-ui/react';

type ArrowImageProp = {
  img: string;
  hoverImg: string;
  additionalStyles?: any;
};

const ArrowImage: React.FC<ArrowImageProp> = (props) => {
  const { img, hoverImg, additionalStyles} = props;
  const [isHover, setIsHover] = useState(false);
  return (
    <Image
      src={!isHover ? img : hoverImg}
      alt={img}
      style={{cursor: 'pointer', ...additionalStyles}}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      ></Image>
  );
};

export default ArrowImage;
