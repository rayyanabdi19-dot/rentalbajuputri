import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { SideNavBar } from './components/layout/SideNavBar';
import { TopNavBar } from './components/layout/TopNavBar';
import { MobileBottomNav } from './components/layout/MobileBottomNav';
import { DashboardView } from './components/dashboard/DashboardView';
import { CollectionView } from './components/collection/CollectionView';
import { RentalsView } from './components/rentals/RentalsView';
import { CalendarScheduleView } from './components/calendar/CalendarScheduleView';
import { CustomerDirectoryView } from './components/customers/CustomerDirectoryView';
import { LaundryView } from './components/laundry/LaundryView';
import { ReportsView } from './components/reports/ReportsView';
import { SettingsView } from './components/settings/SettingsView';
import { SpreadsheetIntegrationView } from './components/spreadsheet/SpreadsheetIntegrationView';
import { LoginView } from './components/auth/LoginView';

// Modals
import { NewRentalModal } from './components/rentals/NewRentalModal';
import { InvoiceModal } from './components/rentals/InvoiceModal';
import { ReturnProcessModal } from './components/rentals/ReturnProcessModal';
import { PickupProcessModal } from './components/rentals/PickupProcessModal';
import { WhatsAppShareModal } from './components/common/WhatsAppShareModal';
import { QRCodeModal } from './components/common/QRCodeModal';

const AppContent: React.FC = () => {
  const { activeTab, isAuthenticated } = useApp();

  if (!isAuthenticated) {
    return <LoginView />;
  }

  return (
    <div className="min-h-screen bg-[#f8f9ff] flex text-[#0b1c30] font-sans antialiased">
      {/* Desktop Side Navigation */}
      <SideNavBar />

      {/* Main Content Area */}
      <div className="flex-1 md:pl-[280px] flex flex-col min-h-screen overflow-x-hidden pb-20 md:pb-8">
        {/* Top Navbar */}
        <TopNavBar />

        {/* Dynamic Main View */}
        <main className="flex-1">
          {activeTab === 'dashboard' && <DashboardView />}
          {activeTab === 'collection' && <CollectionView />}
          {activeTab === 'rentals' && <RentalsView />}
          {activeTab === 'calendar' && <CalendarScheduleView />}
          {activeTab === 'customers' && <CustomerDirectoryView />}
          {activeTab === 'laundry' && <LaundryView />}
          {activeTab === 'reports' && <ReportsView />}
          {activeTab === 'settings' && <SettingsView />}
          {activeTab === 'spreadsheet' && <SpreadsheetIntegrationView />}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />

      {/* Global Modals & Dialogs */}
      <NewRentalModal />
      <InvoiceModal />
      <ReturnProcessModal />
      <PickupProcessModal />
      <WhatsAppShareModal />
      <QRCodeModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
