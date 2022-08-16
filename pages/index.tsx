import { Box, Button, Typography } from "@mui/material";
import type { NextPage } from "next";
import { useRouter } from "next/router";

const Home: NextPage = () => {
  const router = useRouter();
  return (
    <Box>
      <Button
        variant="contained"
        onClick={() => {
          router.push("/login");
        }}
      >
        <Typography>Hello World</Typography>
      </Button>
    </Box>
  );
};

export default Home;
