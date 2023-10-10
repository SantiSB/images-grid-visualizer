import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchImages } from "../services/images";

export const useImages = () => {
  const { isLoading, isError, data, fetchNextPage } = useInfiniteQuery(
    ["images"],
    fetchImages,
    {
      getNextPageParam: (lastPage) => {
        return lastPage.nextCursor
      },
      refetchOnWindowFocus: false,
      staleTime: Infinity
    }
  );

  return {
    isLoading,
    isError,
    data,
    fetchNextPage,
  };
};
