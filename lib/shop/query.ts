/**
 * All shop filter state lives in the URL (?category=hoodies&anime=naruto&anime=bleach...).
 * This keeps filters shareable/bookmarkable and lets the /shop page stay a
 * Server Component that reads `searchParams` directly — no client-side
 * data fetching needed. These helpers just make it easy to derive the
 * *next* query string from the *current* one when a filter control fires.
 */

export function setParam(
  params: URLSearchParams,
  key: string,
  value: string | null
): string {
  const next = new URLSearchParams(params);
  if (value === null || value === "") next.delete(key);
  else next.set(key, value);
  next.delete("page");
  return next.toString();
}

export function toggleMultiParam(
  params: URLSearchParams,
  key: string,
  value: string
): string {
  const next = new URLSearchParams(params);
  const current = next.getAll(key);
  next.delete(key);
  if (current.includes(value)) {
    current.filter((v) => v !== value).forEach((v) => next.append(key, v));
  } else {
    [...current, value].forEach((v) => next.append(key, v));
  }
  next.delete("page");
  return next.toString();
}

export function setPage(params: URLSearchParams, page: number): string {
  const next = new URLSearchParams(params);
  if (page <= 1) next.delete("page");
  else next.set("page", String(page));
  return next.toString();
}

export function clearAll(): string {
  return "";
}
