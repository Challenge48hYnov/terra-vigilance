import React from 'react';

function ResourcesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Emergency Resources</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Emergency Contacts</h2>
          <ul className="space-y-2">
            <li>Emergency: 911</li>
            <li>Police (non-emergency): XXX-XXX-XXXX</li>
            <li>Fire Department: XXX-XXX-XXXX</li>
            <li>Poison Control: 1-800-222-1222</li>
          </ul>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Medical Facilities</h2>
          <ul className="space-y-2">
            <li>Local Hospital</li>
            <li>Urgent Care Centers</li>
            <li>Pharmacies</li>
            <li>Mental Health Services</li>
          </ul>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Emergency Supplies</h2>
          <ul className="space-y-2">
            <li>First Aid Kits</li>
            <li>Emergency Food and Water</li>
            <li>Flashlights and Batteries</li>
            <li>Emergency Radio</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ResourcesPage;