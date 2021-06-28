import {Head} from 'components/SEO';
import {Fragment} from 'react';
import {Animation} from './Animation';
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
