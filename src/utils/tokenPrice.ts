export const getTokenPrice = async (tokenName: string) => {
  const fetchData = await fetch(
    `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${tokenName}&order=market_cap_desc&per_page=100&page=1&sparkline=false`,
  )
    .then((res) => res.json())
    .then((result) => result);
  // const {current_price} = fetchData[0];
  return fetchData[0]?.current_price || 0;
};
