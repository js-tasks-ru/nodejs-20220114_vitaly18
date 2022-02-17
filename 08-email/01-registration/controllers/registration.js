const { v4: uuid } = require('uuid');
const User = require('../models/User');
const sendMail = require('../libs/sendMail');

module.exports.register = async (ctx, next) => {
    try {
        const token = uuid();
        const {email, displayName, password} = ctx.request.body;
        const newUser = await User.create({
            email,
            displayName,
            verificationToken: token,
        });
        await newUser.setPassword(password);
        await newUser.save();
        await sendMail({
            template: 'confirmation',
            locals: {token: 'token'},
            to: email,
            subject: 'Подтвердите почту',
        });

        ctx.status = 200;
        ctx.body = { status: 'ok' };
    } catch (err) {
        ctx.throw(400, err);
    }
};

module.exports.confirm = async (ctx, next) => {
    try {
        const {verificationToken} = ctx.request.body;
        const user = await User.findOne({verificationToken});

        if (!user) {
            ctx.status = 400;
            ctx.body = {error: 'Ссылка подтверждения недействительна или устарела'};
            return;
        }
        user.verificationToken = undefined;
        await user.save();
        ctx.status = 200;
        ctx.body = {token: verificationToken};
    } catch (err) {
        ctx.throw(400, err);
    }
};
