'use client';

import Header from '@/app/components/header';
import ClientesTable from '@/app/components/clientesTable';
import AtivosTable from '@/app/components/ativosTable';
import SelectedOption from '@/app/components/selectedOption';
import { useState } from 'react';

export default function Home() {
  const [selectedOption, setSelectedOption] = useState<'clientes' | 'ativos'>('clientes');

  return (
    <div className="grid grid-cols-8 grid-rows-12 min-h-screen p-8 font-[family-name:var(--font-inter-sans)]">
      <Header />
      <main className="row-span-11 col-span-8">
        <div className="flex justify-center mt-5">
          <h1 className="text-xl underline underline-offset-8">
            Seja bem-vindo(a) ao controle de clientes e ativos !
          </h1>
        </div>
        <div className="w-[85%] ml-auto mr-auto mt-10">
          <div className="flex justify-between mt-20">
            <div className="space-x-5">
              <SelectedOption
                selectedOption={selectedOption}
                onOptionChange={setSelectedOption}
              />
            </div>
          </div>
          <div className="flex justify-center mt-10" >
            {selectedOption === 'clientes' ? <ClientesTable /> : <AtivosTable />}
          </div>
        </div>
      </main>
    </div>
  );
}
