# node-red-contrib-discord

Noe-red nodes that allow you to interact with Discord.

Currently, you can write simple request-reply bots with this.

# Example bot

A simple Discord bot that replies with the reverse of any received message that contains the string 'hello':

    [{"id":"80df3061.aa44d","type":"tab","label":"Flow 1"},{"id":"39ffc50e.3e343a","type":"discordMessage","z":"80df3061.aa44d","name":"","token":"","x":279,"y":344,"wires":[["b046f00c.6ae94"]]},{"id":"28f8e2a5.b912de","type":"function","z":"80df3061.aa44d","name":"reverse payload message","func":"msg.payload = msg.payload.split('').reverse().join('');\nreturn msg;","outputs":1,"noerr":0,"x":743,"y":345,"wires":[["fd40145e.3aac88"]]},{"id":"b046f00c.6ae94","type":"switch","z":"80df3061.aa44d","name":"","property":"payload","propertyType":"msg","rules":[{"t":"cont","v":"hello","vt":"str"}],"checkall":"true","outputs":1,"x":483,"y":347,"wires":[["28f8e2a5.b912de"]]},{"id":"fd40145e.3aac88","type":"discordSendMessage","z":"80df3061.aa44d","name":"","channel":"","token":"","x":1001,"y":343,"wires":[]}]