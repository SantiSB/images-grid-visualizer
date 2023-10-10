/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable react-hooks/exhaustive-deps */
import { Grid, Card, CardMedia, Button, Box } from "@mui/material";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

function App() {
  const [imagesData, setImagesData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchImages = async ({ pageParam = currentPage }) => {
    return await fetch(
      `https://picsum.photos/v2/list?page=${pageParam}&limit=10`
    )
      .then((res) => {
        if (!res.ok) throw new Error("Request Error");
        return res;
      })
      .then(async (res) => {
        let url = new URL(res.url);
        let page = Number(url.searchParams.get("page"));
        let nextCursor = page + 1;
        let prevCursor = page - 1;
        let currentCursor = page;
        let images = await res.json();

        return {
          images,
          nextCursor,
          prevCursor,
          currentCursor,
        };
      });
  };

  const { isLoading, isError, data, fetchNextPage } = useInfiniteQuery(
    ["images"],
    fetchImages,
    {
      getNextPageParam: () => imagesData[imagesData.length - 1]?.nextCursor,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
    }
  );

  // Function to select segments to display on screen
  const getSegments = (arr, start, end) => {
    if (
      start < 0 ||
      start >= arr.length ||
      end < 0 ||
      end >= arr.length ||
      start > end
    ) {
      return [];
    }

    const segments = arr.slice(start, end + 1);

    return segments;
  };

  // Data segments change when data change
  useEffect(() => {
    if (data) {
      if (currentPage <= 5) {
        setImagesData(data?.pages);
      } else {
        let start = currentPage - 5;
        let end = currentPage - 1;
        const segments = getSegments(data.pages, start, end);
        setImagesData(segments);
      }
    }
  }, [data]);

  // Function to find a page in pages loaded
  function searchPage(pages, property, valor) {
    return pages.some((page) => page[property] === valor);
  }

  const loadMoreImages = () => {
    let lastResult = imagesData[imagesData.length - 1];

    setCurrentPage(lastResult.nextCursor);

    const pageIsLoaded = searchPage(
      data.pages,
      "nextCursor",
      lastResult.nextCursor + 1
    );

    if (pageIsLoaded) {
      let end = lastResult.currentCursor;
      let start = end - 4;
      const segments = getSegments(data.pages, start, end);
      setImagesData(segments);
    } else {
      fetchNextPage();
    }
  };

  const loadPrevImages = async () => {
    setCurrentPage(imagesData[0].prevCursor);
    let start = imagesData[0].prevCursor - 1;
    let end = start + 4;
    const segments = getSegments(data.pages, start, end);
    setImagesData(segments);
  };

  return (
    <Box className="main-container">
      {imagesData?.length > 0 && (
        <>
          <Button
            onClick={() => loadPrevImages()}
            variant="contained"
            style={{ display: currentPage > 5 ? "flex" : "none"}}
          >
            Load Prev Results
          </Button>
          <Grid container spacing={2}>
            {imagesData
              .flatMap((page) => page.images)
              .map((image) => (
                <Grid item key={image.id} xs={12} sm={6} md={4} lg={3}>
                  <Card>
                    <CardMedia
                      component="img"
                      alt={`Image ${image.id}`}
                      height="auto"
                      width="100%"
                      src={image.download_url}
                    />
                  </Card>
                </Grid>
              ))}
          </Grid>
          <Button onClick={() => loadMoreImages()} variant="contained">
            Load More Results
          </Button>
        </>
      )}
      {!isLoading && !isError && imagesData?.length == 0 && (
        <p>There are not Images</p>
      )}
      {!isLoading && isError && <p>Error</p>}
      {isLoading && <p>Loading...</p>}
    </Box>
  );
}

export default App;
