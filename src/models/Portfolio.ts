export interface PortfolioItem {
    asset: string;
    quantity: number;
    purchasePrice: number;
    currentPrice: number;
}

export interface Portfolio {
    userId: string;
    holdings: PortfolioItem[];
    totalValue: number;
    createdAt: Date;
    updatedAt: Date;
}

import mongoose, { Schema, Document } from 'mongoose';

const PortfolioSchema: Schema = new Schema({
    userId: { type: String, required: true },
    holdings: [
        {
            asset: { type: String, required: true },
            quantity: { type: Number, required: true },
            purchasePrice: { type: Number, required: true },
            currentPrice: { type: Number, required: true },
        },
    ],
    totalValue: { type: Number, required: true },
}, { timestamps: true });

const PortfolioModel = mongoose.model<Portfolio & Document>('Portfolio', PortfolioSchema);

export default PortfolioModel;