import { Conversation, Message, User } from '../models/index.js';
import { HttpError } from '../middleware/http.js';

export async function conversationFor(id, user) {
  const conversation = await Conversation.findById(id);
  if (!conversation || ![String(conversation.student), String(conversation.owner)].includes(user.id)) throw new HttpError(404, 'Conversation not found');
  return conversation;
}
export async function sendMessage(id, user, text, io) {
  const conversation = await conversationFor(id, user);
  const recipient = String(conversation.student) === user.id ? conversation.owner : conversation.student;
  if (!await User.exists({ _id: recipient, active: true })) throw new HttpError(409, 'Recipient is unavailable');
  const message = await Message.create({ conversation: id, sender: user._id, recipient, text });
  await Conversation.updateOne({ _id: id }, { $set: { updatedAt: message.createdAt } });
  io?.to(`user:${conversation.student}`).to(`user:${conversation.owner}`).emit('message:new', message);
  return message;
}
