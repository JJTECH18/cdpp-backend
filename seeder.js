require('dotenv').config();
const mongoose = require('mongoose');
const Member = require('./models/Member');
const { Program } = require('./models/index');

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ DB Connected'))
  .catch(err => { console.error(err); process.exit(1); });

const seed = async () => {
  try {
    const existing = await Member.findOne({ email: 'admin@campdavidpp.org' });
    if (!existing) {
      await Member.create({
        firstName: 'Super', lastName: 'Admin',
        email: 'admin@campdavidpp.org',
        password: 'Admin@CDPP2025!',
        role: 'super_admin',
        isEmailVerified: true,
        isApproved: true,
        isActive: true
      });
      console.log('✅ Super Admin created!');
      console.log('   Email: admin@campdavidpp.org');
      console.log('   Password: Admin@CDPP2025!');
    } else {
      console.log('ℹ️  Admin already exists');
    }

    await Program.deleteMany({});
    await Program.insertMany([
      { name: 'Monthly Night of Prayer', description: 'All-night prayer meeting', icon: '🔥', schedule: 'Last Friday · 10 PM – 6 AM', order: 1 },
      { name: 'Weekly Bible Study', description: 'Deep Word study', icon: '📖', schedule: 'Every Wednesday · 5:30 PM', order: 2 },
      { name: 'Community Outreaches', description: 'Quarterly missions', icon: '🌍', schedule: 'Quarterly', order: 3 },
      { name: 'Sunday Worship Service', description: 'Weekly Sunday service', icon: '🎵', schedule: 'Every Sunday · 9 AM', order: 4 },
      { name: 'Youth & Teens Ministry', description: 'Young people fellowship', icon: '⚡', schedule: 'Every Saturday · 3 PM', order: 5 },
      { name: 'Marriage & Family', description: 'Couples counselling', icon: '💍', schedule: 'First Saturday monthly', order: 6 }
    ]);
    console.log('✅ Programs seeded!');
    console.log('\n🚀 Done! Change your password after first login!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  }
};

seed();