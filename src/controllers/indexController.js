const getIndexPage = (req, res) => {
  res.render('index', { title: 'Home' });
};

export { getIndexPage };
