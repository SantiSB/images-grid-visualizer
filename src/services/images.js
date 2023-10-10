export const fetchImages = async ({ pageParam = 1 }) => {
  return await fetch(`https://picsum.photos/v2/list?page=${pageParam}&limit=10`)
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
      return {
        images: await res.json(),
        nextCursor,
        prevCursor,
        currentCursor
      };
    });
};
