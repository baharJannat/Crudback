const express = require('express');
const router = express.Router();
const User = require('../models/user');


router.post('/',async(req,res)=>{
    const user =  new User(req.body);
    await user.save();
    res.json(user);
});

router.get('/',async(req , res)=>{
    const users = await User.find();
    res.json(users)
});

router.put('/:id',async(req,res)=>{
    const updatedUser = await User.findByIdAndUpdate(req.params.id,req.body, {new:true});
    res.json(updatedUser)
});

router.delete('/:id', async(req,res)=>{
    await User.findByIdAndDelete(req.params.id);
    res.json({message:'user deleted'})
});

router.patch('/:id', async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    if (!updatedUser) return res.status(404).json({ message: 'User not found' });
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;