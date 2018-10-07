var express = require('express');
var User = require('../models').User;

var router = express.Router();

/* GET main 접속 */
router.get('/', function(req, res, next) {
  User.findAll()
    .then((users) => {
      res.render('sequelize', { users} );
    })
    .catch((err) => {
      console.error(err);
      next(err);
    })
});


/* async/await으로 작성 
router.get('/', async (req, res, next) => {
  try {
    const users = await User.findAll();
    res.render('sequelize', { users });
  }catch(error) {
    console.error(error);
    next(error)
  }
});
*/

module.exports = router;
