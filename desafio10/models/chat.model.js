import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
    user: String,
    menssage: String
  });
  
  export const chatModel = mongoose.model('chat', chatSchema);
