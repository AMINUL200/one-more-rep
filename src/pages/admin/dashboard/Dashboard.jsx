import React from 'react'
import { useAuth } from '../../../context/AuthContext';
import AdminDashboard from './AdminDashboard';
import SalesDashboard from './SalesDashboard';
import AccountDashboard from './AccountDashboard';

const Dashboard = () => {
     const { user, loading, isAuthenticated } = useAuth();
  

     if(user.role === "admin"){
        return <AdminDashboard/>;
     }

     if(user.role === "sales"){
        return <SalesDashboard/>;
     }
     if(user.role === "accounts"){
        return <AccountDashboard/>;
     }
}

export default Dashboard;
