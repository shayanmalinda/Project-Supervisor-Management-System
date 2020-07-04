const express = require('express');
const router = express.Router();
const Users = require('../models/users');

//Get 
router.route('/:id').get(function(req, res) {
    let id = req.params.id;
    console.log("Message requested");
    Users.findOne({indexNumber:id}, function(err, message) {
        if (err) {
            console.log(err);
        } else {
            res.json(message);
            
        }
    });
});

module.exports = router