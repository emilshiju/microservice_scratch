import mongoose from 'mongoose';

const { Schema } = mongoose;

const CustomerSchema = new Schema({
    email: String,
    password: String,
    salt: String,
    phone: String,
    address: [
        { type: Schema.Types.ObjectId, ref: 'address', required: true }
    ],
    cart: [
        {
            product: { 
                _id:{type:String,required:true},
                name:{type:String},
                banner:{type:String},
                price:{type:String}
            },
            unit: { type: Number, required: true }
        }
    ],
    wishlist: [
        { 
            _id:{type:String,required:true},
            name:{type:String},
            description:{type:String},
            banner:{type:String},
            available:{type:Boolean},
            price:{type:String}
         }
    ],
    orders: [
        { 
            _id:{type:String,required:true},
            amount:{type:String},
            date:{type:Date,default:Date.now()}
         }
    ]
}, {
    toJSON: {
        transform(doc, ret) {
            delete ret.password;
            delete ret.salt;
            delete ret.__v;
        }
    },
    timestamps: true
});

export default mongoose.model('customer', CustomerSchema);
