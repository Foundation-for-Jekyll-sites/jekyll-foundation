var fs          = require('fs');
var yaml        = require('js-yaml');

function loadConfig() {
  var ymlFile = fs.readFileSync('gulp/config.yml', 'utf8');
  return yaml.load(ymlFile);
}

var config = loadConfig();

module.exports = config;
