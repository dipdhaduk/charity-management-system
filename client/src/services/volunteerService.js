import api from './api';

export const volunteerService = {
  getOpportunities: async (params = {}) => {
    const { data } = await api.get('/volunteers/opportunities', { params });
    return data;
  },

  getOpportunityById: async (id) => {
    const { data } = await api.get(`/volunteers/opportunities/${id}`);
    return data;
  },

  createOpportunity: async (oppData) => {
    const { data } = await api.post('/volunteers/opportunities', oppData);
    return data;
  },

  applyOpportunity: async (applyData) => {
    const { data } = await api.post('/volunteers/apply', applyData);
    return data;
  },

  getMyApplications: async () => {
    const { data } = await api.get('/volunteers/my-applications');
    return data;
  },

  getCharityApplications: async () => {
    const { data } = await api.get('/volunteers/charity-applications');
    return data;
  },

  updateApplicationStatus: async (id, status) => {
    const { data } = await api.put(`/volunteers/applications/${id}`, { status });
    return data;
  },
};

export default volunteerService;
