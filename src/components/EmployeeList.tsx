import { useState, useEffect } from 'react';
import { supabase, Employee } from '../lib/supabase';
import { UserPlus, Trash2, Users } from 'lucide-react';

interface EmployeeListProps {
  onEmployeeAdded: () => void;
}

export function EmployeeList({ onEmployeeAdded }: EmployeeListProps) {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    email: '',
    department: ''
  });

  useEffect(() => {
    loadEmployees();
  }, []);

  async function loadEmployees() {
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .order('name');

    if (!error && data) {
      setEmployees(data);
    }
  }

  async function handleAddEmployee(e: React.FormEvent) {
    e.preventDefault();

    const { error } = await supabase
      .from('employees')
      .insert([newEmployee]);

    if (!error) {
      setNewEmployee({ name: '', email: '', department: '' });
      setIsAdding(false);
      loadEmployees();
      onEmployeeAdded();
    }
  }

  async function handleDeleteEmployee(id: string) {
    if (confirm('Are you sure you want to delete this employee?')) {
      const { error } = await supabase
        .from('employees')
        .delete()
        .eq('id', id);

      if (!error) {
        loadEmployees();
        onEmployeeAdded();
      }
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Users className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-800">Employees</h2>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <UserPlus className="w-4 h-4" />
          Add Employee
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleAddEmployee} className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <input
              type="text"
              placeholder="Name"
              required
              value={newEmployee.name}
              onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              type="email"
              placeholder="Email"
              required
              value={newEmployee.email}
              onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              type="text"
              placeholder="Department"
              value={newEmployee.department}
              onChange={(e) => setNewEmployee({ ...newEmployee, department: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="space-y-2">
        {employees.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No employees yet. Add one to get started!</p>
        ) : (
          employees.map((employee) => (
            <div
              key={employee.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div>
                <h3 className="font-semibold text-gray-800">{employee.name}</h3>
                <p className="text-sm text-gray-600">{employee.email}</p>
                {employee.department && (
                  <p className="text-sm text-gray-500">{employee.department}</p>
                )}
              </div>
              <button
                onClick={() => handleDeleteEmployee(employee.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
