import React from 'react';

function ResourcesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Emergency Resources</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Emergency Contacts</h2>
          <ul className="space-y-2">
            <li>Emergency: 911</li>
            <li>Police (non-emergency): XXX-XXX-XXXX</li>
            <li>Fire Department: XXX-XXX-XXXX</li>
            <li>Poison Control: 1-800-222-1222</li>
          </ul>
        </div>

        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Medical Facilities</h2>
          <ul className="space-y-2">
            <li>Local Hospital</li>
            <li>Urgent Care Centers</li>
            <li>Pharmacies</li>
            <li>Mental Health Services</li>
          </ul>
        </div>

        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Emergency Supplies</h2>
          <ul className="space-y-2">
            <li>First Aid Kits</li>
            <li>Emergency Food and Water</li>
            <li>Flashlights and Batteries</li>
            <li>Emergency Radio</li>
          </ul>
        </div>
      </div>
      <hr className="my-12 border-t-2 border-primary-500 w-3/4 mx-auto rounded-full dark:border-primary-400" />

      <h1 className="text-3xl font-bold mb-6">Emergency Preparedness</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md p-6">
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

        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Family Plan</h2>
          <ul className="space-y-2">
            <li>• Emergency contact information</li>
            <li>• Meeting locations</li>
            <li>• Evacuation routes</li>
            <li>• Communication strategy</li>
            <li>• Special needs considerations</li>
          </ul>
        </div>

        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md p-6">
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
}

export default ResourcesPage;