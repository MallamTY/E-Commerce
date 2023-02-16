import mongoose from "mongoose";


const orderSchema = new mongoose.Schema({
    contactdetails: {
        types: String,
        trim: true,
        phone: {
            type: Number,
            trim: true,
            minlength: [11, `Phone number can't be less than 11 characters`]
        },
        name: {
            type: String,
            trim: true,
            required: [true, `Receivers name can't be empty`]
        }
    },
    deliverymethod: {
        type: String,
        enum: ['Pickup Station', 'Door Delivery'],
        default: 'Pickup Station'
    },
    shippingmethod: {
        type: String,
        enum: ['express', 'abroad', 'non express']
    },
    subtotel: {
        type: Number,
        required: true,
    },
    deliveryfee: {
        type: Number,
        required: true
    },
    total: {
        type: Number,
        required: true
    },
    paymentmethod: {
        type: String,
        enum: ['Bank Transfer', 'USSD', 'Debit Card']
    }
})


const order = mongoose.model('Checkout', orderSchema);
export default order;