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
    const newTheme = colorMode === "light" ? "dark" : "light";
    setColorMode(newTheme);
    localStorage.theme = newTheme;
  };
  useEffect(() => {
    const last_theme = localStorage.theme as themeType;
    console.log(last_theme, localStorage.getItem("theme"));

    if (typeof last_theme === "string" && last_theme !== colorMode) {
      setColorMode(last_theme);
    }
  }, []);
  return (
    <ColorModeContext.Provider value={{ colorMode, toggleColorMode }}>
      {children}
    </ColorModeContext.Provider>
  );
};
