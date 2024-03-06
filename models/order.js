
const mongoose = require('mongoose')

 

const orderSchema = new mongoose.Schema({

    user: {

        type: mongoose.Schema.Types.ObjectId, ref: 'Student'

    },

    product: {

        type: mongoose.Schema.Types.ObjectId, ref: 'Product'

    },

    name: {

        type: String,

    },

    image: {

        type: String,

    },

    price: {

        type: String,

    },

    quantity: {

        type: String,

    }

})

 

module.exports = mongoose.model("Order", orderSchema)