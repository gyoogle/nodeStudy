var express = require('express');
var { User, Comment } = require('../models');

var router = express.Router();

// promise로 작성
/*
router.get('/:id', function(req, res, next){
    Comment.findAll({
        include: {
            model: User,
            where: { id: req.params.id },
        },
    })
        .then((comments) => {
            console.log(comments);
            res.json(comments);
        })
        .catch((err) => {
            console.error(err);
            next(err);
        });
});


router.post('/', function(req, res, next){
    Comment.create({
        commenter: req.body.id,
        comment: req.body.comment,
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

router.patch('/:id', function(req, res, next) {
    Comment.update({ comment: req.body.comment}, { where: { id: req.params.id } })
        .then((result) => {
            res.json(result);
        })
        .catch((err) => {
            console.error(err);
            next(err);
        });
});

router.delete('/:id', function(req, res, next) {
    Comment.destroy({ where: {id: req.params.id } })
        .then((result) =>{
            res.json(result);
        })
        .catch((err) => {
            console.error(err);
            next(err);
        });
});
*/

//async,await으로 작성
router.get('/:id', async(req, res, next) => {
    try{
        const comments = await Comment.findAll({
            include: { 
                model: User, 
                where: { id: req.params.id },
            },
        });
        console.log(comments);
        res.json(comments);
    }catch(error){
        console.error(error);
        next(error);
    };
});

router.post('/', async(req, res, next) => {
    try{
        const result = await Comment.create({
            commenter: req.body.id,
            comment: req.body.comment,
        });
        console.log(result);
        res.status(201).json(result);
    }catch(error){
        console.error(error);
        next(error);
    };
});

router.patch('/:id', async(req, res, next) => {
    try{
        const result = await Comment.update({ comment: req.body.comment }, { where: { id: req.params.id }});
        res.json(result);
    }catch(error){
        console.error(error);
        next(error);
    };
});

router.delete('/:id', async(req, res, next) => {
    try{
        const result = await Comment.destroy({ where: {id : req.params.id} });
        res.json(result);
    }catch(error){
        console.error(error);
        next(error);
    }
});

module.exports = router;