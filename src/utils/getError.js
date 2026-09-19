export default function getError(err) {
  const data = err?.response?.data;
  if (data?.errors?.length) return data.errors.map((e) => e.message).join(', ');
  return data?.message || err?.message || 'Something went wrong';
}