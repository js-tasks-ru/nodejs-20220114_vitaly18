const User = require('../../models/User');

module.exports = async function authenticate(strategy, email, displayName, done) {
  try {
    if (!email) {
      return done(null, false, 'Не указан email');
    }
    const user = await User.findOne({email});
    if (user) {
      return done(null, user);
    }
    const newUser = new User({ email, displayName });
    await newUser.save();
    const newUserDoc = await User.findOne({email});
    if (newUserDoc) {
      return done(null, newUserDoc);
    }
    done(null, false, 'Аутентификация не удалась.');
  } catch (err) {
    done(err);
  }
};
