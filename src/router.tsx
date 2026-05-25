import { BrowserRouter, Route, Routes } from "react-router";
import { AdminLayout } from "./layouts/AdminLayout.tsx";
import { CustomerLayout } from "./layouts/CustomerLayout.tsx";
import { AdminNewUser } from "./routes/admin/adminNewUser.tsx";
import { Dashboard } from "./routes/admin/dashboard.tsx";
import { Payments } from "./routes/admin/payments.tsx";
import { System } from "./routes/admin/system.tsx";
import { Tags } from "./routes/admin/tags.tsx";
import { Users } from "./routes/admin/users.tsx";
import { Vehicles } from "./routes/admin/vehicles.tsx";
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
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="vehicles" element={<Vehicles />} />
          <Route path="users" element={<Users />} />
          <Route path="users/new" element={<AdminNewUser />} />
          <Route path="tags" element={<Tags />} />
          <Route path="payments" element={<Payments />} />
          <Route path="system" element={<System />} />
        </Route>

        {/* customer Routes */}
        <Route element={<CustomerLayout />}>
          <Route index element={<Home />} />
          <Route path="/payments" element={<Payment />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/user/profile" element={<Profile />} />
        </Route>

        <Route path="/user/new" element={<NewUser />} />
        <Route path="/user/:userId/edit" element={<EditUser />} />

        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}
