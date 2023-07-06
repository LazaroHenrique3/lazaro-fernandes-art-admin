import { BrowserRouter } from "react-router-dom";

import { AppRoutes } from "./routes";
import { ThemeProvider } from "@emotion/react";
import { lightTheme } from "./shared/themes";

function App() {
  return (
    <ThemeProvider theme={lightTheme}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ThemeProvider>

  );
}

export default App;
