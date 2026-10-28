import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./shared/themes/ThemeContext";
import Home from "./pages/Home";


function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <Routes>
          <Route path="/" element={<Home />} />

        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;