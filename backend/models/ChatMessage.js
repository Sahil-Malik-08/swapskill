import mongoose from 'mongoose';

const chatMessageSchema = new mongoose.Schema(
  {
    swapRequest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SwapRequest',
      required: true,
      index: true
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000
    }
  },
  { timestamps: true }
);

chatMessageSchema.index({ swapRequest: 1, createdAt: 1 });

export default mongoose.model('ChatMessage', chatMessageSchema);
