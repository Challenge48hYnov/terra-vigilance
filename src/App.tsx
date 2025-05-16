import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './contexts/UserContext';
import { ChatProvider } from './contexts/ChatContext';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import MapPage from './pages/MapPage';
import ResourcesPage from './pages/ResourcesPage';
import ActivitiesPage from './pages/ActivitiesPage';
import ChatPage from './pages/ChatPage';

function App() {
  return (
    <UserProvider>
        <ChatProvider>
          <Router>
            <Layout>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/map" element={<MapPage />} />
                <Route path="/resources" element={<ResourcesPage />} />
                <Route path="/activities" element={<ActivitiesPage />} />
                <Route path="/chat" element={<ChatPage />} />
              </Routes>
            </Layout>
          </Router>
        </ChatProvider>
    </UserProvider>
  );
}

export default App;