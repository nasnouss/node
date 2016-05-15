// load the todo model

var User = require('./../../models/user');

// expose the routes to our app with module.exports
module.exports = function(router) {



/* *************************************** */
/*                  DELETES                */ 
/* *************************************** */


router.route('/user/logout')


// delete the User with this id (accessed at DELETE http://localhost:8080/api/Users/:User_id)
    .delete(function(req, res) {
           // take the token      
  var tokenReq = req.body.token || req.query.token || req.headers['x-access-token'];
        User.remove({
            token: tokenReq
        }, function(err, User) {
            if (err)
                res.send(err);

            res.json({ message: 'Successfully logedout' });
        });
    });

 // create delete API for the friend and all other liste variables 

};
