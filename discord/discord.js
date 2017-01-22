module.exports = function(RED) {
    const Discord = require('discord.js');
    var bots = new Map();
    var getOrCreateBot = function(configNode) {
        var bot = undefined;
        if (bots.get(configNode) === undefined) {
            bot = new Discord.Client();
            bot.login(configNode.token);
            bots.set(configNode, bot);
        } else {
            bot = bots.get(configNode);
        }
        bot.numReferences = (bot.numReferences || 0) + 1;
        return bot;
    };
    var maybeDestroyBot = function(bot) {
        bot.numReferences -= 1;
        setTimeout(function(){
            if (bot.numReferences === 0) {
                bot.destroy();
                for (var i of bots.entries()) {
                    if (i[1] === bot) {
                        bots.delete(i[0]);
                    }
                }
            }
        }, 1000);
    };

    function discordMessage(config) {
        RED.nodes.createNode(this, config);
        var configNode = RED.nodes.getNode(config.token);
        var bot = getOrCreateBot(configNode);
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
            maybeDestroyBot(bot);
        });
    }
    RED.nodes.registerType("discordMessage", discordMessage);

    function discordSendMessage(config) {
        RED.nodes.createNode(this, config);
        var configNode = RED.nodes.getNode(config.token);
        var bot = getOrCreateBot(configNode);
    
        this.on('input', function(msg) {
            bot.channels.get(config.channel || msg.channel).send(msg.payload);
        });
        this.on('close', function() {
            maybeDestroyBot(bot);
        });
    }
    RED.nodes.registerType("discordSendMessage", discordSendMessage);

    function discordClient(config) {
        RED.nodes.createNode(this, config);
        var configNode = RED.nodes.getNode(config.token);
        var bot = getOrCreateBot(configNode);
        var node = this;
        this.on('input', function(msg) {
            msg.discord = bot;
            node.send(msg);
        });
        this.on('close', function() {
            maybeDestroyBot(bot);
        });
    }
    RED.nodes.registerType("discordClient", discordClient);

    function DiscordTokenNode(n) {
        RED.nodes.createNode(this,n);
        this.token = n.token;
        this.name = n.name;
    }
    RED.nodes.registerType("discord-token", DiscordTokenNode, {
        credentials: {
            token: {type:"text"}
        }
    });
}