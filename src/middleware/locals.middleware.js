const createLocals = async (req, res, next) => {
  if (req.isAuthenticated()) {
    res.locals.links = [
      { href: '/', text: 'OdinFiles' },
      { href: '/auth/logout', text: 'Log Out' },
    ];
  } else {
    res.locals.links = [
      { href: '#', text: 'OdinFiles' },
      { href: '/auth/login', text: 'Log In' },
      { href: '/auth/register', text: 'Register' },
    ];
  }

  res.locals.errors = [];
  res.locals.formData = [];

  next();
};

export default createLocals;
