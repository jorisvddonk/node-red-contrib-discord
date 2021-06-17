module.exports = function (RED) {
  var discordBotManager = require('./lib/discordBotManager.js');
  const {
    MessageAttachment
  } = require('discord.js');

  function discordSendMessage(config) {
    RED.nodes.createNode(this, config);
    var node = this;
    var configNode = RED.nodes.getNode(config.token);
    discordBotManager.getBot(configNode).then(function (bot) {
      node.on('input', function (msg) {
        var msgId = undefined || msg.id;

        var channel = config.channel || msg.channel;
        if (!channel) {
          channel = undefined;
        }

        let attachment = null;
        if (msg.attachment) {
          attachment = new MessageAttachment(msg.attachment);
        }

        if (channel) {
          bot.channels.fetch(channel).then((channelInstance) => {
            if (msgId) {
              channelInstance.messages.fetch(msgId).then(message => {
                message.edit(msg.payload).then(function () {
                  node.status({
                    fill: "green",
                    shape: "dot",
                    text: "message sent"
                  });
                }).catch(function (err) {
                  node.error("Couldn't edit message:" + err);
                  node.status({
                    fill: "red",
                    shape: "dot",
                    text: "Error while editing message"
                  });
                });
              }).catch(error => {
                node.error(`Couldn't find the message: ${error}`);
                node.status({
                  fill: "red",
                  shape: "dot",
                  text: "Couldn't find supplied message with supplied message ID"
                });
              });
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
          }).catch(error => {
            node.error(`Couldn't find the supplied channel ID: ${error}`);
            node.status({
              fill: "red",
              shape: "dot",
              text: `Couldn't find channel with the supplied channel ID...`
            });
          })
        };

        node.on('close', function () {
          discordBotManager.closeBot(bot);
        });
      });
    });
  }
  RED.nodes.registerType("discordSendMessage", discordSendMessage);
};
