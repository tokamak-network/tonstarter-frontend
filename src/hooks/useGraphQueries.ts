import {useQuery} from '@apollo/client';

export function useGraphQueries(query: any) {
  const {loading, error, data} = useQuery(query);
  return {loading, error, data};
}
