import { Decimal128 } from "bson";
import mongoose, {Schema} from "mongoose";

const orderSchema = new Schema({
    userId: {
            type : Schema.Types.ObjectId,
            ref: "User"
    },
    amount:{
        type: Number,
        default: 0
    }
},
{
    timestamps: true
}
)

export const Ordcer = mongoose.model("Order", orderSchema)