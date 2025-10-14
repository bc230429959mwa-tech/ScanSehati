import mongoose from 'mongoose';



const ContactMessageSchema = new mongoose.Schema({
  _id: { type: String, required: true, },
  name: { type: String, required: true },
  message: { type: String, required: true, maxlength: 300 },
  fromEmail: { type: String, required:true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.ContactMessage ||
  mongoose.model('ContactMessage', ContactMessageSchema);