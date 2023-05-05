import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const customerSchema = new Schema ({
    name: String,
    product_id: String
})

const Customer = mongoose.model('customer', customerSchema);

export {Customer, customerSchema};