const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Complaint = require('./models/Complaint');
const connectDB = require('./config/db');

dotenv.config();

const seedDatabase = async () => {
  try {
    await connectDB();

    console.log(' Cleaning existing data in database...');
    await Complaint.deleteMany({});
    await User.deleteMany({});

    console.log(' Creating initial seed users...');
    
    // 1. Admin User
    const adminUser = await User.create({
      name: 'Hostel Warden (Admin)',
      email: 'admin@hostel.com',
      password: 'admin123',
      role: 'admin',
    });

    // 2. Sample Student 1
    const student1 = await User.create({
      name: 'Rahul Sharma',
      email: 'rahul@hostel.com',
      password: 'student123',
      role: 'student',
    });

    // 3. Sample Student 2
    const student2 = await User.create({
      name: 'Priya Patel',
      email: 'priya@hostel.com',
      password: 'student123',
      role: 'student',
    });

    console.log(' Seeding sample complaints...');

    await Complaint.create([
      {
        studentId: student1._id,
        title: 'Ceiling Fan Not Working in Room 204',
        description: 'The ceiling fan has stopped rotating and is making a humming sound when switched on.',
        category: 'Electricity',
        roomNumber: '204',
        status: 'Pending',
      },
      {
        studentId: student1._id,
        title: 'Bathroom Tap Leaking Continuously',
        description: 'The main water tap in the attached washroom is leaking heavily, causing water wastage and slippery floors.',
        category: 'Water',
        roomNumber: '204',
        status: 'In Progress',
      },
      {
        studentId: student1._id,
        title: 'Wi-Fi Disconnecting Frequently on 2nd Floor',
        description: 'Hostel router signal drops every 10-15 minutes, making it difficult to attend online lectures.',
        category: 'Wi-Fi',
        roomNumber: '204',
        status: 'Resolved',
      },
      {
        studentId: student2._id,
        title: 'Corridor Garbage Bin Overflowing',
        description: 'The common dustbin near room 310 has not been emptied for the past two days.',
        category: 'Cleaning',
        roomNumber: '310',
        status: 'Pending',
      },
      {
        studentId: student2._id,
        title: 'Broken Window Latch in Balcony',
        description: 'The window latch is broken, causing the glass pane to rattle during strong winds.',
        category: 'Other',
        roomNumber: '310',
        status: 'In Progress',
      },
    ]);

    console.log(' Demo Data Seeded Successfully!');
    console.log('----------------------------------------------------');
    console.log(' Admin Credentials:');
    console.log('   Email:    admin@hostel.com');
    console.log('   Password: admin123');
    console.log(' Student 1 Credentials:');
    console.log('   Email:    rahul@hostel.com');
    console.log('   Password: student123');
    console.log(' Student 2 Credentials:');
    console.log('   Email:    priya@hostel.com');
    console.log('   Password: student123');
    console.log('----------------------------------------------------');

    process.exit(0);
  } catch (error) {
    console.error(' Seeding Failed:', error);
    process.exit(1);
  }
};

seedDatabase();
