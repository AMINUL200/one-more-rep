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
import ResetPassword from "./pages/auth/ResetPassword";
import HandleProductCategory from "./pages/admin/product/HandleProductCategory";
import { ToastContainer } from "react-toastify";
import HandleProductSubCategory from "./pages/admin/product/HandleProductSubCategory";
import HandleProduct from "./pages/admin/product/HandleProduct";
import SeoSettings from "./pages/admin/settings/SeoSettings";
import HandleHeroSection from "./pages/admin/landingpage/HandleHeroSection";
import HandleHowItWorks from "./pages/admin/landingpage/HandleHowItWorks";
import HandleWhyChoseUs from "./pages/admin/landingpage/HandleWhyChoseUs";
import HandleYourGoalsSection from "./pages/admin/landingpage/HandleYourGoalsSection";
import HandleGoals from "./pages/admin/landingpage/HandleGoals";
import HandleFAQs from "./pages/admin/contact/HandleFAQs";
import HandleContact from "./pages/admin/contact/HandleContact";
import HandlePaymentSetup from "./pages/admin/payment/HandlePaymentSetup";

const App = () => {
  return (
    <Router>
      <ToastContainer
        position="top-right"
        autoClose={3000} // Optional: customize auto-close time
        hideProgressBar={false} // Optional: show/hide progress bar
        newestOnTop={true} // Optional: new toasts on top
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light" // or "dark" based on your preference
      />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ResetPassword />} />

        <Route element={<AppLayout />}>
          <Route index path="/" element={<LandingPage />} />
          <Route index path="/products/:category" element={<ProductPage />} />
          <Route
            path="/products/:category/:subcategory"
            element={<ProductListPage />}
          />
          <Route
            index
            path="/:category/:subcategory/:PSlug"
            element={<ProductDetails />}
          />

          <Route
            index
            path="/product-details/:PSlug"
            element={<ProductDetails />}
          />
          <Route index path="/contact" element={<ContactUs />} />
          <Route index path="/profile" element={<ProfilePage />} />
          <Route index path="/orders" element={<MyOrders />} />
          <Route index path="/cart" element={<CartPage />} />
          <Route index path="/checkout/:id" element={<CheckoutPage />} />
        </Route>
        <Route index path="/order-successful" element={<OrderSuccessful />} />

        {/* Admin Layout */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />

          <Route path="products-category" element={<HandleProductCategory />} />
          <Route path="products-sub-category" element={<HandleProductSubCategory/>}/>
          <Route path="products" element={<HandleProduct/>}/>

          {/* Additional admin routes can be added here */}
          <Route path="site-settings" element={<SiteSettings />} />
          <Route path="seo-settings" element={<SeoSettings/>}/>
          <Route path="profile" element={<AdminProfile />} />

          {/* Landing Page Management */}
          <Route path="landing-page/hero-section" element={<HandleHeroSection/>}/>
          <Route path="landing-page/how-it-works" element={<HandleHowItWorks/>}/>
          <Route path="landing-page/why-chose-us" element={<HandleWhyChoseUs/>}/>
          <Route path="landing-page/your-goals-section" element={<HandleYourGoalsSection/>}/>
          <Route path="landing-page/your-goals" element={<HandleGoals/>}/>


          <Route path="contact" element={<HandleContact/>}/>
          <Route path="contact/faqs" element={<HandleFAQs/>}/>
          <Route path="payment-setup" element={<HandlePaymentSetup/>}/>


        </Route>
      </Routes>
    </Router>
  );
};

export default App;
