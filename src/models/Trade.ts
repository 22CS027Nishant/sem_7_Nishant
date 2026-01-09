export interface Trade {
    id: string;
    userId: string;
    asset: string;
    quantity: number;
    price: number;
    tradeType: 'buy' | 'sell';
    timestamp: Date;
}

import mongoose, { Schema, Document } from 'mongoose';

const tradeSchema: Schema = new Schema({
    userId: { type: String, required: true },
    asset: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    tradeType: { type: String, enum: ['buy', 'sell'], required: true },
    timestamp: { type: Date, default: Date.now }
});

const TradeModel = mongoose.model<Trade & Document>('Trade', tradeSchema);

export default TradeModel;