var gte = require("semver").gte;

var version = process.version;

if (gte(version, "8.0.0")) {
  module.exports = require("./index__8.0.0__.spec.js");
} else if (gte(version, "6.0.0")) {
  module.exports = require("./index__6.0.0__.spec.js");
} else if (gte(version, "4.0.0")) {
  module.exports = require("./index__4.0.0__.spec.js");
} else if (gte(version, "0.12.0")) {
  module.exports = require("./index__0.12.0__.spec.js");
} else {
  module.exports = require("./index__0.10.0__.spec.js");
}
