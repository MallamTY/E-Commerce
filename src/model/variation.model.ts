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

const Variation = mongoose.model('Variation', colorSchema);

export default Variation;
