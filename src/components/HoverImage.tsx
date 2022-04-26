// import {Image} from '@chakra-ui/react';
import {useState} from 'react';

type HoverImageProp = {
  action?: () => void;
  img: string;
  hoverImg: string;
};

const HoverImage: React.FC<HoverImageProp> = (props) => {
  const {action, img, hoverImg} = props;
  const [isHover, setIsHover] = useState(false);
  return (
    <img
      src={!isHover ? img : hoverImg}
      onClick={action}
      alt={img}
      style={{cursor: 'pointer'}}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}></img>
  );
};

export default HoverImage;
