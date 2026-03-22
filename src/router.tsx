import { BrowserRouter, Route, Routes } from "react-router";

import { Home } from "./routes/home";
import { Login } from "./routes/login";
import { Users } from "./routes/users";

export function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/users" element={<Users />} />
      </Routes>
    </BrowserRouter>
  );
}
