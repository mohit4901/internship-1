const express = require('express');
const router  = express.Router();

// ── Feature Routers ──────────────────────────────────────────────────────────
const authRouter         = require('./auth.routes');
const olympiadRouter     = require('./olympiad.routes');
const studentRouter      = require('./student.routes');
const schoolRouter       = require('./school.routes');
const mediaRouter        = require('./media.routes');
const registrationRouter = require('./registration.routes');
const announcementRouter = require('./announcement.routes');
const resultRouter       = require('./result.routes');
const cmsRouter          = require('./cms.routes');
const dashboardRouter    = require('./dashboard.routes');
const contactRouter      = require('./contact.routes');

// ── Future Feature Routes (stubs — uncomment as features are built) ──────────
// const paymentRouter       = require('./payment.routes');

// ── Mount Routes ─────────────────────────────────────────────────────────────
router.use('/auth',          authRouter);
router.use('/olympiads',     olympiadRouter);
router.use('/students',      studentRouter);
router.use('/schools',       schoolRouter);
router.use('/media',         mediaRouter);
router.use('/registrations', registrationRouter);
router.use('/announcements', announcementRouter);
router.use('/results',       resultRouter);
router.use('/cms',           cmsRouter);
router.use('/dashboard',     dashboardRouter);
router.use('/contact',       contactRouter);

// router.use('/payments',      paymentRouter);

// ── API Index ─────────────────────────────────────────────────────────────────
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'BAIO API v1 is live.',
    version: '1.0.0',
    endpoints: {
      auth: {
        admin:   '/api/v1/auth/admin/(register|login|logout|me)',
        student: '/api/v1/auth/student/(register|login|logout|me)',
        school:  '/api/v1/auth/school/(register|login|logout|me)',
        forgotPassword: {
          step1: 'POST /api/v1/auth/:role/forgot-password/question',
          step2: 'POST /api/v1/auth/:role/forgot-password/verify',
          step3: 'POST /api/v1/auth/:role/forgot-password/reset',
          setQuestion: 'POST /api/v1/auth/:role/forgot-password/set-question  [protected]',
        },
      },
      olympiads: {
        list:         'GET    /api/v1/olympiads',
        get:          'GET    /api/v1/olympiads/:id',
        create:       'POST   /api/v1/olympiads               [admin]',
        update:       'PATCH  /api/v1/olympiads/:id           [admin]',
        changeStatus: 'PATCH  /api/v1/olympiads/:id/status   [admin]',
        delete:       'DELETE /api/v1/olympiads/:id           [admin]',
      },
      students: {
        me:           'GET    /api/v1/students/me             [student]',
        updateMe:     'PATCH  /api/v1/students/me             [student]',
        list:         'GET    /api/v1/students                [admin: users:read]',
        get:          'GET    /api/v1/students/:id            [admin: users:read]',
        toggleStatus: 'PATCH  /api/v1/students/:id/status    [admin: users:write]',
      },
      schools: {
        me:           'GET    /api/v1/schools/me              [school]',
        updateMe:     'PATCH  /api/v1/schools/me              [school]',
        list:         'GET    /api/v1/schools                 [admin: users:read]',
        get:          'GET    /api/v1/schools/:id             [admin: users:read]',
        verify:       'PATCH  /api/v1/schools/:id/verify      [admin: users:write]',
      },
      registrations: {
        register:     'POST   /api/v1/registrations           [student]',
        me:           'GET    /api/v1/registrations/me        [student]',
        list:         'GET    /api/v1/registrations           [admin: registrations:read]',
        get:          'GET    /api/v1/registrations/:id       [student own / admin]',
      },
      announcements: {
        list:         'GET    /api/v1/announcements           [guest / student / school / admin]',
        get:          'GET    /api/v1/announcements/:id       [guest / student / school / admin]',
        create:       'POST   /api/v1/announcements           [admin: announcements:write]',
        update:       'PATCH  /api/v1/announcements/:id       [admin: announcements:write]',
        delete:       'DELETE /api/v1/announcements/:id       [admin: announcements:write]',
      },
      results: {
        search:       'GET    /api/v1/results/search          [public]',
        me:           'GET    /api/v1/results/me              [student]',
        list:         'GET    /api/v1/results                 [admin: results:read]',
        create:       'POST   /api/v1/results                 [admin: results:write]',
        update:       'PATCH  /api/v1/results/:id             [admin: results:write]',
        delete:       'DELETE /api/v1/results/:id             [admin: results:write]',
      },
      cms: {
        get:          'GET    /api/v1/cms/:key                [public]',
        list:         'GET    /api/v1/cms                     [admin: cms:read]',
        upsert:       'POST   /api/v1/cms                     [admin: cms:write]',
      },
      dashboard: {
        stats:        'GET    /api/v1/dashboard/stats         [admin: dashboard:read]',
      },
      contact: {
        submit:       'POST   /api/v1/contact                 [public]',
        list:         'GET    /api/v1/contact                 [admin: contact:read]',
        get:          'GET    /api/v1/contact/:id             [admin: contact:read]',
        updateStatus: 'PATCH  /api/v1/contact/:id/status      [admin: contact:write]',
      },
    },
  });
});

module.exports = router;
