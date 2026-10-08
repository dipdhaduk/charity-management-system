const Receipt = require('../models/Receipt');

const generateReceipt = async ({ donationId, donorName, amount, campaignName, transactionId }) => {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(1000 + Math.random() * 9000);
  const receiptNumber = `RCP-${new Date().getFullYear()}-${timestamp}${random}`;

  const receipt = await Receipt.create({
    donation: donationId,
    receiptNumber,
    donorName,
    amount,
    campaignName,
    transactionId,
    donationDate: new Date(),
  });

  return receipt;
};

module.exports = generateReceipt;
