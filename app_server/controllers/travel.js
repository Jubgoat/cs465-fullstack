const travel = (req, res) => {
  res.render('travel', { title: 'Travlr Getaways' });
};

module.exports = {
  travel,
}; 
/* Get travel view. */