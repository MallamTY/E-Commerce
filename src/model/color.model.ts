// Packages
import mongoose from 'mongoose';


const colorSchema = new mongoose.Schema(
  {
    product: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'Product'
      }
    ],
    color: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

const Color = mongoose.model('Color', colorSchema);

export default Color;
