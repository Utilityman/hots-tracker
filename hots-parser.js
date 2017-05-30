'use strict';

const fs = require('fs');

module.exports = {
    /*
      takes json params in the form of an account
      and a session which should contain a user
      expects a callback with params (err, user_result)
    */
  parseTmpFile : function (callback) {
    var sys = require('util')
    var exec = require('child_process').exec;
    var child;
    // hard coded tmp file
    child = exec("python heroprotocol/heroprotocol.py --details tmp.StormReplay", function (error, stdout, stderr) {
      console.log('stdout: ' + stdout);
      console.log('stderr: ' + stderr);
      if (error !== null) {
        console.log('exec error: ' + error);
      }
      callback(stdout);
    });
  }
};
