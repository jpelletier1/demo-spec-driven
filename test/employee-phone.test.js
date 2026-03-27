const assert = require('node:assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');
const test = require('node:test');
const Database = require('better-sqlite3');
const request = require('supertest');

function loadApp(databasePath) {
  process.env.PAYROLL_DB_PATH = databasePath;

  delete require.cache[require.resolve('../src/server')];
  delete require.cache[require.resolve('../src/db')];

  const app = require('../src/server');
  const { closeDatabase } = require('../src/db');

  return { app, closeDatabase };
}

function createTestContext(t, setupDatabase) {
  const tempDirectory = fs.mkdtempSync(path.join(os.tmpdir(), 'payroll-phone-'));
  const databasePath = path.join(tempDirectory, 'payroll.sqlite');

  if (typeof setupDatabase === 'function') {
    setupDatabase(databasePath);
  }

  const { app, closeDatabase } = loadApp(databasePath);

  t.after(() => {
    closeDatabase();
    delete process.env.PAYROLL_DB_PATH;
    fs.rmSync(tempDirectory, { recursive: true, force: true });
  });

  return { app, databasePath };
}

test('creates an employee with a valid phone number and exposes it in the UI and API', { concurrency: false }, async (t) => {
  const { app } = createTestContext(t);

  const createResponse = await request(app)
    .post('/employees')
    .type('form')
    .send({
      name: 'Jordan Lee',
      title: 'Compensation Analyst',
      phone: '5551234567',
      salary: '85000',
      managerId: '',
      homeAddress: '123 Market Street, Chicago, IL 60606',
    });

  assert.equal(createResponse.status, 302);
  assert.equal(createResponse.headers.location, '/?message=Jordan%20Lee%20added%20to%20payroll.');

  const dashboardResponse = await request(app).get('/');
  assert.equal(dashboardResponse.status, 200);
  assert.match(dashboardResponse.text, /<span>Phone<\/span>/);
  assert.match(dashboardResponse.text, /5551234567/);

  const apiResponse = await request(app).get('/api/employees');
  assert.equal(apiResponse.status, 200);

  const createdEmployee = apiResponse.body.employees.find((employee) => employee.name === 'Jordan Lee');
  assert.ok(createdEmployee);
  assert.equal(createdEmployee.phone, '5551234567');
});

test('updates an existing employee phone number', { concurrency: false }, async (t) => {
  const { app } = createTestContext(t);

  const initialApiResponse = await request(app).get('/api/employees');
  const employee = initialApiResponse.body.employees.find((entry) => entry.name === 'Daniel Kim');

  assert.ok(employee);

  const updateResponse = await request(app)
    .post(`/employees/${employee.id}/update`)
    .type('form')
    .send({
      name: employee.name,
      title: employee.title,
      phone: '5550001111',
      salary: String(employee.salary),
      managerId: employee.managerId ? String(employee.managerId) : '',
      homeAddress: employee.homeAddress,
    });

  assert.equal(updateResponse.status, 302);
  assert.equal(updateResponse.headers.location, `/?message=${encodeURIComponent("Daniel Kim's profile was updated.")}`);

  const apiResponse = await request(app).get('/api/employees');
  const updatedEmployee = apiResponse.body.employees.find((entry) => entry.id === employee.id);

  assert.equal(updatedEmployee.phone, '5550001111');
});

test('rejects a blank phone number on create', { concurrency: false }, async (t) => {
  const { app } = createTestContext(t);

  const response = await request(app)
    .post('/employees')
    .type('form')
    .send({
      name: 'Taylor Moss',
      title: 'Payroll Analyst',
      phone: '',
      salary: '91000',
      managerId: '',
      homeAddress: '400 State Street, Chicago, IL 60654',
    });

  assert.equal(response.status, 302);
  assert.equal(response.headers.location, '/?message=Phone%20number%20is%20required.');

  const apiResponse = await request(app).get('/api/employees');
  assert.equal(apiResponse.body.employees.some((employee) => employee.name === 'Taylor Moss'), false);
});

test('rejects non-digit phone numbers on create', { concurrency: false }, async (t) => {
  const { app } = createTestContext(t);

  const response = await request(app)
    .post('/employees')
    .type('form')
    .send({
      name: 'Taylor Moss',
      title: 'Payroll Analyst',
      phone: '555-ABC-1234',
      salary: '91000',
      managerId: '',
      homeAddress: '400 State Street, Chicago, IL 60654',
    });

  assert.equal(response.status, 302);
  assert.equal(response.headers.location, '/?message=Phone%20number%20must%20contain%20digits%20only.');
});

test('rejects phone numbers longer than 10 digits on create', { concurrency: false }, async (t) => {
  const { app } = createTestContext(t);

  const response = await request(app)
    .post('/employees')
    .type('form')
    .send({
      name: 'Taylor Moss',
      title: 'Payroll Analyst',
      phone: '12345678901',
      salary: '91000',
      managerId: '',
      homeAddress: '400 State Street, Chicago, IL 60654',
    });

  assert.equal(response.status, 302);
  assert.equal(response.headers.location, '/?message=Phone%20number%20must%20not%20exceed%2010%20digits.');
});

test('migrates legacy records without phone numbers and renders editable blank phone fields', { concurrency: false }, async (t) => {
  const { app, databasePath } = createTestContext(t, (legacyDatabasePath) => {
    const legacyDatabase = new Database(legacyDatabasePath);

    legacyDatabase.exec(`
      CREATE TABLE employees (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        title TEXT NOT NULL,
        salary INTEGER NOT NULL CHECK (salary >= 0),
        home_address TEXT NOT NULL,
        manager_id INTEGER REFERENCES employees(id) ON DELETE SET NULL,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);

    legacyDatabase
      .prepare(`
        INSERT INTO employees (name, title, salary, home_address, manager_id)
        VALUES (?, ?, ?, ?, ?)
      `)
      .run('Legacy Employee', 'Payroll Clerk', 62000, '99 Lake Street, Chicago, IL 60610', null);

    legacyDatabase.close();
  });

  const dashboardResponse = await request(app).get('/');
  assert.equal(dashboardResponse.status, 200);
  assert.match(
    dashboardResponse.text,
    /action="\/employees\/1\/update"[\s\S]*?name="phone"[\s\S]*?value=""/
  );

  const apiResponse = await request(app).get('/api/employees');
  const legacyEmployee = apiResponse.body.employees.find((employee) => employee.name === 'Legacy Employee');

  assert.ok(legacyEmployee);
  assert.equal(legacyEmployee.phone, null);

  const migratedDatabase = new Database(databasePath, { readonly: true });
  const columns = migratedDatabase.prepare('PRAGMA table_info(employees)').all();
  migratedDatabase.close();

  assert.equal(columns.some((column) => column.name === 'phone'), true);
});
