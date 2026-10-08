import api from './api';

export const donationService = {
  createPaymentIntent: async ({ amount, campaignId }) => {
    const { data } = await api.post('/donations/create-payment-intent', {
      amount,
      campaignId,
    });
    return data;
  },

  createDonation: async (donationData) => {
    const { data } = await api.post('/donations', donationData);
    return data;
  },

  getMyDonations: async () => {
    const { data } = await api.get('/donations/my');
    return data;
  },

  getDonationById: async (id) => {
    const { data } = await api.get(`/donations/${id}`);
    return data;
  },
};

export default donationService;
