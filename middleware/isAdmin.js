// Middleware to check if user is authenticated and is an admin
module.exports = function isAdmin(req, res, next) {
  // Check if user is authenticated
  if (req.isAuthenticated()) {
    // Check if the authenticated user is an admin
    if (req.user) {
      return next(); // User is authenticated and is an admin
    }
  }
  
  // If not authenticated or not an admin, redirect to login page
  req.flash('error', 'Please log in to access the admin area');
  return res.redirect('/admin');
};