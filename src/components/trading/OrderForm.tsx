import { FC, useState, FormEvent, ChangeEvent } from 'react';

type OrderType = 'buy' | 'sell';

interface OrderFormProps {
  onSubmit?: (orderData: { asset: string; quantity: string; orderType: OrderType }) => void;
}

const OrderForm: FC<OrderFormProps> = ({ onSubmit }) => {
    const [asset, setAsset] = useState('');
    const [quantity, setQuantity] = useState('');
    const [orderType, setOrderType] = useState<OrderType>('buy');

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (onSubmit) {
            onSubmit({ asset, quantity, orderType });
        }
        console.log(`Submitting ${orderType} order for ${quantity} of ${asset}`);
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-4">
            <div className="space-y-2">
                <label htmlFor="asset" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Asset:
                </label>
                <input
                    type="text"
                    id="asset"
                    value={asset}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setAsset(e.target.value)}
                    required
                    className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
            </div>
            <div className="space-y-2">
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Quantity:
                </label>
                <input
                    type="number"
                    id="quantity"
                    value={quantity}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setQuantity(e.target.value)}
                    required
                    className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
            </div>
            <div className="space-y-2">
                <label htmlFor="orderType" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Order Type:
                </label>
                <select
                    id="orderType"
                    value={orderType}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => setOrderType(e.target.value as OrderType)}
                    className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                    <option value="buy">Buy</option>
                    <option value="sell">Sell</option>
                </select>
            </div>
            <button 
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
                Submit Order
            </button>
        </form>
    );
};

export default OrderForm;