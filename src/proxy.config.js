const PROXY_CONFIG = [
  {
    context: ['/auth/login', '/auth/refreshtoken', '/todos'],
    target: 'http://localhost:3000',
    secure: false,
  },
];

module.exports = PROXY_CONFIG;
