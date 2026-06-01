// Verification script to validate clean imports of all Mongoose models
const mongoose = require('mongoose');

console.log('----------------------------------------------------');
console.log('BAIO SCHEMA INTEGRITY COMPILATION VERIFIER');
console.log('----------------------------------------------------');

const models = [
  { name: 'Admin', path: '../src/models/Admin' },
  { name: 'School', path: '../src/models/School' },
  { name: 'Student', path: '../src/models/Student' },
  { name: 'Olympiad', path: '../src/models/Olympiad' },
  { name: 'OlympiadRegistration', path: '../src/models/OlympiadRegistration' },
  { name: 'Payment', path: '../src/models/Payment' },
  { name: 'Announcement', path: '../src/models/Announcement' },
  { name: 'Result', path: '../src/models/Result' },
  { name: 'ContactSubmission', path: '../src/models/ContactSubmission' }
];

let failure = false;

models.forEach((model) => {
  try {
    const loadedModel = require(model.path);
    console.log(`[PASS] ${model.name} schema imported and compiled successfully.`);
  } catch (error) {
    console.error(`[FAIL] ${model.name} compilation failed:`, error.message);
    failure = true;
  }
});

console.log('----------------------------------------------------');
if (failure) {
  console.error('SYSTEM TEST RESULT: FAILED schema validations.');
  process.exit(1);
} else {
  console.log('SYSTEM TEST RESULT: PASSED all schema compile-time checks.');
  process.exit(0);
}
