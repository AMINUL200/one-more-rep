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
import MangeAccount from "./pages/admin/account/MangeAccount";
import Dashboard from "./pages/admin/dashboard/Dashboard";
import SalesLead from "./pages/sales/SalesLead";
import MangeOrders from "./pages/account/MangeOrders";
import MangeCMSPage from "./pages/admin/cms/MangeCMSPage";
import MangeAbout from "./pages/admin/about/MangeAbout";
import MangeFellows from "./pages/admin/fellows/MangeFellows";

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

// Admin Route Component for admin, sales, and accounts users
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

  // Allow access for admin, sales, and accounts roles
  const allowedRoles = ['admin', 'sales', 'accounts'];
  
  if (!allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Role-based route wrapper for specific admin routes
const RoleBasedRoute = ({ children, allowedRoles }) => {
  const { user, loading, isAuthenticated } = useAuth();

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

  if (!allowedRoles.includes(user?.role)) {
    return <Navigate to="/admin" replace />;
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

        {/* Admin Routes - Accessible by admin, sales, accounts */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          {/* Common Routes - Accessible by all admin roles */}
          <Route index element={<Dashboard />} />
          <Route path="products" element={<HandleProduct />} />
          <Route path="order-track" element={<HandleOrderTract />} />
          <Route path="profile" element={<AdminProfile />}  />
          <Route path="mange-blogs" element={<HandleBlog />} />

          {/* Admin Only Routes */}
          <Route
            path="products-category"
            element={
              <RoleBasedRoute allowedRoles={['admin']}>
                <HandleProductCategory />
              </RoleBasedRoute>
            }
          />
          <Route
            path="products-sub-category"
            element={
              <RoleBasedRoute allowedRoles={['admin']}>
                <HandleProductSubCategory />
              </RoleBasedRoute>
            }
          />
          <Route
            path="site-settings"
            element={
              <RoleBasedRoute allowedRoles={['admin']}>
                <SiteSettings />
              </RoleBasedRoute>
            }
          />
          <Route
            path="seo-settings"
            element={
              <RoleBasedRoute allowedRoles={['admin']}>
                <SeoSettings />
              </RoleBasedRoute>
            }
          />
          <Route
            path="landing-page/hero-section"
            element={
              <RoleBasedRoute allowedRoles={['admin']}>
                <HandleHeroSection />
              </RoleBasedRoute>
            }
          />
          <Route
            path="landing-page/how-it-works"
            element={
              <RoleBasedRoute allowedRoles={['admin']}>
                <HandleHowItWorks />
              </RoleBasedRoute>
            }
          />
          <Route
            path="landing-page/why-chose-us"
            element={
              <RoleBasedRoute allowedRoles={['admin']}>
                <HandleWhyChoseUs />
              </RoleBasedRoute>
            }
          />
          <Route
            path="landing-page/your-goals-section"
            element={
              <RoleBasedRoute allowedRoles={['admin']}>
                <HandleYourGoalsSection />
              </RoleBasedRoute>
            }
          />
          <Route
            path="landing-page/your-goals"
            element={
              <RoleBasedRoute allowedRoles={['admin']}>
                <HandleGoals />
              </RoleBasedRoute>
            }
          />
          <Route
            path="contact"
            element={
              <RoleBasedRoute allowedRoles={['admin']}>
                <HandleContact />
              </RoleBasedRoute>
            }
          />
          <Route
            path="contact/faqs"
            element={
              <RoleBasedRoute allowedRoles={['admin']}>
                <HandleFAQs />
              </RoleBasedRoute>
            }
          />
          <Route
            path="payment-setup"
            element={
              <RoleBasedRoute allowedRoles={['admin']}>
                <HandlePaymentSetup />
              </RoleBasedRoute>
            }
          />
          <Route
            path="mange-account"
            element={
              <RoleBasedRoute allowedRoles={['admin']}>
                <MangeAccount />
              </RoleBasedRoute>
            }
          />

          <Route path="mange-cms" element={<MangeCMSPage/>}/>
          <Route path="mange-about" element={<MangeAbout/>}/>
          <Route path="mange-fellows" element={<MangeFellows/>}/>

          {/* Sales Routes - */}
          <Route
            path="sales-leads"
            element={
              <RoleBasedRoute allowedRoles={['sales', 'admin']}>
                <SalesLead />
              </RoleBasedRoute>
            }
          />

          {/* Accounts Routes - To be added later */}
          <Route
            path="account-order-track"
            element={
              <RoleBasedRoute allowedRoles={['accounts', 'admin']}>
                <MangeOrders />
              </RoleBasedRoute>
            }
          />
        </Route>

        {/* 404 Not Found Route */}
        {/* <Route path="*" element={<Navigate to="/" replace />} /> */}
      </Routes>
    </Router>
  );
};

export default App;