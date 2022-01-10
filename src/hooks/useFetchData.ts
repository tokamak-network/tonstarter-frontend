import {useState} from 'react';

export function useFetchData<T>(func: () => T) {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | undefined>(undefined);
  const [res, setRes] = useState(undefined);
}
