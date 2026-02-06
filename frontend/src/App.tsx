import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/DashboardPage';
import Transactions from './pages/TransactionsPage';
import SettlementAccountPage from './pages/SettlementAccountPage';

import GeneralPage from './pages/GeneralPage';
import ProfilePage from './pages/ProfilePage';
import SecurityPage from './pages/SecurityPage';
import AccountsPage from './pages/AccountsPage';
import PaymentLinkPage from './pages/PaymentLinkPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="transaction" element={<Transactions />} />
          <Route path="accounts" element={<AccountsPage />} />
          <Route path="payment-link" element={<PaymentLinkPage />} />

          {/* Settings Routes */}
          <Route path="settings/general" element={<GeneralPage />} />
          <Route path="settings/profile" element={<ProfilePage />} />
          <Route path="settings/settlement-accounts" element={<SettlementAccountPage />} />
          <Route path="settings/security" element={<SecurityPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
