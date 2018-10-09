var express = require('express');
var User = require('../models').User;

var router = express.Router();

/*
router.get('/', function(req, res, next) {
  User.findAll()
    .then((users) => {
      res.json(users);
    })
    .catch((err) => {
      console.error(err);
      next(err);
    });
});
*/

// async,await
router.get('/', async(req, res, next) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch(error) {
    console.error(error);
    next(error);
  }
});

/*
router.post('/', function(req, res, next) {
  User.create({
    name: req.body.name,
    age: req.body.age,
    married: req.body.married,
  })
    .then((result) => {
      console.log(result);
      res.status(201).json(result);
    })
    .catch((err) => {
      console.error(err);
      next(err);
    });
});
*/

router.post('/', async(req, res, next) => {
  try{
    const result = await User.create({
      name: req.body.name,
      age: req.body.age,
      married: req.body.married,
    });
    console.log(result);
    res.status(201).json(result);
  }catch(error){
    console.error(error);
    next(error);
  };
});

module.exports = router;
