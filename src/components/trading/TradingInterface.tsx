import { FC } from 'react';
import PriceChart from './PriceChart';
import OrderForm from './OrderForm';

const Trading: FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
        Trading Interface
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PriceChart />
        <OrderForm />
      </div>
    </div>
  );
};

export default Trading;