import { BrowserRouter, Route, Routes } from "react-router";
import { EditUser } from "./routes/editUser";
import { Home } from "./routes/home";
import { Login } from "./routes/login";
import { NewUser } from "./routes/newUser";
import { Users } from "./routes/users";

export function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/users" element={<Users />} />
        <Route path="/users/new" element={<NewUser />} />
        <Route path="/users/:userId/edit" element={<EditUser />} />
      </Routes>
    </BrowserRouter>
  );
}
