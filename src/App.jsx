/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable react-hooks/exhaustive-deps */
import { Grid, Card, CardMedia, Button, Box } from "@mui/material";
import { useImages } from "./hooks/useImages";

function App() {
  const { isLoading, isError, images, fetchNextPage } = useImages();

  return (
    <Box className="main-container">
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
          <Button onClick={() => fetchNextPage()} variant="contained">
            Load More Results
          </Button>
        </>
      )}
      {!isLoading && !isError && images?.length == 0 && (
        <p>There are not Images</p>
      )}
      {!isLoading && isError && <p>Error</p>}
      {isLoading && <p>Loading...</p>}
    </Box>
  );
}

export default App;
