const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
const { v4: uuidv4 } = require('uuid');

// Import your Mongoose models
const Superadmin = require('./models/superAdmin');
const Siteadmin = require('./models/siteAdmin');
const Site = require('./models/sites');
const Employee = require('./models/employee');
const DailyRecord = require('./models/dailyRecords');


const NUM_SUPERADMINS = 2;
const NUM_SITEADMINS = 10;
const NUM_SITES = 50;
const NUM_EMPLOYEES = 1000;
const NUM_DAILY_RECORDS = 5000;

async function seedDatabase() {
  try {
    // Clear existing data
    await Superadmin.deleteMany({});
    await Siteadmin.deleteMany({});
    await Site.deleteMany({});
    await Employee.deleteMany({});
    await DailyRecord.deleteMany({});
    console.log('Cleared existing data.');

    // 1. Create Superadmins
    const superadmins = [];
    for (let i = 0; i < NUM_SUPERADMINS; i++) {
      const superadmin = new Superadmin({
        id: uuidv4(),
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password(), // In production, ensure passwords are hashed
        isDeleted: false,
      });
      superadmins.push(superadmin);
    }
    await Superadmin.insertMany(superadmins);
    console.log(`${NUM_SUPERADMINS} Superadmins created.`);

    // 2. Create Siteadmins linked to Superadmins
    const siteadmins = [];
    for (let i = 0; i < NUM_SITEADMINS; i++) {
      const linkedSuperadmin = superadmins[faker.number.int({ min: 0, max: NUM_SUPERADMINS - 1 })];
      const siteadmin = new Siteadmin({
        siteadminId: `SA-${uuidv4()}`,
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        superadminId: linkedSuperadmin.id, // Ensure this matches superadmin's 'id'
        isDeleted: false,
      });
      siteadmins.push(siteadmin);
    }
    await Siteadmin.insertMany(siteadmins);
    console.log(`${NUM_SITEADMINS} Siteadmins created.`);

    // 3. Create Sites linked to Siteadmins
    const sites = [];
    for (let i = 0; i < NUM_SITES; i++) {
      const linkedSiteadmin = siteadmins[faker.number.int({ min: 0, max: NUM_SITEADMINS - 1 })];
      const site = new Site({
        siteId: `SITE-${uuidv4()}`,
        name: faker.company.name(),
        location: `${faker.location.city()}, ${faker.location.country()}`,
        siteadminId: linkedSiteadmin.siteadminId,
        progress: faker.number.int({ min: 0, max: 100 }),
        progressImages: [],
        siteImage: faker.image.url({ width: 640, height: 480, category: 'business', randomize: true }), // Ensure this returns a valid image URL
        siteInfo: faker.lorem.paragraph(),
      });
      sites.push(site);
    }
    await Site.insertMany(sites);
    console.log(`${NUM_SITES} Sites created.`);

    // 4. Create Employees linked to Sites
    const employees = [];
    for (let i = 0; i < NUM_EMPLOYEES; i++) {
      const linkedSite = sites[faker.number.int({ min: 0, max: NUM_SITES - 1 })];
      const employee = new Employee({
        empId: `EMP-${uuidv4()}`,
        siteId: linkedSite.siteId,
        email: faker.internet.email(),
        password: faker.internet.password(),
        name: faker.person.fullName(),
        contact: faker.phone.number(),
        workertype: faker.helpers.arrayElement(['full-time', 'part-time', 'contract']),
        dp: faker.image.avatar(),
        joiningDate: faker.date.past({ years: 2 }),
        isDeleted: false,
      });
      employees.push(employee);
    }
    await Employee.insertMany(employees);
    console.log(`${NUM_EMPLOYEES} Employees created.`);

    // 5. Create DailyRecords linked to Employees and Sites
    const dailyRecords = [];
    for (let i = 0; i < NUM_DAILY_RECORDS; i++) {
      const linkedEmployee = employees[faker.number.int({ min: 0, max: NUM_EMPLOYEES - 1 })];
      const linkedSite = sites.find(site => site.siteId === linkedEmployee.siteId);
      const checkInDate = faker.date.recent({ days: 30 }); // Records from the last 30 days
      const checkOutDate = faker.datatype.boolean() ? faker.date.between({ from: checkInDate, to: new Date() }) : null;
      const numberOfSelfies = faker.number.int({ min: 0, max: 3 });
      const selfies = Array.from({ length: numberOfSelfies }, () => faker.image.avatar());

      dailyRecords.push(new DailyRecord({
        empId: linkedEmployee.empId,
        siteId: linkedSite.siteId,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        selfies: selfies,
        location: {
          longitude: parseFloat(faker.location.longitude()),
          latitude: parseFloat(faker.location.latitude()),
        },
        work: {
          workAssigned: faker.hacker.phrase(),
          workStatus: faker.helpers.arrayElement(['pending', 'in-progress', 'completed']),
          remark: faker.datatype.boolean() ? faker.lorem.sentence() : '',
        },
      }));
    }
    await DailyRecord.insertMany(dailyRecords);
    console.log(`${NUM_DAILY_RECORDS} DailyRecords created.`);

    console.log('Database seeding completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();