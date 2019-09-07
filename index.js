const debug = require('debug')('app:startup');
const mongoose = require('mongoose');
const users = require('./routes/users');
const posts = require('./routes/posts');
const auth = require('./routes/auth');
const comments = require('./routes/comments');
const config = require('config');
const morgan = require('morgan');
const helmet = require('helmet');
const logger = require('./logger');
const express = require('express');
const app = express();

app.use(express.json());
app.use(helmet());

app.use('/api/users', users);
app.use('/api/posts', posts);
app.use('/api/auth', auth);
app.use('/api/comments', comments);

if(!config.get('jwtPrivateKey')) {
  debug("FATAL ERROR: jwtPrivateKey not defined!");
  process.exit(1);
}


mongoose.connect('mongodb://localhost/rProject', {useNewUrlParser: true, useCreateIndex: true})
  .then(() => debug('database connected...'))
  .catch(() => debug('database not connected..'))

if(app.get('env') === 'development') {
  app.use(morgan('tiny'));
  debug('Morgan enabled...');
}


app.set('view engine', 'pug');
app.set('views', './views');

app.get('/', (req, res) => {
  res.render('index', {title: 'My Express App', message: 'Express App'});
});

const port = process.env.PORT || 3000;
app.listen(port, () => debug(`server listening on port ${port}...`));