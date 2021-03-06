const express = require('express');
const router = express.Router();
const GroupChat = require('../models/groupChat');
const verify = require('../authentication');

router.get('/:id', (req, res) => {
    const id = req.params.id;

    GroupChat
        .find({ groupId: id })
        .exec()
        .then(data => {
            res.json({ state: true, data: data, msg: 'Data successfully sent..!' })
        })
        .catch(err => {
            res.send({ state: false, msg: err.message })
        })
})

router.post('/', verify, async (req, res) => {
    const existing = await GroupChat.findOne({ groupId: req.body.groupId });
    if (!existing) {
        const newChat = new GroupChat({
            groupId: req.body.groupId,
            messages: [{
                userId: req.body.userId,
                // profileImage: req.body.profileImage,
                // userName: req.body.sender,
                message: req.body.content
            }]
        })
        newChat.save()
            .then(data => {
                res.json({
                    groupId: req.body.groupId,
                    // userName: req.body.sender,
                    userId: req.body.userId,
                    message: req.body.content,
                    // profileImage: req.body.profileImage
                })
            })
            .catch(err => {
                res.send({ state: false, msg: err.message })
            })
    }
    else {
        GroupChat
            .find({ groupId: req.body.groupId })
            .updateOne(
                {
                    $push: {
                        messages: {
                            // profileImage: req.body.profileImage,
                            userId: req.body.userId,
                            // userName: req.body.sender,
                            message: req.body.content
                        }
                    }
                }
            )
            .exec()
            .then(data => {
                res.json({
                    groupId: req.body.groupId,
                    // userName: req.body.sender,
                    userId: req.body.userId,
                    message: req.body.content,
                    // profileImage: req.body.profileImage
                })
            })
            .catch(err => {
                res.send({ state: false, msg: err.message })
            })
    }
})

module.exports = router