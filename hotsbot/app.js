'use strict';

const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('../config.json');
const https = require('https');
const fs = require('fs');
const tracker = require('../hots-parser');

let botChannels = [];
let mainChannel;

client.login(config.token);

client.on('ready', () => {
  console.log('INIT: hotsbot started up');

  client.channels.forEach(function (ele) {
    if(ele.name.toUpperCase().includes('BOT')) {
      botChannels.push(ele);
    }
  });

  mainChannel = client.channels.find('name', 'hotsbots');

  if (typeof mainChannel === 'undefined') {
    console.log('INFO: error getting hotsbots');
  }
  if (botChannels.length === 0) {
    console.log('INFO: no bot channels available -- adding all');
    client.channels.forEach(function (ele) {
      if (ele.name.toUpperCase().includes('GENERAL')) {
        ele.send('Because there are no bot channels, I made them all bot channels');
      }
      botChannels.push(ele);
    });
  }

  console.log('RUNNING: hotsbot initialized');

  botChannels.forEach(function (ele) {
    console.log('INFO: watching ' + ele.name);
  });
});

client.on('message', (message) => {
  if (message.attachments) {
    message.attachments.forEach(function (ele) {
      let url = ele['url'];
      var file = fs.createWriteStream("tmp.StormReplay");
      var request = https.get(url, function(response) {
        response.pipe(file);
        tracker.parseTmpFile(function (data) {
          if (data === '') data = 'NOTHING';
          sendMessage(message, 'I tried to parse the file, but I only got ' + data + ' back from the server');
          sendMessage(message, 'Ironic. The command could run from the terminal... but not my program.')
        });
      });
    });
  }

  if (!message.content.startsWith(config.prefix) || message.author.bot) return;

  if (message.content.startsWith(config.prefix + 'ping')) {
    let params = getParams(message.content);

    if (params.length === 0) params.push(1);
    if (isNaN(params[0])) params[0] = 1;

    for (let i = 0; i < parseInt(params[0]); i++) {
      sendMessage(message, 'pong!');
    }
  }
});

function getParams(content) {
  let params = content.split(' ');
  params.shift();
  return params;
}

function sendMessage(message, sendMsg) {
  message.channel.send(sendMsg);
  console.log('SENT: ' + sendMsg);
}
