import { useState, useEffect } from 'react';
import { supabase, Device, Employee } from '../lib/supabase';
import { Smartphone, Plus, Trash2, Edit } from 'lucide-react';

interface DeviceListProps {
  refreshTrigger: number;
}

export function DeviceList({ refreshTrigger }: DeviceListProps) {
  const [devices, setDevices] = useState<Device[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingDevice, setEditingDevice] = useState<Device | null>(null);
  const [formData, setFormData] = useState({
    device_name: '',
    device_type: '',
    serial_number: '',
    employee_id: '',
    status: 'Available',
    notes: ''
  });

  useEffect(() => {
    loadDevices();
    loadEmployees();
  }, [refreshTrigger]);

  async function loadDevices() {
    const { data, error } = await supabase
      .from('devices')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setDevices(data);
    }
  }

  async function loadEmployees() {
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .order('name');

    if (!error && data) {
      setEmployees(data);
    }
  }

  function resetForm() {
    setFormData({
      device_name: '',
      device_type: '',
      serial_number: '',
      employee_id: '',
      status: 'Available',
      notes: ''
    });
    setIsAdding(false);
    setEditingDevice(null);
  }

  function startEdit(device: Device) {
    setEditingDevice(device);
    setFormData({
      device_name: device.device_name,
      device_type: device.device_type,
      serial_number: device.serial_number,
      employee_id: device.employee_id || '',
      status: device.status,
      notes: device.notes
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const deviceData = {
      ...formData,
      employee_id: formData.employee_id || null,
      assigned_date: formData.employee_id ? new Date().toISOString() : null,
      updated_at: new Date().toISOString()
    };

    if (editingDevice) {
      const { error } = await supabase
        .from('devices')
        .update(deviceData)
        .eq('id', editingDevice.id);

      if (!error) {
        resetForm();
        loadDevices();
      }
    } else {
      const { error } = await supabase
        .from('devices')
        .insert([deviceData]);

      if (!error) {
        resetForm();
        loadDevices();
      }
    }
  }

  async function handleDelete(id: string) {
    if (confirm('Are you sure you want to delete this device?')) {
      const { error } = await supabase
        .from('devices')
        .delete()
        .eq('id', id);

      if (!error) {
        loadDevices();
      }
    }
  }

  function getEmployeeName(employeeId: string | null) {
    if (!employeeId) return 'Unassigned';
    const employee = employees.find(e => e.id === employeeId);
    return employee ? employee.name : 'Unknown';
  }

  function getStatusColor(status: string) {
    switch (status) {
      case 'Available':
        return 'bg-green-100 text-green-800';
      case 'Assigned':
        return 'bg-blue-100 text-blue-800';
      case 'Maintenance':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Smartphone className="w-6 h-6 text-green-600" />
          <h2 className="text-2xl font-bold text-gray-800">Test Devices</h2>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Device
        </button>
      </div>

      {(isAdding || editingDevice) && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              placeholder="Device Name"
              required
              value={formData.device_name}
              onChange={(e) => setFormData({ ...formData, device_name: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <input
              type="text"
              placeholder="Device Type (e.g., Phone, Tablet)"
              required
              value={formData.device_type}
              onChange={(e) => setFormData({ ...formData, device_type: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <input
              type="text"
              placeholder="Serial Number"
              required
              value={formData.serial_number}
              onChange={(e) => setFormData({ ...formData, serial_number: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="Available">Available</option>
              <option value="Assigned">Assigned</option>
              <option value="Maintenance">Maintenance</option>
            </select>
            <select
              value={formData.employee_id}
              onChange={(e) => setFormData({ ...formData, employee_id: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">Unassigned</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>{emp.name}</option>
              ))}
            </select>
            <textarea
              placeholder="Notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent md:col-span-2"
              rows={2}
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              {editingDevice ? 'Update' : 'Save'}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {devices.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No devices yet. Add one to get started!</p>
        ) : (
          devices.map((device) => (
            <div
              key={device.id}
              className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-gray-800">{device.device_name}</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(device.status)}`}>
                      {device.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                    <p><span className="font-medium">Type:</span> {device.device_type}</p>
                    <p><span className="font-medium">Serial:</span> {device.serial_number}</p>
                    <p><span className="font-medium">Assigned to:</span> {getEmployeeName(device.employee_id)}</p>
                    {device.assigned_date && (
                      <p><span className="font-medium">Assigned:</span> {new Date(device.assigned_date).toLocaleDateString()}</p>
                    )}
                  </div>
                  {device.notes && (
                    <p className="mt-2 text-sm text-gray-600"><span className="font-medium">Notes:</span> {device.notes}</p>
                  )}
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => startEdit(device)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(device.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
