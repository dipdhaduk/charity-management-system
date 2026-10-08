import api from './api';

export const campaignService = {
  getCampaigns: async (params = {}) => {
    const { data } = await api.get('/campaigns', { params });
    return data;
  },

  getCampaignById: async (id) => {
    const { data } = await api.get(`/campaigns/${id}`);
    return data;
  },

  createCampaign: async (campaignData) => {
    const { data } = await api.post('/campaigns', campaignData);
    return data;
  },

  updateCampaign: async (id, campaignData) => {
    const { data } = await api.put(`/campaigns/${id}`, campaignData);
    return data;
  },

  deleteCampaign: async (id) => {
    const { data } = await api.delete(`/campaigns/${id}`);
    return data;
  },

  getCampaignUpdates: async (id) => {
    const { data } = await api.get(`/campaigns/${id}/updates`);
    return data;
  },

  addCampaignUpdate: async (id, updateData) => {
    const { data } = await api.post(`/campaigns/${id}/updates`, updateData);
    return data;
  },
};

export default campaignService;
