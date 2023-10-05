/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState } from "react";
import { Grid, Card, CardMedia, Button } from "@mui/material";
import { useInfiniteQuery } from "@tanstack/react-query";

const fetchImages = async (pageParam = 1) => {
  return await fetch(`https://picsum.photos/v2/list?page=${pageParam}&limit=10`)
    .then(async (res) => {
      if (!res.ok) throw new Error("Request Error");
      const urlObj = new URL(res.url);
      const pageValue = urlObj.searchParams.get("page");
      const data = await res.json();
      const responseWithPage = { pageValue, data };
      return responseWithPage;
    })
    .then((res) => {
      const nextCursor = Number(res.pageValue) + 1;
      return {
        images: res.data,
        nextCursor,
      };
    });
};

function App() {
  const {
    isLoading,
    isError,
    data,
    fetchNextPage,
    hasNextPage
  } = useInfiniteQuery(
    ["images"], 
    fetchImages,
    {
      getNextPageParam: (lastPage, pages) => lastPage.nextCursor
    }
  );

  const images = data?.pages?.[0].images ?? [];
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div className="main-container">
      {images?.length > 0 && (
        <>
          <Grid container spacing={2}>
            {images.map((image) => (
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
          <Button
            onClick={() => setCurrentPage(currentPage + 1)}
            variant="contained"
          >
            Load More Results
          </Button>
        </>
      )}
      {!isLoading && !isError && images?.length == 0 && (
        <p>There are not Images</p>
      )}
      {!isLoading && isError && <p>Error</p>}
      {isLoading && <p>Loading...</p>}
    </div>
  );
}

export default App;
