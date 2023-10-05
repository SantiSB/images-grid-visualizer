/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useRef } from "react";
import { Grid, Card, CardMedia, Button } from "@mui/material";

const fetchImages = async (page) => {
  return await fetch(`https://picsum.photos/v2/list?page=${page}&limit=10`)
    .then(async (res) => {
      if (!res.ok) throw new Error("Request Error");
      return await res.json();
    })
    .then((res) => res);
};

function App() {
  const [images, setImages] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);

  const originalImages = useRef([]);

  useEffect(() => {
    setLoading(true);
    setError(false);
    fetchImages(currentPage)
      .then((images) => {
        setImages((prevImages) => {
          const newImages = prevImages.concat(images);
          originalImages.current = newImages;
          return newImages;
        });
      })
      .catch((err) => {
        setError(err);
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [currentPage]);

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
      {!loading && !error && images?.length == 0 && <p>There are not Images</p>}
      {!loading && error && <p>Error</p>}
      {loading && <p>Loading...</p>}
    </div>
  );
}

export default App;
