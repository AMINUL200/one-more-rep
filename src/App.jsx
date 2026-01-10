import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import AppLayout from "./layout/AppLayout";
import LandingPage from "./pages/landing/LandingPage";
import AdminLayout from "./layout/AdminLayout";
import AdminDashboard from "./pages/admin/dashboard/AdminDashboard";
import SiteSettings from "./pages/admin/settings/SiteSettings";
import AdminProfile from "./pages/admin/profile/AdminProfile";
import ProductPage from "./pages/product/ProductPage";
import ProductDetails from "./pages/product/ProductDetails";
import ContactUs from "./pages/contact/ContactUs";
import ProfilePage from "./pages/profile/ProfilePage";
import CartPage from "./pages/product/CartPage";
import MyOrders from "./pages/product/MyOrders";
import CheckoutPage from "./pages/product/CheckoutPage";
import ProductListPage from "./pages/product/ProductListPage";
import OrderSuccessful from "./pages/payment/OrderSuccessful";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route element={<AppLayout />}>
          <Route index path="/" element={<LandingPage />} />
          <Route index path="/products/:category" element={<ProductPage />} />
           <Route path="/products/:category/:subcategory" element={<ProductListPage />} />
          <Route index path="/:category/:subcategory/:slug" element={<ProductDetails />} />


          <Route index path="/product-details/:id" element={<ProductDetails />} />
          <Route index path="/contact" element={<ContactUs />} />
          <Route index path="/profile" element={<ProfilePage />} />
          <Route index path="/orders" element={<MyOrders />} />
          <Route index path="/cart" element={<CartPage />} />
          <Route index path="/checkout" element={<CheckoutPage />} />
          

        </Route>
          <Route index path="/order-successful" element={<OrderSuccessful />} />

        {/* Admin Layout */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          {/* Additional admin routes can be added here */}
          <Route path="site-settings" element={<SiteSettings />} />
          <Route path="profile" element={<AdminProfile />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
