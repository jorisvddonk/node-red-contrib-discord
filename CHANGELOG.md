# Changelog

## 4.0.1

* Added ability to send attachments. Simply set `msg.attachment` to a path to a local file or public URL to add it as an attachment to a message.

## 4.0.0

* BREAKING CHANGE: `msg.channel` and `msg.author` are once again objects.

## 3.0.0

* BREAKING CHANGE: Reverted the change in 2.0.0. This was causing too many issues (such as #4). The `channel` and `author` properties are now IDs instead of objects. This also means that it's no longer possible to send messages to users by modifying the node-red message appropriately (`msg.channel = msg.author`).
* BREAKING CHANGE: The full Discord message data is no longer accessible via the emitted node-red message's `data` property. This was a bit of an antipattern that shouldn't have been included.

## 2.0.x

* BREAKING CHANGE: When receiving a message from Discord, the `channel` and `author` properties of the emitted node-red message will now contain full objects instead of IDs.

## 1.0.0 - 1.0.4:

Initial publicly usable versions of `node-red-contrib-discord`.