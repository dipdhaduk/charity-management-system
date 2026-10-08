require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');

const User = require('../models/User');
const Charity = require('../models/Charity');
const Campaign = require('../models/Campaign');
const Donation = require('../models/Donation');
const VolunteerOpportunity = require('../models/VolunteerOpportunity');
const VolunteerApplication = require('../models/VolunteerApplication');
const CampaignUpdate = require('../models/CampaignUpdate');
const Notification = require('../models/Notification');
const Receipt = require('../models/Receipt');

const seedData = async () => {
  try {
    const seedPassword = process.env.SEED_USER_PASSWORD;
    if (!seedPassword) {
      throw new Error('Set SEED_USER_PASSWORD in server/.env before running the seed.');
    }

    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/charity_platform';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing collections
    await Promise.all([
      User.deleteMany({}),
      Charity.deleteMany({}),
      Campaign.deleteMany({}),
      Donation.deleteMany({}),
      VolunteerOpportunity.deleteMany({}),
      VolunteerApplication.deleteMany({}),
      CampaignUpdate.deleteMany({}),
      Notification.deleteMany({}),
      Receipt.deleteMany({}),
    ]);
    console.log('Cleared database.');

    // 1. Create Users
    console.log('Creating users...');
    const adminUser = await User.create({
      name: 'System Administrator',
      email: 'admin@charityhub.org',
      password: seedPassword,
      role: 'admin',
      phone: '+91 98765 43210',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    });

    const charityUser1 = await User.create({
      name: 'Dr. Anita Roy',
      email: 'info@hopefoundation.org',
      password: seedPassword,
      role: 'charity',
      phone: '+91 98220 11223',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    });

    const charityUser2 = await User.create({
      name: 'Vikram Joshi',
      email: 'contact@cleanwateraid.org',
      password: seedPassword,
      role: 'charity',
      phone: '+91 98110 33445',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    });

    const charityUser3 = await User.create({
      name: 'Meera Deshmukh',
      email: 'support@educatechild.org',
      password: seedPassword,
      role: 'charity',
      phone: '+91 98450 55667',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
    });

    const charityUserPending = await User.create({
      name: 'Rohan Mehra',
      email: 'contact@animalhaven.org',
      password: seedPassword,
      role: 'charity',
      phone: '+91 97660 77889',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    });

    const donorUser1 = await User.create({
      name: 'Priya Sharma',
      email: 'priya.sharma@example.com',
      password: seedPassword,
      role: 'donor',
      phone: '+91 99887 76655',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    });

    const donorUser2 = await User.create({
      name: 'Rahul Verma',
      email: 'rahul.verma@example.com',
      password: seedPassword,
      role: 'donor',
      phone: '+91 99112 23344',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    });

    const donorUser3 = await User.create({
      name: 'Ananya Patel',
      email: 'ananya.patel@example.com',
      password: seedPassword,
      role: 'donor',
      phone: '+91 98223 34455',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    });

    const volunteerUser1 = await User.create({
      name: 'Arjun Singh',
      email: 'arjun.singh@example.com',
      password: seedPassword,
      role: 'volunteer',
      phone: '+91 97112 33445',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80',
    });

    const volunteerUser2 = await User.create({
      name: 'Sneha Reddy',
      email: 'sneha.reddy@example.com',
      password: seedPassword,
      role: 'volunteer',
      phone: '+91 96112 44556',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    });

    // 2. Create Charities
    console.log('Creating charity profiles...');
    const charity1 = await Charity.create({
      user: charityUser1._id,
      organizationName: 'Hope Medical Foundation',
      description: 'Dedicated to providing critical medical treatments, pediatric surgeries, and life-saving healthcare supplies to underprivileged families.',
      registrationNumber: 'NGO-DEL-2018-8841',
      email: 'info@hopefoundation.org',
      phone: '+91 98220 11223',
      address: '42 Health Park, Green Avenue',
      city: 'Delhi',
      state: 'Delhi',
      website: 'https://hopefoundation.org',
      logo: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=200&q=80',
      isVerified: true,
      verificationStatus: 'approved',
    });

    const charity2 = await Charity.create({
      user: charityUser2._id,
      organizationName: 'Clean Water Aid',
      description: 'Building deep borewells, solar filtration systems, and sustainable water resources across drought-affected rural communities.',
      registrationNumber: 'NGO-MAH-2019-4329',
      email: 'contact@cleanwateraid.org',
      phone: '+91 98110 33445',
      address: '15 Lotus Eco Hub, Bandra Kurla Complex',
      city: 'Mumbai',
      state: 'Maharashtra',
      website: 'https://cleanwateraid.org',
      logo: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=200&q=80',
      isVerified: true,
      verificationStatus: 'approved',
    });

    const charity3 = await Charity.create({
      user: charityUser3._id,
      organizationName: 'Educate Every Child Foundation',
      description: 'Empowering children with digital tablets, school supplies, STEM libraries, and qualified after-school tutoring.',
      registrationNumber: 'NGO-KAR-2020-6512',
      email: 'support@educatechild.org',
      phone: '+91 98450 55667',
      address: '78 Silicon Crescent, Indiranagar',
      city: 'Bengaluru',
      state: 'Karnataka',
      website: 'https://educatechild.org',
      logo: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=200&q=80',
      isVerified: true,
      verificationStatus: 'approved',
    });

    const charityPending = await Charity.create({
      user: charityUserPending._id,
      organizationName: 'Animal Haven Rescue Shelter',
      description: 'Rescuing abandoned street animals, performing sterilizations, and running temporary recovery foster centers.',
      registrationNumber: 'NGO-GUJ-2023-1109',
      email: 'contact@animalhaven.org',
      phone: '+91 97660 77889',
      address: '9 Riverfront Boulevard',
      city: 'Ahmedabad',
      state: 'Gujarat',
      website: 'https://animalhavenrescue.org',
      logo: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=200&q=80',
      isVerified: false,
      verificationStatus: 'pending',
    });

    // 3. Create Campaigns
    console.log('Creating campaigns...');
    const campaign1 = await Campaign.create({
      charity: charity1._id,
      title: 'Pediatric Heart Surgeries Emergency Fund',
      description: 'Over 40 newborn children in rural clinics suffer from congenital heart defects that require immediate surgical intervention. With your support, we can cover the cost of cardiac operations, ICU stays, and post-operative medications in partner hospitals.',
      category: 'Healthcare',
      goalAmount: 850000,
      raisedAmount: 520000,
      donorCount: 48,
      location: 'Delhi NCR',
      image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80',
      startDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
      status: 'active',
    });

    const campaign2 = await Campaign.create({
      charity: charity2._id,
      title: 'Solar Water Filtration Wells in Drought Zones',
      description: 'More than 12 villages in drought-hit districts walk over 6 kilometers daily for muddy ground water. This initiative will construct 8 community solar-powered clean filtration plants that provide fluoride-free drinking water.',
      category: 'Environment',
      goalAmount: 600000,
      raisedAmount: 390000,
      donorCount: 34,
      location: 'Marathwada, Maharashtra',
      image: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=1200&q=80',
      startDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000),
      status: 'active',
    });

    const campaign3 = await Campaign.create({
      charity: charity3._id,
      title: 'Digital Classrooms & STEM Kits for Rural Schools',
      description: 'Empower 1,500 government school students with smart projector kits, interactive STEM kits, tablets, and library books. Help bridge the digital divide for children who dream of engineering and science careers.',
      category: 'Education',
      goalAmount: 450000,
      raisedAmount: 315000,
      donorCount: 29,
      location: 'Bengaluru Rural',
      image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80',
      startDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
      status: 'active',
    });

    const campaign4 = await Campaign.create({
      charity: charity1._id,
      title: 'Nutritious Hot Meals for Slum Children',
      description: 'Providing daily fresh, wholesome cooked meals enriched with vitamins and proteins to 800 children living in informal settlements. Combating malnutrition one warm plate at a time.',
      category: 'Food',
      goalAmount: 300000,
      raisedAmount: 285000,
      donorCount: 52,
      location: 'Delhi & Noida',
      image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80',
      startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
      status: 'active',
    });

    const campaign5 = await Campaign.create({
      charity: charity2._id,
      title: 'Emergency Flood Relief & Sanitation Packs',
      description: 'Rapid deployment of water purification kits, waterproof family tents, emergency ration kits, and baby formula to flood-affected riverbanks.',
      category: 'Disaster Relief',
      goalAmount: 500000,
      raisedAmount: 500000,
      donorCount: 65,
      location: 'Assam & Bihar',
      image: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1200&q=80',
      startDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      status: 'completed',
    });

    const campaign6 = await Campaign.create({
      charity: charity3._id,
      title: 'Warm Winter Shelters & Blankets for Elderly',
      description: 'Distributing high-grade insulated thermal blankets, winter clothing, and organizing night shelter facilities for destitute seniors living without homes.',
      category: 'Housing',
      goalAmount: 250000,
      raisedAmount: 180000,
      donorCount: 22,
      location: 'Jaipur & Ahmedabad',
      image: 'https://images.unsplash.com/photo-1518398046578-8cca57782e17?auto=format&fit=crop&w=1200&q=80',
      startDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      status: 'active',
    });

    // 4. Create Donations and Receipts
    console.log('Creating sample donations and receipts...');
    const donationData = [
      {
        donor: donorUser1._id,
        campaign: campaign1,
        amount: 15000,
        tx: 'TXN-984321-771',
        name: donorUser1.name,
      },
      {
        donor: donorUser1._id,
        campaign: campaign3,
        amount: 5000,
        tx: 'TXN-876123-450',
        name: donorUser1.name,
      },
      {
        donor: donorUser2._id,
        campaign: campaign1,
        amount: 25000,
        tx: 'TXN-765432-889',
        name: donorUser2.name,
      },
      {
        donor: donorUser2._id,
        campaign: campaign2,
        amount: 10000,
        tx: 'TXN-654321-992',
        name: donorUser2.name,
      },
      {
        donor: donorUser3._id,
        campaign: campaign4,
        amount: 2500,
        tx: 'TXN-543210-331',
        name: donorUser3.name,
      },
      {
        donor: donorUser3._id,
        campaign: campaign2,
        amount: 7500,
        tx: 'TXN-432109-224',
        name: donorUser3.name,
      },
      {
        donor: donorUser1._id,
        campaign: campaign6,
        amount: 3000,
        tx: 'TXN-321098-115',
        name: donorUser1.name,
      },
    ];

    for (let i = 0; i < donationData.length; i++) {
      const item = donationData[i];
      const donation = await Donation.create({
        donor: item.donor,
        campaign: item.campaign._id,
        charity: item.campaign.charity,
        amount: item.amount,
        paymentMethod: 'UPI / NetBanking',
        transactionId: item.tx,
        paymentStatus: 'success',
        donatedAt: new Date(Date.now() - (i + 1) * 3 * 24 * 60 * 60 * 1000),
      });

      const receiptNumber = `RCP-2026-000${i + 1}${Math.floor(100 + Math.random() * 900)}`;
      await Receipt.create({
        donation: donation._id,
        receiptNumber,
        donorName: item.name,
        amount: item.amount,
        campaignName: item.campaign.title,
        transactionId: item.tx,
        donationDate: donation.donatedAt,
      });

      // Notifications
      await Notification.create({
        user: item.donor,
        title: 'Donation Confirmed',
        message: `Your donation of INR ${item.amount.toLocaleString('en-IN')} to "${item.campaign.title}" was successful. Receipt #${receiptNumber} generated.`,
        type: 'donation_success',
        createdAt: donation.donatedAt,
      });
    }

    // 5. Create Volunteer Opportunities
    console.log('Creating volunteer opportunities...');
    const opp1 = await VolunteerOpportunity.create({
      charity: charity3._id,
      campaign: campaign3._id,
      title: 'Weekend STEM & Coding Mentor',
      description: 'Teach basic computer literacy and exciting science experiments to 6th-8th grade children at our community center on Saturdays.',
      volunteersNeeded: 8,
      location: 'Indiranagar Community Hall, Bengaluru',
      date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      status: 'open',
    });

    const opp2 = await VolunteerOpportunity.create({
      charity: charity1._id,
      campaign: campaign4._id,
      title: 'Food Distribution & Packaging Volunteer',
      description: 'Help pack wholesome nutrition meal boxes and distribute them to families in need during the morning drive.',
      volunteersNeeded: 12,
      location: 'Civil Lines Feeding Center, Delhi',
      date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      status: 'open',
    });

    const opp3 = await VolunteerOpportunity.create({
      charity: charity2._id,
      campaign: campaign2._id,
      title: 'Water Testing & Community Outreach Field Volunteer',
      description: 'Assist our engineering teams in collecting clean water samples and educating school children on water hygiene.',
      volunteersNeeded: 6,
      location: 'Pune & Ahmednagar Outskirts',
      date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      status: 'open',
    });

    // 6. Volunteer Applications
    console.log('Creating volunteer applications...');
    await VolunteerApplication.create({
      volunteer: volunteerUser1._id,
      opportunity: opp1._id,
      message: 'I am a software engineer with 4 years of experience and would love to mentor kids in technology!',
      status: 'approved',
      appliedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    });

    await VolunteerApplication.create({
      volunteer: volunteerUser2._id,
      opportunity: opp2._id,
      message: 'Experienced in community outreach and eager to participate in weekend food drives.',
      status: 'pending',
      appliedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    });

    // 7. Campaign Updates
    console.log('Creating campaign updates...');
    await CampaignUpdate.create({
      campaign: campaign1._id,
      title: 'First 12 Surgeries Completed Successfully!',
      content: 'Thanks to your generous contributions, 12 children with congenital defects underwent successful corrective surgery at Holy Family Hospital this week. All patients are recovering well under close observation in our pediatric wing.',
      image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80',
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    });

    await CampaignUpdate.create({
      campaign: campaign2._id,
      title: 'Phase 1 Solar Wells Drilled and Operational',
      content: 'Drilling was completed in 3 villages yesterday, and solar water pumps are actively pumping clean water to over 400 households. Thank you for your continued belief in clean water access.',
      image: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=800&q=80',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    });

    console.log('Database seeded successfully with complete dataset!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();


