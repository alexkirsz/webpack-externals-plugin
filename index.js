var ModuleFilenameHelpers = require('webpack/lib/ModuleFilenameHelpers');
var ExternalModule = require('webpack/lib/ExternalModule');

function ExternalsPlugin(opts) {
  this.opts = opts;
}

ExternalsPlugin.prototype.apply = function(compiler) {
  var opts = this.opts;
  compiler.plugin('normal-module-factory', function(nmf) {
    nmf.plugin('factory', function(factory) {
      return function(data, callback) {
        factory(data, function(err, module) {
          if (err) {
            return callback(err);
          }
          if (ModuleFilenameHelpers.matchObject(opts, module.resource)) {
            return callback(null, new ExternalModule(
              data.dependency.request,
              opts.type || compiler.options.output.libraryTarget
            ));
          }
          callback(null, module);
        });
      };
    });
  });
};

module.exports = ExternalsPlugin;