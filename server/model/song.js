const mongoose = require('mongoose');

const SongSchema = new mongoose.Schema({
  title: {type: String},
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  lyrics: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'lyric'
  }]
});

SongSchema.statics.addLyric = function (id, content) {
  const Lyric = mongoose.model('lyric');
  return this.findById(id)
    .then(song => {
      const lyric = new Lyric({content, song});
      song.lyrics.push(lyric);
      return Promise.all([lyric.save(), song.save()])
        .then(([lyric, song]) => song);
    });
}

SongSchema.statics.findUser = function (id) {
  return this.findById(id)
    .populate('user')
    .then(song => song.user);
}

SongSchema.statics.findLyrics = function (id) {
  return this.findById(id)
    .populate('lyrics')
    .then(song => song.lyrics);
}

module.exports = mongoose.model('song', SongSchema);