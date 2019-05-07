const graphql = require('graphql');
const _ = require('lodash');
const {signup, login} = require('../services/auth_api');
const User = require('../model/user');
const Company = require('../model/company');
const Song = require('../model/song');
const Lyric = require('../model/lyric');
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLSchema
} = graphql;

//define company model
const CompanyType = new GraphQLObjectType({
  name: 'Company',
  fields: () => ({
    id: {type: GraphQLID},
    name: {type: GraphQLString},
    description: {type: GraphQLString},
    users: {
      type: new GraphQLList(UserType),
      resolve(parentValue, args) {
        return User.find({companyId: parentValue.id});
      }
    }
  })
});
//define user model
const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: {type: GraphQLID},
    name: {type: GraphQLString},
    email: {type: GraphQLString},
    password: {type: GraphQLString},
    age: {type: GraphQLInt},
    company: {
      type: CompanyType,
      resolve(parentValue, args) {
        return Company.findById(parentValue.companyId);
      }
    },
    songs: {
      type: new GraphQLList(SongType),
      resolve(parentValue, args) {
        return User.findSongs(parentValue.id);
      }
    }
  })
});
//define song model
const SongType = new GraphQLObjectType({
  name: 'Song',
  fields: () => ({
    id: {type: GraphQLID},
    title: {type: GraphQLString},
    user: {
      type: UserType,
      resolve(parentValue, args) {
        return Song.findUser(parentValue.id)
      }
    },
    lyrics: {
      type: new GraphQLList(LyricType),
      resolve(parentValue, args) {
        return Song.findLyrics(parentValue.id);
      }
    }
  })
});
//define lyric model
const LyricType = new GraphQLObjectType({
  name: 'Lyric',
  fields: () => ({
    id: {type: GraphQLID},
    song: {
      type: SongType,
      resolve(parentValue, args) {
        console.log(parentValue.id);
        return Lyric.findById(parentValue.id)
          .then(lyric => lyric.song);
      }
    },
    likes: {type: GraphQLInt},
    content: {type: GraphQLString}
  })
});

//define rootQuery
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    user: {
      type: UserType,
      resolve(parentValue, args, req) {
        return req.user;
      }
    },
    company: {
      type: CompanyType,
      args: {id: {type: GraphQLID}},
      resolve(parentValue, args) {
        return Company.findById(args.id);
      }
    },
    songs: {
      type: new GraphQLList(SongType),
      resolve(parentValue, args) {
        return Song.find({});
      }
    },
    song: {
      type: SongType,
      args: {id: {type: new GraphQLNonNull(GraphQLID)}},
      resolve(parentValue, args) {
        return Song.findById(args.id);
      }
    },
    lyric: {
      type: LyricType,
      args: {id: {type: new GraphQLNonNull(GraphQLID)}},
      resolve(parentValue, args) {
        return Lyric.findById(args.id);
      }
    }
  }
});

//define mutation
const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addUser: {
      type: UserType,
      args: {
        name: {type: new GraphQLNonNull(GraphQLString)},
        age: {type: new GraphQLNonNull(GraphQLInt)},
        companyId: {type: GraphQLID}
      },
      resolve(parentValue, {name, age}) {
        return (new User({name, age})).save();
      }
    },
    deleteUser: {
      type: UserType,
      args: {id: {type: new GraphQLNonNull(GraphQLID)}},
      resolve(parentValue, args) {
        return User.findByIdAndRemove(args.id);
      }
    },
    editUser: {
      type: UserType,
      args: {
        id: {type: new GraphQLNonNull(GraphQLID)},
        name: {type: GraphQLString},
        age: {type: GraphQLInt},
        companyId: {type: GraphQLID}
      },
      resolve(parentValue, args) {
        return User.findByIdAndUpdate(args.id, args);
      }
    },
    addCompany: {
      type: CompanyType,
      args: {
        name: {type: new GraphQLNonNull(GraphQLString)},
        description: {type: new GraphQLNonNull(GraphQLString)}
      },
      resolve(parentValue, {name, description}) {
        return (new Company({name, description})).save();
      }
    },
    addSong: {
      type: SongType,
      args: {title: {type: new GraphQLNonNull(GraphQLString)}},
      resolve(parentValue, {title}) {
        return (new Song({title})).save();
      }
    },
    addLyricToSong: {
      type: SongType,
      args: {
        songId: {type: new GraphQLNonNull(GraphQLID)},
        content: {type: new GraphQLNonNull(GraphQLString)}
      },
      resolve(parentValue, {songId, content}) {
        return Song.addLyric(songId, content);
      }
    },
    likeLyric: {
      type: LyricType,
      args: {id: {type: new GraphQLNonNull(GraphQLID)}},
      resolve(parentValue, args) {
        return Lyric.like(args.id);
      }
    },
    deleteSong: {
      type: SongType,
      args: {id: {type: new GraphQLNonNull(GraphQLID)}},
      resolve(parentValue, args) {
        return Song.findByIdAndRemove(args.id);
      }
    },
    signup: {
      type: UserType,
      args: {
        email: {type: new GraphQLNonNull(GraphQLString)},
        password: {type: new GraphQLNonNull(GraphQLString)}
      },
      resolve(parentValue, {email, password}, req) {
        return signup({email, password, req});
      }
    },
    login: {
      type: UserType,
      args: {
        email: {type: new GraphQLNonNull(GraphQLString)},
        password: {type: new GraphQLNonNull(GraphQLString)}
      },
      resolve(parentValue, {email, password}, req) {
        return login({email, password, req});
      }
    },
    logout: {
      type: UserType,
      resolve(parentValue, args, req) {
        const user = req.user;
        req.logout();
        return user;
      }
    }
  }
});

//define graphql schema
module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
});