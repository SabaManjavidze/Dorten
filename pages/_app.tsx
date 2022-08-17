import type { AppProps } from "next/app";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Box } from "@mui/system";
import {
  CSSInterpolation,
  createTheme,
  ThemeProvider,
} from "@mui/material/styles";
import { blue, purple } from "@mui/material/colors";
import { darken } from "@mui/material";
import "../styles/globals.css";

export const ColorModeContext = createContext({ toggleColorMode: () => {} });
export const useColorMode = () => useContext(ColorModeContext);
function MyApp({ Component, pageProps }: AppProps) {
  // extra-small
  //  xs: 450,
  // small
  //  sm: 600,
  // medium
  //  md: 900,
  // large
  //  lg: 1200,
  // extra-large
  //  xl: 1536,
  type themeType = "light" | "dark";
  const [mode, setMode] = useState<themeType>("light");
  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
      },
    }),
    []
  );
  const fontStyleOverride: CSSInterpolation = {
    fontFamily: "cursive",
    color: mode === "dark" ? "#f4eee6" : "black",
  };
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: mode,
          primary: {
            main: darken(purple.A400, 0.15),
            dark: darken(purple.A700, 0.1),
          },
          background: { paper: darken(blue[900], 0.75) },
        },

        components: {
          MuiTypography: {
            styleOverrides: {
              h1: fontStyleOverride,
              h2: fontStyleOverride,
              h3: fontStyleOverride,
              h4: fontStyleOverride,
              h5: fontStyleOverride,
              h6: fontStyleOverride,
              body1: fontStyleOverride,
              body2: fontStyleOverride,
            },
          },
        },
      }),
    [mode]
  );
  useEffect(() => {
    const last_theme = localStorage.getItem("theme") as themeType;

    if (typeof last_theme === "string" && last_theme !== mode) {
      setMode(last_theme);
    } else {
      localStorage.setItem("theme", "dark");
      setMode("dark");
    }
  }, []);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <Box
          sx={{
            bgcolor: "background.paper",
            overflowX: "hidden",
            minHeight: "100vh",
          }}
        >
          <Component {...pageProps} />
        </Box>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}
export default MyApp;
