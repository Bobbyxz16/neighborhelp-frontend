import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route, useLocation, Navigate } from "react-router-dom";
import ScrollToTop from "./components/ui/ScrollToTop";
import ErrorBoundary from "./components/ui/ErrorBoundary";
import NotFound from "./pages/NotFound";
import LoginPage from './pages/login';
import UserDashboard from './pages/user-dashboard';
import ResourceSearch from './pages/resource-search';
import Home from './pages/Home';
import ProviderDashboard from './pages/provider-dashboard';
import UserStatistics from './pages/user-dashboard/sub-pages/Statistics';
import CreateResourceListing from './pages/create-resource';
import Register from './pages/register';
import ResourceDetails from './pages/resource-details';
import AdminPanel from './pages/admin-panel';
import ModeratorPanel from './pages/moderator-panel';
import VerifyResources from './pages/verify-resources';
import VerifyEmail from './pages/verify-email';
import FAQPage from './pages/user-dashboard/sub-pages/Faq';
import ContactSupportPage from './pages/user-dashboard/sub-pages/Contact-support';
import UserGuidePage from './pages/user-dashboard/sub-pages/User-guide';
import EmergencyResourcesPage from './pages/user-dashboard/sub-pages/Emergency-page'; 
import TermsAndConditionsPage from './pages/terms-and-conditions';
import ProfileSettings from './pages/user-dashboard/sub-pages/ProfileSettings';
import MessagesPage from './pages/user-dashboard/sub-pages/MessagesPage';
import MyResourcesPage from './pages/user-dashboard/sub-pages/MyResourcesPage';
import TermsOfService from './pages/legal/TermsOfService';
import PrivacyPolicy from './pages/legal/PrivacyPolicy';
import CookiePolicy from './pages/legal/CookiePolicy';
import OAuthCallback from './pages/auth/OAuthCallback';
import ForgotPassword from './pages/forgot-password';
import VerifyCode from './pages/forgot-password/VerifyCode';
import ResetPassword from './pages/reset-password';



const DebugNotFound = () => {
  const location = useLocation();
  if (typeof window !== 'undefined') {
    // eslint-disable-next-line no-console
    console.log('No route matched. Location:', location);
  }
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="text-center max-w-md w-full mb-6">
        <div className="mb-2 text-sm text-muted-foreground">Debug: no route matched</div>
        <div className="text-sm"><strong>pathname:</strong> {location.pathname}</div>
        <div className="text-sm"><strong>search:</strong> {location.search}</div>
        <div className="text-sm mb-4"><strong>hash:</strong> {location.hash}</div>
      </div>
      <NotFound />
    </div>
  );
};


const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        {/* <ScrollToTop /> */}
        <RouterRoutes>
          {/* Define your route here */}
          <Route path="/" element={<Home />} />
          <Route path="/resources" element={<ResourceSearch />} />
          <Route path="/resource-search" element={<ResourceSearch />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/login/oauth2/code/google" element={<OAuthCallback />} />
          <Route path="/oauth/callback" element={<OAuthCallback />} /> {/* Keep for backward compatibility */}
          <Route path="/user-dashboard" element={<UserDashboard />} />
          <Route path="/user-dashboard/statistics" element={<UserStatistics />} />
          <Route path="/statistics" element={<UserStatistics />} />
          <Route path="/user-dashboard/faq" element={<FAQPage />} />
          <Route path="/user-dashboard/contact-support" element={<ContactSupportPage />} />
          <Route path="/user-dashboard/user-guide" element={<UserGuidePage />} />
          <Route path="/user-dashboard/emergency-resources" element={<EmergencyResourcesPage />} />
          <Route path="/provider-dashboard" element={<ProviderDashboard />} />
          <Route path="/create-resource" element={<CreateResourceListing />} />
          <Route path="/edit-resource/:slug" element={<CreateResourceListing />} />
          <Route path="/my-resources" element={<MyResourcesPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/cookies" element={<CookiePolicy />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/forgot-password/verify" element={<VerifyCode />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          {/* Redirect legacy /resources/create URL to the new create resource page */}
          <Route path="/resources/create" element={<Navigate to="/create-resource" replace />} />
          <Route path="/resources/:resourceName" element={<ResourceDetails />} />
          <Route path="/resources/preview/:id" element={<ResourceDetails mode="preview" />} />
          <Route path="/admin-panel" element={<AdminPanel />} />
          <Route path="/verify-resources" element={<VerifyResources />} />
          <Route path="/moderator-panel" element={<ModeratorPanel />} />
          <Route path="/terms-and-conditions" element={<TermsAndConditionsPage />} />
          <Route path="/profile-settings" element={<ProfileSettings />} />
          <Route path="/messages" element={<MessagesPage />} />
          <Route path="*" element={<DebugNotFound />} />
        </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
