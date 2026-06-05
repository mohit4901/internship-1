const express = require('express');
const router  = express.Router();

// ── Feature Routers ──────────────────────────────────────────────────────────
const authRouter         = require('./auth.routes');
const olympiadRouter     = require('./olympiad.routes');
const schoolRouter       = require('./school.routes');
const mediaRouter        = require('./media.routes');
const announcementRouter = require('./announcement.routes');
const cmsRouter          = require('./cms.routes');
const dashboardRouter    = require('./dashboard.routes');
const contactRouter      = require('./contact.routes');
const studentRouter      = require('./student.routes');
const registrationRouter = require('./registration.routes');
const resultRouter       = require('./result.routes');

// ── Mount Routes ─────────────────────────────────────────────────────────────
router.use('/auth',          authRouter);
router.use('/olympiads',     olympiadRouter);
router.use('/schools',       schoolRouter);
router.use('/media',         mediaRouter);
router.use('/announcements', announcementRouter);
router.use('/cms',           cmsRouter);
router.use('/dashboard',     dashboardRouter);
router.use('/contact',       contactRouter);
router.use('/students',      studentRouter);
router.use('/registrations', registrationRouter);
router.use('/results',       resultRouter);

// ── API Index ─────────────────────────────────────────────────────────────────
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'BAIO API v1 is live.',
    version: '1.0.0',
    endpoints: {
      auth: {
        admin:  '/api/v1/auth/admin/(register|login|logout|me)',
        school: '/api/v1/auth/school/(register|login|logout|me)',
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
      schools: {
        me:              'GET    /api/v1/schools/me              [school]',
        updateMe:        'PATCH  /api/v1/schools/me              [school]',
        participants:    'POST   /api/v1/schools/me/participants [school] — batch submit student list',
        getParticipants: 'GET    /api/v1/schools/me/participants [school]',
        list:            'GET    /api/v1/schools                 [admin: users:read]',
        get:             'GET    /api/v1/schools/:id             [admin: users:read]',
        verify:          'PATCH  /api/v1/schools/:id/verify      [admin: users:write]',
      },
      announcements: {
        list:   'GET    /api/v1/announcements           [public]',
        get:    'GET    /api/v1/announcements/:id       [public]',
        create: 'POST   /api/v1/announcements           [admin: announcements:write]',
        update: 'PATCH  /api/v1/announcements/:id       [admin: announcements:write]',
        delete: 'DELETE /api/v1/announcements/:id       [admin: announcements:write]',
      },
      cms: {
        get:    'GET    /api/v1/cms/:key                [public]',
        list:   'GET    /api/v1/cms                     [admin: cms:read]',
        upsert: 'POST   /api/v1/cms                     [admin: cms:write]',
      },
      dashboard: {
        stats: 'GET    /api/v1/dashboard/stats         [admin: dashboard:read]',
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
