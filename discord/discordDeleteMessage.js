module.exports = function (RED) {
  var discordBotManager = require('./lib/discordBotManager.js');

  function discordDeleteMessage(config) {
    RED.nodes.createNode(this, config);
    var node = this;
    var configNode = RED.nodes.getNode(config.token);
    discordBotManager.getBot(configNode).then(function (bot) {
      node.on('input', function (msg) {
        const msgId = msg.id;
        const channelId = msg.channel;
        const timeDelay = msg.timedelay || 0;
        console.log(timeDelay);

        bot.channels.fetch(channelId).then((channelInstance) => {
          channelInstance.messages.fetch(msgId).then(message => {
            message.delete({
              timeout: timeDelay
            }).then(deletedMessage => {
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
          node.error(error);
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
