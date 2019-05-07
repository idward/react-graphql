const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const UserSchema = new mongoose.Schema({
  name: {type: String, default: ''},
  email: {type: String, unique: true},
  password: {type: String},
  age: {type: Number, default: null},
  companyId: {type: String},
  songs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'song'
  }]
});

UserSchema.pre('save', function (next) {
  const user = this;
  if (!user.isModified('password')) {
    return next();
  }
  bcrypt.genSalt(10, (err, salt) => {
    if (err) return next(err);
    bcrypt.hash(user.password, salt, null, (err, hash) => {
      if (err) return next(err);
      user.password = hash;
      return next();
    });
  });
});

UserSchema.methods.comparePassword = function (candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    return cb(err, isMatch);
  });
}

UserSchema.static.findSongs = function (id) {
  return this.findById(id)
    .populate('songs')
    .then(user => user.songs);
}

module.exports = mongoose.model('user', UserSchema);

