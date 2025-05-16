import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AlertProvider } from './contexts/AlertContext';
import { UserProvider } from './contexts/UserContext';
import { ChatProvider } from './contexts/ChatContext';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import AlertsPage from './pages/AlertsPage';
import MapPage from './pages/MapPage';
import ResourcesPage from './pages/ResourcesPage';
import ActivitiesPage from './pages/ActivitiesPage';
import ChatPage from './pages/ChatPage';

function App() {
  return (
    <UserProvider>
      <AlertProvider>
        <ChatProvider>
          <Router>
            <Layout>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/alerts" element={<AlertsPage />} />
                <Route path="/map" element={<MapPage />} />
                <Route path="/resources" element={<ResourcesPage />} />
                <Route path="/activities" element={<ActivitiesPage />} />
                <Route path="/chat" element={<ChatPage />} />
              </Routes>
            </Layout>
          </Router>
        </ChatProvider>
      </AlertProvider>
    </UserProvider>
  );
}

export default App;