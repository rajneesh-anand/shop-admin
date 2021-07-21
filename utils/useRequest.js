import useSWR, { useSWRInfinite } from "swr";

const fetcher = (url) =>
  fetch(url)
    .then((res) => res.json())
    .then((prod) => prod.data);

export const useGetData = (url) => {
  if (!url) {
    throw new Error("url is required");
  }
  const { data, error } = useSWR(url, fetcher);
  return { data, error };
};

export const usePaginatedData = (url) => {
  if (!url) {
    throw new Error("url is required");
  }

  const PAGE_LIMIT = 12;

  const { data, error, size, setSize } = useSWRInfinite(
    (index) => `${url}?page=${index + 1}&limit=${PAGE_LIMIT}`,
    fetcher
  );

  const result = data ? [].concat(...data) : [];
  const isLoadingInitialData = !data && !error;
  const isLoadingMore =
    isLoadingInitialData ||
    (size > 0 && data && typeof data[size - 1] === "undefined");
  const isEmpty = data?.[0]?.length === 0;
  const isReachingEnd =
    isEmpty || (data && data[data.length - 1]?.length < PAGE_LIMIT);

  return {
    result,
    error,
    isLoadingMore,
    size,
    setSize,
    isReachingEnd,
    isEmpty,
  };
};
