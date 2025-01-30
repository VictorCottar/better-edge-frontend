import { Bitcoin } from 'lucide-react';

export default function Header() {
  return (
    <header className="flex justify-start items-center gap-4 row-span-2 col-span-8">
      <Bitcoin size={62} />
      <h1 className='text-3xl'>Escritório Invest</h1>
    </header>
  );
}