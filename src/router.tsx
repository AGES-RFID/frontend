import { BrowserRouter, Route, Routes } from "react-router";
import { EditUser } from "./routes/editUser";
import { Home } from "./routes/home";
import { Login } from "./routes/login";
import { NewUser } from "./routes/newUser";
import { Register } from "./routes/register";
import { Users } from "./routes/users";
import { Vehicules } from "./routes/vehicules";
import { Labels } from "./routes/labels";
import { Payments } from "./routes/payments";
import { System } from "./routes/system";
import { Dashboard } from "./routes/dashboard";
import { AdminRegister } from "./routes/adminRegister.tsx";
import { Payment } from "./routes/payment.tsx";

export function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/vehicles" element={<Vehicules />} />
        <Route path="/users" element={<Users />} />
        <Route path="/labels" element={<Labels />} />
        <Route path="/payments" element={<Payments />} />
        <Route path="/system" element={<System />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/payments" element={<Payment />} />
        <Route path="/users" element={<Users />} />
        <Route path="/users/new" element={<NewUser />} />
        <Route path="/users/:userId/edit" element={<EditUser />} />
        <Route path="/admin/register" element={<AdminRegister />} />
      </Routes>
    </BrowserRouter>
  );
}
