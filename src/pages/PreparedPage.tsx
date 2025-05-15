import React from 'react';

const PreparedPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Emergency Preparedness</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Emergency Kit</h2>
          <ul className="space-y-2">
            <li>• Water (1 gallon per person per day)</li>
            <li>• Non-perishable food</li>
            <li>• First aid supplies</li>
            <li>• Flashlights and batteries</li>
            <li>• Emergency radio</li>
            <li>• Important documents</li>
          </ul>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Family Plan</h2>
          <ul className="space-y-2">
            <li>• Emergency contact information</li>
            <li>• Meeting locations</li>
            <li>• Evacuation routes</li>
            <li>• Communication strategy</li>
            <li>• Special needs considerations</li>
          </ul>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Stay Informed</h2>
          <ul className="space-y-2">
            <li>• Local emergency alerts</li>
            <li>• Weather updates</li>
            <li>• Community resources</li>
            <li>• Emergency services contacts</li>
            <li>• Evacuation procedures</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PreparedPage;