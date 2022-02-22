const Message = require('../models/Message');
const mapMessage = require('../mappers/message');

module.exports.messageList = async function messages(ctx, next) {
  const messages = await Message.find({chat: ctx.user.id}).limit(20).sort({date: 'desc'});
  ctx.body = {
    messages: messages.map((message) => {
      return mapMessage(message);
    }).reverse()
  };
};
