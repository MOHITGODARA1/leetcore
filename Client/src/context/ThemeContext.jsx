/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";

const THEME_KEY = "leetcore_theme";

const getInitialTheme = () => {
  try {
    return localStorage.getItem(THEME_KEY) || "dark";
  } catch {
    return "dark";
  }
};

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    const isLight = theme === "light";
    document.documentElement.classList.toggle("light", isLight);
    document.documentElement.style.colorScheme = isLight ? "light" : "dark";

    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {
      // storage unavailable
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((current) => (current === "light" ? "dark" : "light"));
  }, []);

  const contextValue = useMemo(
    () => ({ theme, isLight: theme === "light", toggleTheme }),
    [theme, toggleTheme]
  );

  return <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => useContext(ThemeContext);
