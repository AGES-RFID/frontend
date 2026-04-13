import { BrowserRouter, Route, Routes } from "react-router";
import { AdminLayout } from "./layouts/AdminLayout.tsx";
import { CustomerLayout } from "./layouts/CustomerLayout.tsx";
import { AdminNewUser } from "./routes/admin/adminNewUser.tsx";
import { Dashboard } from "./routes/admin/dashboard.tsx";
import { Labels } from "./routes/admin/labels.tsx";
import { Payments } from "./routes/admin/payments.tsx";
import { System } from "./routes/admin/system.tsx";
import { Users } from "./routes/admin/users.tsx";
import { Vehicules } from "./routes/admin/vehicules.tsx";
import { Login } from "./routes/shared/login.tsx";
import { EditUser } from "./routes/user/editUser.tsx";
import { Home } from "./routes/user/home.tsx";
import { NewUser } from "./routes/user/newUser.tsx";
import { Payment } from "./routes/user/payment.tsx";
import { Profile } from "./routes/user/profile.tsx";

export function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Home />} />
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />

        {/* Admin Routes */}
        <Route path="admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="vehicules" element={<Vehicules />} />
          <Route path="users" element={<Users />} />
          <Route path="users/new" element={<AdminNewUser />} />
          <Route path="labels" element={<Labels />} />
          <Route path="payments" element={<Payments />} />
          <Route path="system" element={<System />} />
        </Route>

        {/* Customer Routes */}
        <Route element={<CustomerLayout />}>
          <Route path="/payments" element={<Payment />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/user/new" element={<NewUser />} />
          <Route path="/user/:userId/edit" element={<EditUser />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
