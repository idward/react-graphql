//webpack
const reload = require('reload');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const webpackConfig = require('../webpack.config');
const compiler = webpack(webpackConfig);
//server
const exress = require('express');
const path = require('path');
const {MONGO_URI} = require('./config');
// const cors = require('cors');
const bodyParser = require('body-parser');
// const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
require('./services/auth')(passport);
const MongoStore = require('connect-mongo')(session);
const expressGraphQL = require('express-graphql');
require('./db/index')(MONGO_URI);
const schema = require('./schema/schema');

const app = exress();

//webpack middleware
app.use(webpackDevMiddleware(compiler, {
  publicPath: webpackConfig.output.publicPath,
  noInfo: true, // 设置为true禁用信息控制台日志记录
  quiet: true, // 设置为true禁用所有控制台日志记录
  stats: {
    colors: true
  }
}));
app.use(webpackHotMiddleware(compiler, {
  log: false,
  path: '/__webpack_hmr',
  heartbeat: 2000
}));

//static assets
app.use(exress.static(path.resolve(__dirname, '../client', 'public')));
//passport session
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
// app.use(cookieParser('keyboard cat'));

app.use(session({
  saveUninitialized: true,
  resave: false,
  store: new MongoStore({
    url: MONGO_URI,
    autoReconnect: true
  }),
  secret: 'keyboard cat',
  cookie: {
    httpOnly: true,
    maxAge: 2419200000,
    secure: false
  }
}));

app.use(passport.initialize());
app.use(passport.session());

// app.use(cors());
// const server = new ApolloServer({
//   schema,
//   context: ({req}) => ({
//     user: req.user,
//     req
//   })
// });
//
// server.applyMiddleware({app});

app.use('/graphql', expressGraphQL({
  schema,
  graphiql: true
}));

//entry page
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client', 'public', 'index.html'));
});

//reload(app);

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`Server is ready at ${port}`);
});