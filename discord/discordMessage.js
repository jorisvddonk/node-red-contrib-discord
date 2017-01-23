module.exports = function(RED) {
    var discordBotManager = require('./lib/discordBotManager.js');

    function discordMessage(config) {
        RED.nodes.createNode(this, config);
        var configNode = RED.nodes.getNode(config.token);
        var bot = discordBotManager.getBot(configNode);
        var node = this;        
        var callbacks = [];
        var registerCallback = function(eventName, listener) {
            callbacks.push({'eventName': eventName, 'listener': listener});
            bot.on(eventName, listener);
        }
        registerCallback('message', message => {
            if (message.author !== bot.user) {
                var msgid = RED.util.generateId();
                var msg = {_msgid:msgid}
                msg.payload = message.content;
                msg.channel = message.channel.id;
                msg.author = message.author.id;
                node.send(msg);                
            }
        });
        this.on('close', function() {
            callbacks.forEach(function(cb){
                bot.removeListener(cb.eventName, cb.listener);
            });
            discordBotManager.closeBot(bot);
        });
    }
    RED.nodes.registerType("discordMessage", discordMessage);
};