const path = require('path');
module.exports = {
  entry: './src/static/js/main.js',
  output: {
    path: path.resolve(__dirname, 'public/js'),
    filename: 'main.js'
  }
};