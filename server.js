var path = require('path');
var webpack = require('webpack');
var express = require('express');
var config = require('./webpack.config');

var app = express();

console.log("debug ", process.env.NODE_ENV, process.env.DEBUG === 'true')
if(process.env.DEBUG === 'true'){
  var compiler = webpack(config);

  app.use(require('webpack-dev-middleware')(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath,
    historyApiFallback: true
  }));

  app.use(require('webpack-hot-middleware')(compiler));
} else {

  app.use('/static', express.static('dist'));
}

app.use('/data', express.static('data'));
app.use('/assets', express.static('assets'));
app.use('/filelist.txt', function(req, res){
  res.send(404);
});
app.get('/tundra.json', function(req, res) {
  res.sendFile(path.join(__dirname, 'tundra.json'));
});

app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(3000, 'localhost', function (err, result) {
  if (err) {
    console.log(err);
  }

  console.log('Listening at localhost:3000');
});
