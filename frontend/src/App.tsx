import AppRoutes from "./routes";
import { ThemeProvider } from "./context/theme-provider";

const App = () => {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <AppRoutes />
    </ThemeProvider>
  );
};

export default App;
