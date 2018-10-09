var express = require('express');
var Comment = require('../schemas/comment');

var router = express.Router();

//promise로 만든 router
/*
router.get('/:id', function(req, res, next){
    Comment.find({ commenter: req.params.id }).populate('commenter')
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
    const comment = new Comment({
        commenter: req.body.id,
        comment: req.body.comment,
    });
    comment.save()
        .then((result) => {
            return Comment.populate(result, { path: 'commenter' });
        })
        .then((result) => {
            res.status(201).json(result);
        })
        .catch((err) => {
            console.error(err);
            next(err);
        });
});

router.patch('/:id', function(req, res, next){
    Comment.update({ _id: req.params.id }, { comment: req.body.comment })
        .then((result) => {
            res.json(result);
        })
        .catch((err) => {
            console.error(err);
            next(err);
        });
});

router.delete('/:id', function(req,res,next){
    Comment.destroy({ _id: req.params.id })
        .then((result) => {
            res.json(result);
        })
        .catch((err) => {
            console.error(err);
            next(err);
        });
});
*/

//async,await으로 만든 라우터
router.get('/:id', async(req, res, next) => {
    try{
        const comments = await Comment.find({ commenter: req.params.id }).populate('commenter');
        console.log(comments);
        res.json(comments);
    }catch(error){
        console.error(error);
        next(error);
    };
});

router.post('/', async(req, res, next) => {
    const comment = new Comment({
        commenter: req.body.id,
        comment: req.body.comment,
    });
    try{
        let result = await comment.save();
        result = await Comment.populate(result, {path: 'commenter'});
        res.status(201).json(result);
    }catch(error){
        console.error(error);
        next(error);
    };
});

router.patch('/:id', async(req, res, next) => {
    try{
        const result = await Comment.update({ _id: req.params.id }, { comment: req.body.comment });
        res.json(result);
    }catch(error){
        console.error(error);
        next(error);
    };
});

router.delete('/:id', async(req, res, next) => {
    try{
        const result = await Comment.destroy({ _id: req.params.id });
        res.json(result);
    }catch(error){
        console.error(error);
        next(error);
    };
});


module.exports = router;