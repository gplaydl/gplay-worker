export default async function request(options) {
  const res = await fetch(options.url, {
    redirect: 'follow',
    headers: options.headers || {}
  });
  if (!res.ok) {
    throw new Error(`Request failed: ${res.status} ${res.statusText}`);
  }
  return await res.text();
}