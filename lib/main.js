(async function() {
  'use strict';
  var error, exists, log, lstatSync, resolve, rpr, runs_as_cli, spawnSync;

  //===========================================================================================================
  ({spawnSync} = require('node:child_process'));

  ({lstatSync} = require('node:fs'));

  ({resolve} = require('node:path'));

  ({log, error} = console);

  ({rpr} = require('./inspect'));

  runs_as_cli = module === require.main;

  //===========================================================================================================
  exists = function(path) {
    var stats;
    try {
      stats = lstatSync(path);
    } catch (error1) {
      error = error1;
      if (error.code === 'ENOENT') {
        return false;
      }
      throw error;
    }
    return stats.isFile() || stats.isDirectory();
  };

  //-----------------------------------------------------------------------------------------------------------
  this.trash = function(path) {
    var cfg, command_line, cwd, js_source, path_rpr, status, stderr, stdout;
    if (!exists(path)) {
      return 0;
    }
    path_rpr = rpr(path);
    // js_source = "import trash from 'trash';console.log('Ω___1',process.env);await trash(process.env.path)"
    js_source = "import trash from 'trash';await trash(process.env.path)";
    cwd = resolve(__dirname, '..');
    cfg = {
      encoding: 'utf-8',
      env: {path},
      cwd
    };
    ({stdout, stderr, status} = spawnSync(process.execPath, ['-e', js_source], cfg));
    //.........................................................................................................
    if (status !== 0) {
      if (!runs_as_cli) {
        throw new Error(stderr);
      }
      //.......................................................................................................
      command_line = `${process.execPath} -e ${js_source}`;
      error(`something when wrong when trying to execute ${rpr(command_line)}`);
      error(rpr(command_line));
      error();
      error(stderr);
      process.exit(status);
    }
    if (!exists(path)) {
      //.........................................................................................................
      // log 'Ω___2', stdout
      return 1;
    }
    return 0;
  };

  //===========================================================================================================
  if (runs_as_cli) {
    await (async() => {
      var path;
      if ((path = process.argv[2]) == null) {
        log("provide a path to a file system object you want to move to the trash");
        process.exit(111);
      }
      return log(`trash ${path}`, (await this.trash(path)));
    })();
  }

  // log "trash #{path}", await @foo path

}).call(this);

//# sourceMappingURL=main.js.map