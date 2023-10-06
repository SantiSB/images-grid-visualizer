import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchImages } from "../services/images";

export const useImages = () => {
  const { isLoading, isError, data, fetchNextPage, fetchPreviousPage } = useInfiniteQuery(
    ["images"],
    fetchImages,
    {
      getNextPageParam: (lastPage) => {
        return lastPage.nextCursor
      },
      getPreviousPageParam: (firstPage) => {
        return firstPage.prevCursor
      },
      refetchOnWindowFocus: false,
      staleTime: Infinity
    }
  );

  // const allData = data?.pages.flatMap((page) => page.images)
  const segmentedData = data?.pages.slice(-5).flatMap((page) => page.images);

  return {
    isLoading,
    isError,
    // images: allData ?? [],
    images: segmentedData ?? [],
    fetchNextPage,
    fetchPreviousPage
  };
};
