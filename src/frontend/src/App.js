import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';

// Components
import Navbar from './components/Navbar';
import AdminLayout from './components/admin/AdminLayout';

// Pages
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Category from './pages/Category';
import Search from './pages/Search';
import Messages from './pages/Messages';
import Review from './pages/Review';
import Profile from './pages/Profile';
import Orders from './pages/Orders';
import Favorites from './pages/Favorites';
import Categories from './pages/Categories';
import Help from './pages/Help';
import Settings from './pages/Settings';
import Notifications from './pages/Notifications';
import Login from './pages/Login';
import Register from './pages/Register';
import Products from './pages/Products';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';
import RentalHistory from './pages/RentalHistory';
import AddProduct from './pages/AddProduct';
import RentalApprovals from './pages/RentalApprovals';
import ChatList from './pages/ChatList';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminUsers from './pages/admin/AdminUsers';
import AdminOrders from './pages/admin/AdminOrders';
import AdminSettings from './pages/admin/AdminSettings';
import AdminReports from './pages/admin/AdminReports';
import AdminPayments from './pages/admin/AdminPayments';
import AdminRentals from './pages/admin/AdminRentals';
import AdminContent from './pages/admin/AdminContent';

// Theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#ff9800',
    },
    secondary: {
      main: '#f44336',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar />
          <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/category/:id" element={<Category />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/search" element={<Search />} />
              <Route path="/messages" element={<Messages />} />
              <Route path="/review/:id" element={<Review />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/help" element={<Help />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/products" element={<Products />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/rental-history" element={<RentalHistory />} />
              <Route path="/add-product" element={<AddProduct />} />
              <Route path="/rental-approvals" element={<RentalApprovals />} />
              <Route path="/chat-list" element={<ChatList />} />

              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="/admin/dashboard" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
              <Route path="/admin/products" element={<AdminLayout><AdminProducts /></AdminLayout>} />
              <Route path="/admin/users" element={<AdminLayout><AdminUsers /></AdminLayout>} />
              <Route path="/admin/orders" element={<AdminLayout><AdminOrders /></AdminLayout>} />
              <Route path="/admin/rentals" element={<AdminLayout><AdminRentals /></AdminLayout>} />
              <Route path="/admin/payments" element={<AdminLayout><AdminPayments /></AdminLayout>} />
              <Route path="/admin/reports" element={<AdminLayout><AdminReports /></AdminLayout>} />
              <Route path="/admin/content" element={<AdminLayout><AdminContent /></AdminLayout>} />
              <Route path="/admin/settings" element={<AdminLayout><AdminSettings /></AdminLayout>} />
            </Routes>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
