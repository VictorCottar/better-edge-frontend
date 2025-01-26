"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableHead, TableRow, TableCell, TableBody, TableHeader } from '@/components/ui/table';
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog';
import Header from '@/app/components/header';

const mockData = {
  clientes: [
    { id: 1, nome: ' Cliente A Cliente A Cliente A ', email: 'clienteA@example.com', status: 'Ativo' },
    { id: 2, nome: 'Cliente B', email: 'clienteB@example.com', status: 'Inativo' },
  ],
  ativos: [
    { id: 1, nome: 'Ativo X', email: 'ativoX@example.com', status: 'Ativo' },
    { id: 2, nome: 'Ativo Y', email: 'ativoY@example.com', status: 'Inativo' },
  ],
};

export default function Home() {
  const [selectedOption, setSelectedOption] = useState<'clientes' | 'ativos'>('clientes');
  const [data, setData] = useState(mockData[selectedOption]);

  const handleOptionChange = (option: 'clientes' | 'ativos') => {
    setSelectedOption(option);
    setData(mockData[option]); // Aqui você conectaria a lógica para buscar os dados reais
  };

  const handleAdd = () => {
    // Lógica para adicionar um novo cliente/ativo
    console.log(`Adicionando um novo ${selectedOption}`);
  };

  const handleEdit = (id: number) => {
    // Lógica para editar o cliente/ativo com ID especificado
    console.log(`Editando ${selectedOption} com ID: ${id}`);
  };

  return (
    <div className="grid grid-cols-8 grid-rows-8 min-h-screen p-8 font-[family-name:var(--font-inter-sans)]">
      <Header />
      <main className="row-span-7 col-span-8">
        <div className="flex justify-between items-center mt-4">
          <h1 className="text-xl underline underline-offset-8">
            Seja bem-vindo(a) ao controle de clientes e ativos!
          </h1>
        </div>

        <div className="flex justify-between mt-16">

          <div className='space-x-5'>
            <Button
              variant={selectedOption === 'clientes' ? 'default' : 'outline'}
              onClick={() => handleOptionChange('clientes')}
            >
              Clientes
            </Button>
            <Button
              variant={selectedOption === 'ativos' ? 'default' : 'outline'}
              onClick={() => handleOptionChange('ativos')}
            >
              Ativos
            </Button>

          </div>
          <div className="flex justify-end">
            <Dialog>
              <DialogTrigger asChild>
                <Button onClick={handleAdd}>Adicionar {selectedOption}</Button>
              </DialogTrigger>
              <DialogContent>
                {/* Conteúdo do modal de adição */}
                <h2>Adicionar {selectedOption}</h2>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className=" flex justify-center mt-10">
          <Table >
            <TableHeader>
              <TableRow className="font-bold">
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.nome}</TableCell>
                  <TableCell>{item.email}</TableCell>
                  <TableCell>{item.status}</TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button onClick={() => handleEdit(item.id)}>Editar</Button>
                      </DialogTrigger>
                      <DialogContent>
                        {/* Conteúdo do modal de edição */}
                        <h2>Editar {selectedOption}</h2>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

      </main>
    </div>
  );
}
