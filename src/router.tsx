import { BrowserRouter, Route, Routes } from "react-router";

import { Home } from "./routes/home";
import { Login } from "./routes/login";

export function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Home />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}
