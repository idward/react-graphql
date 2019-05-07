const mongoose = require('mongoose');

const LyricSchema = new mongoose.Schema({
  song: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'song'
  },
  likes: {type: Number, default: 0},
  content: {type: String}
});

LyricSchema.statics.like = function (id) {
  const Lyric = mongoose.model('lyric');
  return Lyric.findById(id)
    .then(lyric => {
      ++lyric.likes;
      return lyric.save();
    });
}

module.exports = mongoose.model('lyric', LyricSchema);