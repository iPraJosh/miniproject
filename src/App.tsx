import { useState } from 'react';
import { EmployeeList } from './components/EmployeeList';
import { DeviceList } from './components/DeviceList';
import { Cog } from 'lucide-react';

function App() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  function handleEmployeeChange() {
    setRefreshTrigger(prev => prev + 1);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <Cog className="w-8 h-8 text-gray-700" />
            <h1 className="text-3xl font-bold text-gray-900">Employee Test Device Manager</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <EmployeeList onEmployeeAdded={handleEmployeeChange} />
          <DeviceList refreshTrigger={refreshTrigger} />
        </div>
      </main>
    </div>
  );
}

export default App;
