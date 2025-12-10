const User = require('../models/userModel.js')
const userModel = require('../models/userModel.js')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

module.exports = {
    getHomePage: (req, res) => {
        res.json({ data: "home page" })
    },

    getUsers: (req, res, next) => {
        userModel.find()
            .then((users) => {

                res.status(200).json({ data: users })
            })
            .catch((err) => {
                next(err)
            })
        // res.json({ data: [{ name: 'ahmed', id: 1 }, { name: 'hambozo', id: 2 }, { name: 'reus', id: 3 }] })
    },

  createUser: async (req, res, next) => {
    try {
        let hashedPassword = await bcrypt.hash(req.body.password, 10)

        let user = new User({
            role: req.body.role,
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
            ssn: req.body.ssn || undefined,
            phone: req.body.phone || undefined,
            location: req.body.location,
            profileImage: req.body.profileImage
        })

        await user.save()
        res.status(200).json({ message: "user created" })
    }
    catch (err) {
        next(err)
    }
},

    userUpdated: async (req, res) => {
        console.log(req.params);
        await userModel.updateOne({ _id: req.params.id }, { $set: req.body })

        res.status(200).json({ message: "user updated" })
    },
 getSpecificUser: async (req, res, next) => {
    try {
        const user = await userModel.findOne({ email: req.body.email });

        if (!user) {
            return res.status(400).json({ msg: "User not found" });
        }

        const isPasswordValid = await bcrypt.compare(req.body.password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ msg: "Invalid password" });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            'secret',
            { expiresIn: "7d" }
        );

        res.status(200).json({
            msg: "logged in successfully",
            token: token,
            user: {
                id: user._id,
                role: user.role,
                email: user.email,
                name: user.name
            }
        });

    } catch (err) {
        next(err);
    }
}
,
    getUser: (req, res, next) => {
        userModel.find({ _id: req.params.id })
            .then((users) => {

                res.status(200).json({ data: users })
            })
            .catch((err) => {
                next(err)
            })
    },
}

