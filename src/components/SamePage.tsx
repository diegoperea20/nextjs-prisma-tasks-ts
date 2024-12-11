"use client"

import React, { useState } from 'react';

// Interfaces
interface SamePageProps {
  initialUserEmail: string;
}

interface SameCount {
  count: number;
  title: string;
}

interface EmailsData {
  title: string;
  emails: string[];
}

interface ErrorResponse {
  message: string;
}

function SamePage({ initialUserEmail }: SamePageProps) {
  const [sameCount, setSameCount] = useState<SameCount[]>([]);
  const [emailsc, setEmailsc] = useState<EmailsData[]>([]);
  const [userEmail] = useState<string>(initialUserEmail);

  const getSameCount = async (userEmail: string): Promise<void> => {
    try {
      const response = await fetch(`/api/tasksi/countsames/${userEmail}`);
      const data: SameCount[] | ErrorResponse = await response.json();
      
      if ('message' in data) {
        window.alert(data.message);
        setSameCount([]);
      } else {
        setSameCount(data);
      }
    } catch (error) {
      console.error('Error fetching same count:', error);
      setSameCount([]);
    }
  };
  
  const getEmails = async (userEmail: string): Promise<void> => {
    try {
      const response = await fetch(`/api/taskse/countsame/${userEmail}`);
      const data: EmailsData[] | ErrorResponse = await response.json();
      
      if ('message' in data) {
        window.alert(data.message);
        setEmailsc([]);
      } else {
        setEmailsc(data);
      }
    } catch (error) {
      console.error('Error fetching emails:', error);
      setEmailsc([]);
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Same</h1>
      
      {/* Botones responsivos */}
      <div className="flex flex-col sm:flex-row gap-3 sm:space-x-4 mb-6 sm:mb-8">
        <button 
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          onClick={() => getSameCount(userEmail)}
        >
          Count People Same title
        </button>
        <button 
          className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          onClick={() => getEmails(userEmail)}
        >
          People Emails same title
        </button>
      </div>
      
      <div className="space-y-6 sm:space-y-8">
        {/* Tabla de conteo - Vista móvil */}
        {sameCount.length > 0 && (
          <div>
            <div className="block sm:hidden">
              {sameCount.map((item, index) => (
                <div key={index} className="mb-4 bg-gray-800 rounded-lg p-4">
                  <div className="flex justify-between items-center border-b border-gray-700 pb-2 mb-2">
                    <span className="text-gray-300 text-xs uppercase">Number of titles</span>
                    <span className="font-semibold">{item.count}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300 text-xs uppercase">Title</span>
                    <span className="font-semibold">{item.title}</span>
                  </div>
                </div>
              ))}
            </div>
  
            {/* Tabla de conteo - Vista desktop */}
            <div className="hidden sm:block overflow-x-auto rounded-lg">
              <table className="w-full text-sm text-left">
                <thead className="text-gray-300 uppercase bg-gray-800">
                  <tr>
                    <th className="px-4 sm:px-6 py-3">Number of titles</th>
                    <th className="px-4 sm:px-6 py-3">Title</th>
                  </tr>
                </thead>
                <tbody>
                  {sameCount.map((item, index) => (
                    <tr key={index} className="border-b border-gray-700 bg-gray-800">
                      <td className="px-4 sm:px-6 py-4">{item.count}</td>
                      <td className="px-4 sm:px-6 py-4">{item.title}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {/* Tabla de emails - Vista móvil */}
        {emailsc.length > 0 && (
          <div>
            <div className="block sm:hidden">
              {emailsc.map((item, index) => (
                <div key={`group-${index}`} className="mb-4 bg-gray-800 rounded-lg p-4">
                  <div className="text-gray-300 text-xs uppercase mb-2">Title</div>
                  <div className="font-semibold mb-3">{item.title}</div>
                  <div className="text-gray-300 text-xs uppercase mb-2">Emails</div>
                  {item.emails.map((email, i) => (
                    <div key={`${index}-${i}`} className="py-2 border-b border-gray-700 last:border-0">
                      {email}
                    </div>
                  ))}
                </div>
              ))}
            </div>
  
            {/* Tabla de emails - Vista desktop */}
            <div className="hidden sm:block overflow-x-auto rounded-lg">
              <table className="w-full text-sm text-left">
                <thead className="text-gray-300 uppercase bg-gray-800">
                  <tr>
                    <th className="px-4 sm:px-6 py-3">Emails</th>
                    <th className="px-4 sm:px-6 py-3">Title</th>
                  </tr>
                </thead>
                <tbody>
                  {emailsc.map((item, index) => (
                    <React.Fragment key={`group-${index}`}>
                      <tr className="border-b border-gray-700 bg-gray-800">
                        <td className="px-4 sm:px-6 py-4">{item.emails[0]}</td>
                        <td className="px-4 sm:px-6 py-4">{item.title}</td>
                      </tr>
                      {item.emails.slice(1).map((email, i) => (
                        <tr key={`${index}-${i}`} className="border-b border-gray-700 bg-gray-800">
                          <td className="px-4 sm:px-6 py-4">{email}</td>
                          <td className="px-4 sm:px-6 py-4"></td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SamePage;