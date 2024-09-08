

'use strict'

#===========================================================================================================
{ spawnSync,  }           = require 'node:child_process'
{ lstatSync,  }           = require 'node:fs'
{ resolve,    }           = require 'node:path'
{ log, error, }           = console
{ rpr, }                  = require './inspect'
runs_as_cli               = module is require.main


#===========================================================================================================
exists = ( path ) ->
  try
    stats = lstatSync path
  catch error
    return false if error.code is 'ENOENT'
    throw error
  return stats.isFile() or stats.isDirectory()

#-----------------------------------------------------------------------------------------------------------
@trash = ( path ) ->
  return 0 unless exists path
  path_rpr  = rpr path
  js_source = "import trash from 'trash';await trash(process.env.path)"
  cwd       = resolve __dirname, '..'
  cfg       = { encoding: 'utf-8', env: { path, }, cwd, }
  { stdout
    stderr
    status } = spawnSync process.execPath, [ '-e', js_source, ], cfg
  #.........................................................................................................
  unless status is 0
    throw new Error stderr unless runs_as_cli
    #.......................................................................................................
    command_line = "#{process.execPath} -e #{js_source}"
    error "something when wrong when trying to execute #{rpr command_line}"
    error rpr command_line
    error()
    error stderr
    process.exit status
  #.........................................................................................................
  return 1 unless exists path
  return 0


#===========================================================================================================
if runs_as_cli then await do =>
  unless ( path = process.argv[ 2 ] )?
    log "provide a path to a file system object you want to move to the trash"
    process.exit 111
  log "trash #{path}", await @trash path

