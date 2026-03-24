import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
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
import HandleOrderTract from "./pages/admin/track/HandleOrderTract";
import OrderDetails from "./pages/product/OrderDetails";
import { useAuth } from "./context/AuthContext";
import ScrollToTop from "./component/common/ScrollToTop";
import HandleBlog from "./pages/admin/blog/HandleBlog";
import BlogPage from "./pages/blog/BlogPage";
import BlogsDetails from "./pages/blog/BlogsDetails";
import AboutPage from "./pages/about/AboutPage";
import CMSTemplate from "./pages/cms/CMSTemplate";

// Protected Route Component for authenticated users only
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0B0B0B]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E10600] mx-auto mb-4"></div>
          <p className="text-[#B3B3B3]">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Admin Route Component for admin users only
const AdminRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0B0B0B]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E10600] mx-auto mb-4"></div>
          <p className="text-[#B3B3B3]">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Public Route Component (redirects to home if already authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0B0B0B]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E10600] mx-auto mb-4"></div>
          <p className="text-[#B3B3B3]">Loading...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const App = () => {
  const { loading } = useAuth();
  

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0B0B0B]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E10600] mx-auto mb-4"></div>
          <p className="text-[#B3B3B3]">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <ScrollToTop />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <Routes>
        {/* Public Routes - No authentication required */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <PublicRoute>
              <ResetPassword />
            </PublicRoute>
          }
        />

        {/* Main App Layout Routes */}
        <Route element={<AppLayout />}>
          {/* Public Routes - Accessible to everyone */}
          <Route index path="/" element={<LandingPage />} />
          <Route path="/products/:category" element={<ProductPage />} />
          <Route
            path="/products/:category/:subcategory"
            element={<ProductListPage />}
          />
          <Route
            path="/:category/:subcategory/:PSlug"
            element={<ProductDetails />}
          />
          <Route path="/product-details/:PSlug" element={<ProductDetails />} />
          <Route path="/about" element={<AboutPage/>}/>
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/cms/:slug" element={<CMSTemplate/>}/>
          <Route path="blogs" element={<BlogPage />} />
          <Route path="blogs/:slug" element={<BlogsDetails />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/order-successful" element={<OrderSuccessful />} />
          <Route
            path="/test"
            element={
              <>
                    <div
      style={{
        position: "relative",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        overflow: "hidden",
      }}
    >
      {/* YouTube Background */}
      <iframe
        src="https://www.youtube.com/embed/MtOdnARc5tE?autoplay=1&mute=1&controls=0&loop=1&playlist=MtOdnARc5tE"
        title="YouTube video background"
        frameBorder="0"
        allow="autoplay; encrypted-media"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: "177.77vh", // 16:9 ratio
          height: "100vh",
          transform: "translate(-50%, -50%)",
          pointerEvents: "none",
        }}
      ></iframe>

      {/* Optional Overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.4)",
        }}
      ></div>

      {/* Content */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          color: "white",
        }}
      >
        <h1 style={{ fontSize: "48px", fontWeight: "bold" }}>
          Hero Section
        </h1>
        <p>Fullscreen YouTube Background</p>
      </div>
    </div>

              </>
            }
          />

          {/* Protected Routes - Require login */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <MyOrders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/order/:id"
            element={
              <ProtectedRoute>
                <OrderDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout/:id"
            element={
              <ProtectedRoute>
                <CheckoutPage />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Admin Routes - Only admin users can access */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="products-category" element={<HandleProductCategory />} />
          <Route
            path="products-sub-category"
            element={<HandleProductSubCategory />}
          />
          <Route path="products" element={<HandleProduct />} />
          <Route path="site-settings" element={<SiteSettings />} />
          <Route path="seo-settings" element={<SeoSettings />} />
          <Route path="profile" element={<AdminProfile />} />

          {/* Landing Page Management */}
          <Route
            path="landing-page/hero-section"
            element={<HandleHeroSection />}
          />
          <Route
            path="landing-page/how-it-works"
            element={<HandleHowItWorks />}
          />
          <Route
            path="landing-page/why-chose-us"
            element={<HandleWhyChoseUs />}
          />
          <Route
            path="landing-page/your-goals-section"
            element={<HandleYourGoalsSection />}
          />
          <Route path="landing-page/your-goals" element={<HandleGoals />} />

          <Route path="contact" element={<HandleContact />} />
          <Route path="contact/faqs" element={<HandleFAQs />} />
          <Route path="payment-setup" element={<HandlePaymentSetup />} />
          <Route path="order-track" element={<HandleOrderTract />} />

          <Route path="mange-blogs" element={<HandleBlog />} />
        </Route>

        {/* 404 Not Found Route */}
        {/* <Route path="*" element={<Navigate to="/" replace />} /> */}
      </Routes>
    </Router>
  );
};

export default App;
