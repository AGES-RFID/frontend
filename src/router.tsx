import { BrowserRouter, Route, Routes } from "react-router";
import { EditUser } from "./routes/editUser";
import { Home } from "./routes/home";
import { Login } from "./routes/login";
import { NewUser } from "./routes/newUser";
import { Register } from "./routes/register";
import { Users } from "./routes/users";
import { Veiculos } from "./routes/vehicules";
import { Etiquetas } from "./routes/labels";
import { Cobranca } from "./routes/payments";
import { Sistema } from "./routes/system";
import { Dashboard } from "./routes/dashboard";

export function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/veiculos" element={<Veiculos />} />
        <Route path="/usuarios" element={<Users />} />
        <Route path="/etiquetas" element={<Etiquetas />} />
        <Route path="/cobranca" element={<Cobranca />} />
        <Route path="/sistema" element={<Sistema />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/users" element={<Users />} />
        <Route path="/users/new" element={<NewUser />} />
        <Route path="/users/:userId/edit" element={<EditUser />} />
      </Routes>
    </BrowserRouter>
  );
}
