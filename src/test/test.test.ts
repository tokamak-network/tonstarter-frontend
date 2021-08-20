import puppeteer from 'puppeteer';
import dappetter from '@sriharikapu/dappetter';

test('**GET METAMASK**', async () => {
  const browser = await dappetter.launch(puppeteer);
  const metamask = await dappetter.getMetamask(browser);
  //   console.log(browser);
  //   console.log(metamask);
  console.log(dappetter);
  console.log(browser);
  console.log(metamask);
});
