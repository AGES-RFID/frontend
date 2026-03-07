import { BrowserRouter, Route, Routes } from "react-router";

import { Home } from "./routes/home";

export function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}
