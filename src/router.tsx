import { BrowserRouter, Route, Routes } from "react-router";
import { EditUser } from "./routes/user/editUser.tsx";
import { Home } from "./routes/user/home.tsx";
import { Login } from "./routes/shared/login.tsx";
import { NewUser } from "./routes/user/newUser.tsx";
import { Profile } from "./routes/user/profile.tsx";
import { Users } from "./routes/admin/users.tsx";
import { Vehicules } from "./routes/admin/vehicules.tsx";
import { Labels } from "./routes/admin/labels.tsx";
import { Payments } from "./routes/admin/payments.tsx";
import { System } from "./routes/admin/system.tsx";
import { Dashboard } from "./routes/admin/dashboard.tsx";
import { Payment } from "./routes/user/payment.tsx";
import { AdminNewUser } from "./routes/admin/adminNewUser.tsx";

export function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Home />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
        
        {/* Admin Routes */}
        <Route path="/admin/vehicules" element={<Vehicules />} />
        <Route path="/admin/users" element={<Users />} />
        <Route path="/admin/labels" element={<Labels />} />
        <Route path="/admin/payments" element={<Payments />} />
        <Route path="/admin/system" element={<System />} />
        <Route path="/admin/users/register" element={<AdminNewUser />} />
        
        {/* customer Routes */}
        <Route path="/payments" element={<Payment />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/user/new" element={<NewUser />} />
        <Route path="/user/:userId/edit" element={<EditUser />} />

        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}
