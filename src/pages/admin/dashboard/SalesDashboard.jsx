import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Mail, 
  CheckCircle, 
  TrendingUp, 
  Clock,
  BarChart3,
  MessageSquare,
  Eye,
  ArrowUpRight,
  Download,
  MoreVertical,
  Target,
  UserPlus,
  MessageCircle,
  ShoppingCart,
  Package,
  FileText,
  Calendar
} from 'lucide-react';
import { api } from '../../../utils/app';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const SalesDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    new_contacts: 0,
    replied_contacts: 0,
    closed_contacts: 0
  });

  // Color scheme
  const colors = {
    primary: '#1B2B4C', // Dark Blue
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
      const response = await api.get('/admin/sales-dashboard');
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

  // Stat cards data
  const statCards = [
    {
      title: 'New Contacts',
      value: dashboardData.new_contacts,
      icon: <UserPlus size={24} />,
      color: colors.info,
      bgColor: '#EFF6FF',
      borderColor: '#DBEAFE',
      trend: '+12%',
      trendUp: true
    },
    {
      title: 'Replied Contacts',
      value: dashboardData.replied_contacts,
      icon: <MessageCircle size={24} />,
      color: colors.warning,
      bgColor: '#FEF3C7',
      borderColor: '#FDE68A',
      trend: '+8%',
      trendUp: true
    },
    {
      title: 'Closed Contacts',
      value: dashboardData.closed_contacts,
      icon: <CheckCircle size={24} />,
      color: colors.success,
      bgColor: '#D1FAE5',
      borderColor: '#A7F3D0',
      trend: '+5%',
      trendUp: true
    }
  ];

  // Quick actions
  const quickActions = [
    { icon: <UserPlus size={18} />, label: 'View Lead', onClick: () => navigate("/admin/sales-leads") },
    // { icon: <MessageSquare size={18} />, label: 'Send Message', onClick: () => console.log('Send Message') },
    // { icon: <ShoppingCart size={18} />, label: 'New Order', onClick: () => console.log('New Order') },
    // { icon: <FileText size={18} />, label: 'Generate Report', onClick: () => console.log('Generate Report') },
  ];



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
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold" style={{ color: colors.text }}>
            Sales Dashboard
          </h1>
          <p className="mt-2" style={{ color: colors.textLight }}>
            Welcome back, {user?.name || 'Sales Manager'}! Here's your sales overview.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-6 rounded-2xl border shadow-sm hover:shadow-md transition-all duration-300"
              style={{ 
                backgroundColor: colors.cardBg, 
                borderColor: colors.border,
                cursor: 'pointer'
              }}
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
                <p className="text-3xl font-bold" style={{ color: colors.text }}>{stat.value}</p>
                <div className="h-1 w-full rounded-full overflow-hidden" style={{ backgroundColor: colors.border }}>
                  <div 
                    className="h-full rounded-full" 
                    style={{ 
                      width: `${Math.min((stat.value / 50) * 100, 100)}%`, 
                      backgroundColor: stat.color 
                    }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4" style={{ color: colors.text }}>Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={action.onClick}
                className="p-4 rounded-xl border shadow-sm hover:shadow-md transition-all duration-200 group"
                style={{ 
                  backgroundColor: colors.cardBg, 
                  borderColor: colors.border,
                }}
              >
                <div className="flex flex-col items-center gap-2">
                  <div className="p-2 rounded-lg transition-colors" style={{ backgroundColor: `${colors.primary}10` }}>
                    <div style={{ color: colors.primary }}>{action.icon}</div>
                  </div>
                  <span className="text-sm font-medium" style={{ color: colors.text }}>{action.label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

     
      </div>
    </div>
  );
};

export default SalesDashboard;