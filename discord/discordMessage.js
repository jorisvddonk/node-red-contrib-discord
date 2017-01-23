module.exports = function(RED) {
    var discordBotManager = require('./lib/discordBotManager.js');

    function discordMessage(config) {
        RED.nodes.createNode(this, config);
        var configNode = RED.nodes.getNode(config.token);
        var node = this;        
        var callbacks = [];
        discordBotManager.getBot(configNode).then(function(bot){
            node.status({fill:"green", shape:"dot", text:"ready"});

            var registerCallback = function(eventName, listener) {
                callbacks.push({'eventName': eventName, 'listener': listener});
                bot.on(eventName, listener);
            }
            registerCallback('message', message => {
                console.log(bot.status);
                if (message.author !== bot.user) {
                    var msgid = RED.util.generateId();
                    var msg = {_msgid:msgid}
                    msg.payload = message.content;
                    msg.channel = message.channel.id;
                    msg.author = message.author.id;
                    node.send(msg);                
                }
            });
            registerCallback('error', error => {
                node.error(error);
                node.status({fill:"red", shape:"dot", text:"error"});
            });
            node.on('close', function() {
                callbacks.forEach(function(cb){
                    bot.removeListener(cb.eventName, cb.listener);
                });
                discordBotManager.closeBot(bot);
            });
        }).catch(function(err){
            node.error(err);
            node.status({fill:"red", shape:"dot", text:"wrong token?"});
        });
    }
    RED.nodes.registerType("discordMessage", discordMessage);
};