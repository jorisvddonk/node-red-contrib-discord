module.exports = function (RED) {
  var discordBotManager = require('./lib/discordBotManager.js');
  const {
    Attachment
  } = require('discord.js');

  function discordSendMessage(config) {
    RED.nodes.createNode(this, config);
    var node = this;
    var configNode = RED.nodes.getNode(config.token);
    discordBotManager.getBot(configNode).then(function (bot) {
      node.on('input', function (msg) {
        var msgId = msg.id;
        if (msgId && typeof msgId !== 'string') {
          if (msgId.hasOwnProperty('id')) {
            msgId = msgId.id;
          } else {
            msgId = undefined;
          }
        }

        var channel = config.channel || msg.channel;
        if (channel && typeof channel !== 'string') {
          if (channel.hasOwnProperty('id')) {
            channel = channel.id;
          } else {
            channel = undefined;
          }
        }

        if (channel) {
          var channelInstance = bot.channels.get(channel);
          if (channelInstance) {

            let attachment = null;
            if (msg.attachment) {
              attachment = new Attachment(msg.attachment);
            }

            if (msgId) {
              const message = channel.fetchMessage(msgId);
              if (message) {
                message.edit(msg.payload).then(function () {
                  node.status({
                    fill: "green",
                    shape: "dot",
                    text: "message sent"
                  });
                }).catch(function (err) {
                  node.error("Couldn't send to channel:" + err);
                  node.status({
                    fill: "red",
                    shape: "dot",
                    text: "send error"
                  });
                });
              } else {
                node.error(`Couldn't edit message: Message not found.`);
                node.status({
                  fill: "red",
                  shape: "dot",
                  text: "error"
                });
              };
            } else {
              channelInstance.send(msg.payload, attachment).then(function () {
                node.status({
                  fill: "green",
                  shape: "dot",
                  text: "message sent"
                });
              }).catch(function (err) {
                node.error("Couldn't send to channel:" + err);
                node.status({
                  fill: "red",
                  shape: "dot",
                  text: "send error"
                });
              });
            };
          } else {
            node.error(`Couldn't send to channel '${channel}': channel not found.`);
            node.status({
              fill: "red",
              shape: "dot",
              text: "error"
            });
          }
        }
      });
      node.on('close', function () {
        discordBotManager.closeBot(bot);
      });
    });
  }
  RED.nodes.registerType("discordSendMessage", discordSendMessage);
};
