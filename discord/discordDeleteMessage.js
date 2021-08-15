module.exports = function (RED) {
  var discordBotManager = require('./lib/discordBotManager.js');

  function discordDeleteMessage(config) {
    RED.nodes.createNode(this, config);
    var node = this;
    var configNode = RED.nodes.getNode(config.token);
    discordBotManager.getBot(configNode).then(function (bot) {
      node.on('input', function (msg) {
        var channel = config.channel || msg.channel;
        if (!msg.id || !channel) {
          node.error(`Either msg.id or config/msg.channel wasn't set`);
          node.status({
            fill: "red",
            shape: "dot",
            text: `msg.id and config/msg.channel are required`
          })
          return;
        }

        var msgId = msg.id;
        if (msgId && typeof msgId !== 'string') {
          if (msgId.hasOwnProperty('id')) {
            msgId = msgId.id;
          } else {
            node.error(`msg.Id needs to be either a string for the id or channel Object`);
            node.status({
              fill: "red",
              shape: "dot",
              text: `msg.id is not a string or Object`
            })
            return;
          }
        }

        if (channel && typeof channel !== 'string') {
          if (channel.hasOwnProperty('id')) {
            channel = channel.id;
          } else {
            channel = undefined;
            node.error(`channel needs to be either a string for the id or channel Object`);
            node.status({
              fill: "red",
              shape: "dot",
              text: `channel is not a string or Object`
            })
            return;
          }
        }

        bot.channels.fetch(channel).then((channelInstance) => {
          channelInstance.messages.fetch(msgId).then(message => {
            message.delete({}).then(deletedMessage => {
              node.status({
                fill: "green",
                shape: "dot",
                text: `Message ${deletedMessage.id} deleted`
              });
            }).catch(error => {
              node.error(`Couldn't delete message: ${error}`);
              node.status({
                fill: "red",
                shape: "dot",
                text: `Couldn't delete message`
              });
            })
          }).catch(error => {
            node.error(`Couldn't find message: ${error}`);
            node.status({
              fill: "red",
              shape: "dot",
              text: `Couldn't find message`
            });
          });
        }).catch(error => {
          node.error(`Couldn't find channel: ${error}`);
          node.status({
            fill: "red",
            shape: "dot",
            text: `Couldn't find channel with id: ${channel}`
          });
        });

        node.on('close', function () {
          discordBotManager.closeBot(bot);
        });
      });
    });
  }
  RED.nodes.registerType("discordDeleteMessage", discordDeleteMessage);
};
