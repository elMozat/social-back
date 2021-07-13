const User = require('../models/User');
const router = require('express').Router();
const bcrypt = require('bcrypt');

//update user
router.put('/:id', async (req, res, next) => {
    if(req.body.userId === req.params.id || req.body.isAdmin) {
        try {
            const user = await User.findOneAndDelete(req.params.id);
            res.status(200).json("Account deleted successfully");
        } catch (err){
            console.log(err);
            return next(err);
        }
    } else {
        return res.status(403).json("You only update your account");
    }
});

//delete user
router.delete('/:id', async (req, res, next) => {
    if(req.body.userId === req.params.id || req.body.isAdmin) {

        try {
             await User.findOneAndDelete(req.params.id);
            return res.status(200).json("Account deleted successfully");
        } catch (err){
            console.log(err);
            return next(err);
        }
    } else {
        return res.status(403).json("You only can delete your account");
    }
})

//get a user
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        const { password, updatedAt, ...other } = user._doc
        res.status(200).json(other)
    } catch (err) {
        res.status(500).json(err);
    }
})

//follow a user

router.put('/:id/follow', async (req, res) => {
    if(req.body.userId !== req.params.id) {
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            if(!user.followers.includes(req.body.userId)) {
                await user.updateOne({ $push: { followers: req.body.userId } });
                await currentUser.updateOne({ $push: {followins: req.params.id } });
                res.status(200).json("user has been followed");
            } else {
                res.status(403).json("you already following this user");
            }
        } catch (err){
            res.status(500).json(err);
        }
    } else {
        res.status(403).json("you cant follow yourself");
    }
});

//unfollow a user

router.put('/:id/unfollow', async (req, res) => {
    if(req.body.userId !== req.params.id) {
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            if(user.followers.includes(req.body.userId)) {
                await user.updateOne({ $pull: { followers: req.body.userId } });
                await currentUser.updateOne({ $pull: {followins: req.params.id } });
                res.status(200).json("user has been unfollowed");
            } else {
                res.status(403).json("you already unfollowing this user");
            }
        } catch (err){
            res.status(500).json(err);
        }
    } else {
        res.status(403).json("you cant unfollow yourself");
    }
});

module.exports = router;