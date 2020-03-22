module.exports = {
    ensureAuthenticated: function(req, res, next) {
      if (req.isAuthenticated()) {
        return next();
      }
      req.flash('error_msg', 'Please log in to view that resource');
      res.redirect('/user/login');
    },
    forwardAuthenticated: function(req, res, next) {
      
      if (!req.isAuthenticated()) {
        return next();
      }
      res.redirect('/dashboard');      
    },
    'facebookAuth':{
      'clientID':'749124565545811',
      'clientSecret':'fae1b483f7864caaf90b429dc6f74894',
      'callbackURL':'https://localhost:3000/auth/facebook/callback',
    }





  };
  