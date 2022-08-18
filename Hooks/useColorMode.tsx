import { createContext, useState, useEffect, useContext } from "react";

type ColorContextType = {
  colorMode: "light" | "dark";
  toggleColorMode: () => void;
};
const ColorModeContext = createContext<ColorContextType>({
  colorMode: "dark",
  toggleColorMode: () => {},
});
export const useColorMode = () => useContext(ColorModeContext);
export const ColorModeProvider = ({ children }) => {
  type themeType = "light" | "dark";
  const [colorMode, setColorMode] = useState<themeType>("light");
  const toggleColorMode = () => {
    setColorMode(colorMode === "light" ? "dark" : "light");
  };
  useEffect(() => {
    const last_theme = localStorage.theme as themeType;

    if (typeof last_theme === "string" && last_theme !== colorMode) {
      setColorMode(last_theme);
    } else {
      localStorage.theme = "dark";
      setColorMode("dark");
    }
  }, [colorMode]);
  return (
    <ColorModeContext.Provider value={{ colorMode, toggleColorMode }}>
      {children}
    </ColorModeContext.Provider>
  );
};
