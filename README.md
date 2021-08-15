# node-red-contrib-discord

**This project is deprecated and no longer maintained actively. Consider migrating to [node-red-contrib-discord-advanced](https://github.com/Markoudstaal/node-red-contrib-discord-advanced).**

Node-red nodes that allow you to interact with Discord, via [Discord.js](https://discord.js.org).
Currently, you can write simple request-reply bots with this.
Though node-red-contrib-discord is production ready for small bots, it's a new project that might be difficult to use for those unfamiliar with Discord.js. It also hasn't been used yet for large Discord bot deployments.

# Installation

Run the following command in `~/.node-red`:

    npm install node-red-contrib-discord

# Nodes

node-red-contrib-discord gives you access to three nodes:

* discordMessage is a node with no inputs and one output allowing you to receive notifications of incoming messages.
* discordSendMessage is a node with one input and no outputs allowing you to send and edit messages in a Discord channel.
* discordDeleteMessage is a node with one input and no outputs allowing the deletion of existing messages.
* discordClient is an advanced deprecated node with one input and one output allowing you to inject a references to a [Discord.js Client](https://discord.js.org/#/docs/main/stable/class/Client) into a message. This node can cause node-red to crash if you use it improperly, so take caution. Messages containing a Discord.js Client reference can *not* be forked (e.g. sent to two nodes), so you'll have to manually remove the reference to the Client via a function node using `delete msg.discord`.

# Changelog

See `CHANGELOG.md` for more info, including information regarding breaking changes per version.

# Discord.js client sharing

All nodes share Discord.js clients based on the `discord-token` that they were configured with. That means that, when you add many `discordMessage` nodes configured with the exact same token, only a single connection with Discord will be made.

# Example bot

A simple Discord bot that replies with the reverse of any received message that contains the string 'hello':

    [{"id":"80df3061.aa44d","type":"tab","label":"Flow 1"},{"id":"39ffc50e.3e343a","type":"discordMessage","z":"80df3061.aa44d","name":"","token":"","x":279,"y":344,"wires":[["b046f00c.6ae94"]]},{"id":"28f8e2a5.b912de","type":"function","z":"80df3061.aa44d","name":"reverse payload message","func":"msg.payload = msg.payload.split('').reverse().join('');\nreturn msg;","outputs":1,"noerr":0,"x":743,"y":345,"wires":[["fd40145e.3aac88"]]},{"id":"b046f00c.6ae94","type":"switch","z":"80df3061.aa44d","name":"","property":"payload","propertyType":"msg","rules":[{"t":"cont","v":"hello","vt":"str"}],"checkall":"true","outputs":1,"x":483,"y":347,"wires":[["28f8e2a5.b912de"]]},{"id":"fd40145e.3aac88","type":"discordSendMessage","z":"80df3061.aa44d","name":"","channel":"","token":"","x":1001,"y":343,"wires":[]}]
