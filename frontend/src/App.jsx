import { Children, useContext } from "react";
import { ThemeContext } from "./context/Theme";

export default function App() {
  const { lightTheme, darkTheme, theme, setTheme } = useContext(ThemeContext);
  return (
    <div>
      <h1 className={`${theme ? lightTheme : darkTheme}`}>Hello world!</h1>
      <button onClick={() => setTheme(!theme)}>switch theme</button>
    </div>
  );
}
