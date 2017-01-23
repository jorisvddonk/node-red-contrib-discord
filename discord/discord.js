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
                msg.discord_message = message;
                msg.discord = bot;
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

    function discordSendMessage(config) {
        RED.nodes.createNode(this, config);
        var configNode = RED.nodes.getNode(config.token);
        var bot = discordBotManager.getBot(configNode);
    
        this.on('input', function(msg) {
            bot.channels.get(config.channel || msg.channel).send(msg.payload);
        });
        this.on('close', function() {
            discordBotManager.closeBot(bot);
        });
    }
    RED.nodes.registerType("discordSendMessage", discordSendMessage);

    function discordClient(config) {
        RED.nodes.createNode(this, config);
        var configNode = RED.nodes.getNode(config.token);
        var bot = discordBotManager.getBot(configNode);
        var node = this;
        this.on('input', function(msg) {
            msg.discord = bot;
            node.send(msg);
        });
        this.on('close', function() {
            discordBotManager.closeBot(bot);
        });
    }
    RED.nodes.registerType("discordClient", discordClient);

    function DiscordTokenNode(n) {
        RED.nodes.createNode(this,n);
        this.token = this.credentials.token;
        this.name = n.name;
    }
    RED.nodes.registerType("discord-token", DiscordTokenNode, {
        credentials: {
            token: {type:"text"}
        }
    });
}