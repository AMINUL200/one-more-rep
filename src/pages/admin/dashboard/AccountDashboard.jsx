import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  ShoppingBag,
  Clock,
  CreditCard,
  TrendingUp,
  ArrowUpRight,
  Download,
  RefreshCw,
  Calendar,
  Filter,
  FileText,
  Printer,
  Eye,
  ChevronRight,
  ShoppingBagIcon
} from 'lucide-react';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { api } from '../../../utils/app';

const AccountDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    total_orders: 0,
    total_collection: '0.00',
    total_pending_orders: 0,
    total_payments: 0
  });

  // Color scheme
  const colors = {
    primary: '#1B2B4C',
    primaryLight: '#2A3F66',
    background: '#FFFFFF',
    cardBg: '#F8F9FA',
    border: '#E2E8F0',
    text: '#1E293B',
    textLight: '#64748B',
    success: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444',
    info: '#3B82F6',
    purple: '#8B5CF6'
  };

  // Fetch dashboard data
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/accounts-dashboard');
      if (response.data?.status) {
        setDashboardData(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  // Format number with commas
  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-IN').format(num);
  };

  // Quick action buttons data
  const quickActions = [
    {
      id: 'order-track',
      label: 'View Orders',
      icon: <ShoppingBagIcon size={18} />,
      color: colors.info,
      bgColor: '#EFF6FF',
      onClick: () => navigate('/admin/account-order-track'),
      description: 'View all Orders'
    },
   
   
    
  ];

  // Stat cards configuration
  const statCards = [
    {
      title: 'Total Orders',
      value: dashboardData.total_orders,
      formattedValue: formatNumber(dashboardData.total_orders),
      icon: <ShoppingBag size={24} />,
      color: colors.primary,
      bgColor: `${colors.primary}10`,
      trend: '+12%',
      trendUp: true,
      onClick: () => navigate('/admin/orders')
    },
    {
      title: 'Total Collection',
      value: dashboardData.total_collection,
      formattedValue: formatCurrency(dashboardData.total_collection),
      icon: <DollarSign size={24} />,
      color: colors.success,
      bgColor: `${colors.success}10`,
      trend: '+8%',
      trendUp: true,
      onClick: () => navigate('/admin/transactions')
    },
    {
      title: 'Pending Orders',
      value: dashboardData.total_pending_orders,
      formattedValue: formatNumber(dashboardData.total_pending_orders),
      icon: <Clock size={24} />,
      color: colors.warning,
      bgColor: `${colors.warning}10`,
      trend: '-3%',
      trendUp: false,
      onClick: () => navigate('/admin/orders?status=pending')
    },
    {
      title: 'Total Payments',
      value: dashboardData.total_payments,
      formattedValue: formatNumber(dashboardData.total_payments),
      icon: <CreditCard size={24} />,
      color: colors.info,
      bgColor: `${colors.info}10`,
      trend: '+5%',
      trendUp: true,
      onClick: () => navigate('/admin/payment-history')
    }
  ];

  // Recent transactions (sample data - you can replace with API data)
  const recentTransactions = [
    { id: 1, orderId: 'ORD-2024-001', amount: 2500, status: 'completed', date: '2024-03-26', customer: 'Rajesh Kumar' },
    { id: 2, orderId: 'ORD-2024-002', amount: 3500, status: 'completed', date: '2024-03-25', customer: 'Priya Singh' },
    { id: 3, orderId: 'ORD-2024-003', amount: 1200, status: 'pending', date: '2024-03-25', customer: 'Amit Patel' },
    { id: 4, orderId: 'ORD-2024-004', amount: 5000, status: 'completed', date: '2024-03-24', customer: 'Neha Sharma' },
    { id: 5, orderId: 'ORD-2024-005', amount: 800, status: 'failed', date: '2024-03-24', customer: 'Vikram Singh' }
  ];

  // Export to Excel
  const exportToExcel = () => {
    try {
      const exportData = [
        {
          'Metric': 'Total Orders',
          'Value': dashboardData.total_orders,
          'Formatted Value': formatNumber(dashboardData.total_orders)
        },
        {
          'Metric': 'Total Collection',
          'Value': dashboardData.total_collection,
          'Formatted Value': formatCurrency(dashboardData.total_collection)
        },
        {
          'Metric': 'Pending Orders',
          'Value': dashboardData.total_pending_orders,
          'Formatted Value': formatNumber(dashboardData.total_pending_orders)
        },
        {
          'Metric': 'Total Payments',
          'Value': dashboardData.total_payments,
          'Formatted Value': formatNumber(dashboardData.total_payments)
        }
      ];

      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Dashboard Summary');
      
      const date = new Date();
      const fileName = `account_dashboard_${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}.xlsx`;
      XLSX.writeFile(wb, fileName);
      
      toast.success('Dashboard data exported successfully!');
    } catch (error) {
      console.error('Error exporting data:', error);
      toast.error('Failed to export data');
    }
  };

  // Get status badge color
  const getStatusBadge = (status) => {
    switch(status) {
      case 'completed':
        return { bg: '#D1FAE5', text: '#10B981', label: 'Completed' };
      case 'pending':
        return { bg: '#FEF3C7', text: '#F59E0B', label: 'Pending' };
      case 'failed':
        return { bg: '#FEE2E2', text: '#EF4444', label: 'Failed' };
      default:
        return { bg: '#EFF6FF', text: '#3B82F6', label: 'Processing' };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.background }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: colors.background }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-start flex-wrap gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold" style={{ color: colors.text }}>
              Accounts Dashboard
            </h1>
            <p className="mt-2" style={{ color: colors.textLight }}>
              Financial overview and transaction management
            </p>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={fetchDashboardData}
              className="px-4 py-2 rounded-lg flex items-center gap-2 border transition-all hover:bg-gray-50"
              style={{ borderColor: colors.border, color: colors.text }}
            >
              <RefreshCw size={16} />
              Refresh
            </button>
            {/* <button
              onClick={exportToExcel}
              className="px-4 py-2 rounded-lg flex items-center gap-2 transition-all hover:shadow-md"
              style={{ backgroundColor: colors.success, color: '#FFFFFF' }}
            >
              <Download size={16} />
              Export Report
            </button> */}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={stat.onClick}
              className="p-6 rounded-2xl border shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
              style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl" style={{ backgroundColor: stat.bgColor }}>
                  <div style={{ color: stat.color }}>{stat.icon}</div>
                </div>
                <div className="flex items-center gap-1 text-xs">
                  <span className={stat.trendUp ? 'text-success' : 'text-danger'}>
                    {stat.trend}
                  </span>
                  <ArrowUpRight size={12} className={stat.trendUp ? 'text-success' : 'text-danger'} />
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm" style={{ color: colors.textLight }}>{stat.title}</p>
                <p className="text-2xl font-bold" style={{ color: colors.text }}>
                  {stat.formattedValue}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4" style={{ color: colors.text }}>Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action) => (
              <button
                key={action.id}
                onClick={action.onClick}
                className="p-4 rounded-xl border shadow-sm hover:shadow-md transition-all duration-200 group text-left"
                style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg transition-colors" style={{ backgroundColor: action.bgColor }}>
                    <div style={{ color: action.color }}>{action.icon}</div>
                  </div>
                  <span className="font-medium" style={{ color: colors.text }}>{action.label}</span>
                </div>
                <p className="text-xs" style={{ color: colors.textLight }}>{action.description}</p>
              </button>
            ))}
          </div>
        </div>

        
      </div>
    </div>
  );
};

export default AccountDashboard;