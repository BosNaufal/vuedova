#! /usr/bin/env node
var program = require('commander')
var fs = require('fs')
var exec = require('child_process').exec
var Promise = require('es6-promise').Promise
var appFolder = "";

function promiseExec(cmd,msg) {
  if(msg) console.log(msg);
  return new Promise(function(ok,fail){
    exec(cmd, function(err){
      if(err) fail(err);
      ok();
    });
  });
}

function deleteWWW() {
  return promiseExec('rm '+appFolder+'/www -R')
}

function addVueDovaStarter() {
  return promiseExec('cd '+appFolder+' && git clone https://github.com/BosNaufal/vuedova-starter.git && mv vuedova-starter www && npm install', 'Add VueDova Starter...')
}

function building() {
  return deleteWWW().then(addVueDovaStarter)
}


program
  .version('0.0.1')
  .command('create <dir> [dev] [app]')
  .action(function (folder, dev, app) {
    appFolder = process.cwd()+'/'+folder

    if(folder && dev && app) return exec('cordova create '+folder+' '+dev+' '+app, nextCommands(folder));

    if(folder && dev) return exec('cordova create '+folder+' '+dev, nextCommands(folder));

    if(folder) return promiseExec('cordova create '+folder, 'Creating Cordova Project...').then(building)


  });

program.parse(process.argv);
