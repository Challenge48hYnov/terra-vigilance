import React from 'react';
import { Github, Twitter, Heart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-neutral-800 border-t border-gray-200 dark:border-neutral-700 py-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-lg font-semibold mb-3">DisasterAlert</h3>
            <p className="text-neutral-600 dark:text-neutral-400 mb-4 max-w-md">
              Real-time disaster alerts and community resources to keep you safe during emergencies.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300">
                <Github size={20} />
              </a>
              <a href="#" className="text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300">
                <Twitter size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-3">Resources</h4>
            <ul className="space-y-2 text-neutral-600 dark:text-neutral-400">
              <li><a href="#" className="hover:text-primary-600 dark:hover:text-primary-400">Emergency Guide</a></li>
              <li><a href="#" className="hover:text-primary-600 dark:hover:text-primary-400">Disaster Types</a></li>
              <li><a href="#" className="hover:text-primary-600 dark:hover:text-primary-400">Preparation Tips</a></li>
              <li><a href="#" className="hover:text-primary-600 dark:hover:text-primary-400">Community Support</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-3">About</h4>
            <ul className="space-y-2 text-neutral-600 dark:text-neutral-400">
              <li><a href="#" className="hover:text-primary-600 dark:hover:text-primary-400">Our Mission</a></li>
              <li><a href="#" className="hover:text-primary-600 dark:hover:text-primary-400">Data Sources</a></li>
              <li><a href="#" className="hover:text-primary-600 dark:hover:text-primary-400">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary-600 dark:hover:text-primary-400">Contact Us</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 dark:border-neutral-700 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            © {new Date().getFullYear()} DisasterAlert. All rights reserved.
          </p>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 flex items-center mt-2 md:mt-0">
            Made with <Heart size={14} className="mx-1 text-red-500" /> for community safety
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;