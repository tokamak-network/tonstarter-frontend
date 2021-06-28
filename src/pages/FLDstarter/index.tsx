import {Container, Flex, SimpleGrid, Stack, Button} from '@chakra-ui/react';
import {Head} from 'components/SEO';
import {Fragment} from 'react';
import {TokenComponent} from './TokenComponent';
import {Animation} from './Animation';
import {data} from 'make';
import {IconTopArrow} from 'components/Icons/IconTopArrow';
export const FLDstarter = () => {
  // const [selected, setSelected] = useState<string>('hi');

  // const select = (selectedItem: string) => {
  //   setSelected(selectedItem);
  // }

  return (
    <Fragment>
      <Head title={'TON Starter'} />
      <Animation></Animation>
    </Fragment>
  );
};
