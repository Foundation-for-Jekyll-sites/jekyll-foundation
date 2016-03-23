var argv          = require('yargs').argv;

// Check for --production flag
var isProduction = !!(argv.production);

module.exports = isProduction;
