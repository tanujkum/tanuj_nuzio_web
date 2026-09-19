import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { removeToast } from '../../../features/toast/toastSlice';
import './Toast.css';

function ToastItem({ toast }) {
  const dispatch = useDispatch();

  useEffect(() => {
    const t = setTimeout(() => dispatch(removeToast(toast.id)), 3200);
    return () => clearTimeout(t);
  }, [toast.id, dispatch]);

  return (
    <div className={`toast toast--${toast.type}`} onClick={() => dispatch(removeToast(toast.id))}>
      {toast.message}
    </div>
  );
}

export default function ToastContainer() {
  const items = useSelector((s) => s.toast.items);
  return (
    <div className="toasts">
      {items.map((t) => <ToastItem key={t.id} toast={t} />)}
    </div>
  );
}