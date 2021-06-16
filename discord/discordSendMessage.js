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
        var msgId = undefined || msg.id;

        var channel = config.channel || msg.channel;
        if (!channel) {
          channel = undefined;
        }

        // let attachment = null;
        // if (msg.attachment) {
        //   attachment = new Attachment(msg.attachment);
        // }

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
                    text: "send error"
                  });
                });
              }).catch(error => {
                node.error(`Something went wrong: ${error}`);
                node.status({
                  fill: "red",
                  shape: "dot",
                  text: "send error"
                });
              });
            } else {
              channelInstance.send(msg.payload).then(function () {
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
            node.error(`Something went wrong: ${error}`);
            node.status({
              fill: "red",
              shape: "dot",
              text: error
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
