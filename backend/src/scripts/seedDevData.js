require('dotenv').config({ path: __dirname + '/../../.env' });
const mongoose = require('mongoose');
const School = require('../models/School');
const Student = require('../models/Student');

async function seed() {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Database connected successfully.');

    // 1. Seed School
    const schoolEmail = 'coord@dpsrohtak.edu.in';
    const schoolAffiliation = 'CBSE999999';
    let school = await School.findOne({ affiliationNumber: schoolAffiliation });

    if (school) {
      console.log('School already exists:', school.name);
    } else {
      school = await School.create({
        name: 'Delhi Public School, Rohtak',
        affiliationNumber: schoolAffiliation,
        board: 'CBSE',
        address: {
          street: 'Delhi Road',
          city: 'Rohtak',
          state: 'Haryana',
          zip: '124001',
          country: 'India'
        },
        contactEmail: 'info@dpsrohtak.edu.in',
        contactPhone: '9876543211',
        principalName: 'Dr. S. K. Roy',
        coordinator: {
          name: 'Vikram Singh',
          phone: '9876543212',
          email: schoolEmail
        },
        isVerified: true,
        registeredStudentsCount: 1
      });
      console.log('Verified School seeded successfully:', school.name);
    }

    // 2. Seed Student
    const studentEmail = 'aditya@dpsrohtak.edu.in';
    const existingStudent = await Student.findOne({ email: studentEmail });

    if (existingStudent) {
      console.log('Student already exists:', existingStudent.name);
    } else {
      const student = await Student.create({
        name: 'Aditya Sharma',
        email: studentEmail,
        phone: '9876543210',
        password: 'Password123!',
        schoolId: school._id,
        class: '10',
        section: 'A',
        dob: new Date('2010-05-15'),
        gender: 'Male',
        parent: {
          name: 'Rajesh Sharma',
          phone: '9876543219',
          email: 'rajesh@example.com'
        },
        address: {
          street: 'Sector 14',
          city: 'Rohtak',
          state: 'Haryana',
          zip: '124001'
        },
        isEmailVerified: true
      });
      console.log('Student seeded successfully:', student.name);
    }

    console.log('────────────────────────────────────────');
    console.log('DEV TEST ACCOUNTS CREATED:');
    console.log('────────────────────────────────────────');
    console.log('1. School Portal Credentials:');
    console.log(`   - Coordinator Email:  ${schoolEmail}`);
    console.log(`   - Affiliation Number: ${schoolAffiliation}`);
    console.log('');
    console.log('2. Student Portal Credentials:');
    console.log(`   - Student Email:      ${studentEmail}`);
    console.log('   - Password:           Password123!');
    console.log('────────────────────────────────────────');

  } catch (err) {
    console.error('Seeding error:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Database disconnected.');
  }
}

seed();
