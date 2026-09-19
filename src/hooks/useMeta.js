import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMeta } from '../features/meta/metaSlice';

export default function useMeta() {
  const dispatch = useDispatch();
  const meta = useSelector((s) => s.meta);

  useEffect(() => {
    if (meta.status === 'idle') dispatch(fetchMeta());
  }, [meta.status, dispatch]);

  return meta;
}