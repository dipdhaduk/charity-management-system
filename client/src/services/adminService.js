import api from './api';

export const adminService = {
  getStats: async () => {
    const { data } = await api.get('/admin/stats');
    return data;
  },

  getUsers: async (params = {}) => {
    const { data } = await api.get('/admin/users', { params });
    return data;
  },

  toggleUserStatus: async (id) => {
    const { data } = await api.put(`/admin/users/${id}/status`);
    return data;
  },

  getCharities: async (params = {}) => {
    const { data } = await api.get('/admin/charities', { params });
    return data;
  },

  getPendingCharities: async () => {
    const { data } = await api.get('/admin/charities/pending');
    return data;
  },

  verifyCharity: async (id, status) => {
    const { data } = await api.put(`/admin/charities/${id}/verify`, { status });
    return data;
  },

  getCampaigns: async () => {
    const { data } = await api.get('/admin/campaigns');
    return data;
  },

  getDonations: async () => {
    const { data } = await api.get('/admin/donations');
    return data;
  },

  getVolunteers: async () => {
    const { data } = await api.get('/admin/volunteers');
    return data;
  },
};

export const notificationService = {
  getNotifications: async () => {
    const { data } = await api.get('/notifications');
    return data;
  },

  markAsRead: async (id) => {
    const { data } = await api.put(`/notifications/${id}/read`);
    return data;
  },

  markAllAsRead: async () => {
    const { data } = await api.put('/notifications/read-all');
    return data;
  },
};

export const charityService = {
  getCharities: async (params = {}) => {
    const { data } = await api.get('/charities', { params });
    return data;
  },

  getCharityById: async (id) => {
    const { data } = await api.get(`/charities/${id}`);
    return data;
  },

  getMyCharity: async () => {
    const { data } = await api.get('/charities/me');
    return data;
  },

  createCharity: async (charityData) => {
    const { data } = await api.post('/charities', charityData);
    return data;
  },

  updateCharity: async (id, charityData) => {
    const { data } = await api.put(`/charities/${id}`, charityData);
    return data;
  },
};
