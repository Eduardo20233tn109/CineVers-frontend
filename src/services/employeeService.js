import apiClient from './apiClient';

const employeeService = {
  // Get all employees (gerente only)
  async getEmployees(filters = {}) {
    const params = new URLSearchParams();
    
    if (filters.role) params.append('role', filters.role);
    if (filters.status) params.append('status', filters.status);
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);
    
    const response = await apiClient.get(`/employees?${params.toString()}`);
    return response.data;
  },

  // Create employee (gerente only)
  async createEmployee(employeeData) {
    const response = await apiClient.post('/employees', employeeData);
    return response.data;
  },

  // Update employee (gerente only)
  async updateEmployee(id, employeeData) {
    const response = await apiClient.put(`/employees/${id}`, employeeData);
    return response.data;
  },

  // Delete employee (gerente only)
  async deleteEmployee(id) {
    const response = await apiClient.delete(`/employees/${id}`);
    return response.data;
  },

  // Reactivate employee (gerente only)
  async reactivateEmployee(id) {
    const response = await apiClient.post(`/employees/${id}/reactivate`);
    return response.data;
  },
};

export default employeeService;
