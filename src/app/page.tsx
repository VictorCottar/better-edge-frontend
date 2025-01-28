'use client';

import Header from '@/app/components/header';
import ClientesTable from '@/app/components/clientesTable';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DialogTrigger } from '@radix-ui/react-dialog';
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { useState, useEffect } from 'react';
import { Ellipsis, Trash2 } from 'lucide-react';

export default function Home() {
  const [selectedOption, setSelectedOption] = useState<'clientes' | 'ativos'>('clientes');
  const [data, setData] = useState<unknown[]>([]);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [clienteId, setClienteId] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/${selectedOption}`);
        const result = await response.json();

        if (Array.isArray(result)) {
          setData(result);
        } else {
          console.error('Os dados recebidos não são um array:', result);
        }
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      }
    };

    fetchData();
  }, [selectedOption]);


  const handleCreateCliente = async () => {
    if (!nome || !email) {
      toast.error("Não foi possível criar o cliente, preencha todos os campos.");
      return;
    }
    try {
      const response = await fetch('http://localhost:3000/clientes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email }),
      });

      if (!response.ok) {
        toast.error("Erro ao criar cliente.");
        return;
      }

      const newCliente = await response.json();

      setData((prevData) => [newCliente, ...prevData]);

      toast.success("Cliente criado com sucesso!");

      setNome('');
      setEmail('');
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditCliente = async () => {
    try {
      const response = await fetch(`http://localhost:3000/clientes/${clienteId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email }),
      });

      if (!response.ok) {
        toast.error("Erro ao editar cliente.");
        return;
      }

      const updatedCliente = await response.json();

      // Verifique se data é um array antes de mapear
      setData((prevData) => {
        if (Array.isArray(prevData)) {
          return prevData.map((cliente) =>
            cliente.id === updatedCliente.id ? updatedCliente : cliente
          );
        } else {
          return []; // Retorne um array vazio se data não for um array
        }
      });

      toast.success("Cliente editado com sucesso!");
      setNome('');
      setEmail('');
      setClienteId(null);
    } catch (error) {
      console.error('Erro na edição do cliente:', error);
    }
  };

  const handleInativeCliente = async () => {
    try {
      const response = await fetch(`http://localhost:3000/clientes/inativar/${clienteId}`, {
        method: 'PUT',
      });

      if (!response.ok) {
        toast.error("Erro ao inativar o cliente.");
        return;
      }

      console.log(response);;

      const updatedCliente = await response.json();

      // Verifique se data é um array antes de mapear
      setData((prevData) => {
        if (Array.isArray(prevData)) {
          return prevData.map((cliente) =>
            cliente.id === updatedCliente.id ? updatedCliente : cliente
          );
        } else {
          return []; // Retorne um array vazio se data não for um array
        }
      });

      toast.success("Cliente inativado com sucesso!");
      setNome('');
      setEmail('');
      setClienteId(null);
    } catch (error) {
      console.error('Erro na edição do cliente:', error);
    }
  };

  const handleDeleteCliente = async () => {
    if (clienteId === null) {
      toast.error("Nenhum cliente selecionado para exclusão.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/clientes/${clienteId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        toast.error("Erro ao excluir o cliente.");
        return;
      }

      // Remover o cliente excluído da lista
      setData((prevData) =>
        prevData.filter((cliente: any) => cliente.id !== clienteId)
      );

      toast.success("Cliente excluído com sucesso!");
      setClienteId(null); // Resetar o ID após a exclusão
    } catch (error) {
      console.error('Erro ao deletar o cliente:', error);
      toast.error("Erro ao excluir o cliente.");
    }
  };


  const handleOptionChange = (option: 'clientes' | 'ativos') => {
    setSelectedOption(option);
  };

  return (
    <div className="grid grid-cols-8 grid-rows-12 min-h-screen p-8 font-[family-name:var(--font-inter-sans)]">
      <Header />
      <main className="row-span-11 col-span-8">
        <div className="flex justify-center mt-5">
          <h1 className="text-xl underline underline-offset-8">
            Seja bem-vindo(a) ao controle de clientes e ativos!
          </h1>
        </div>

        <div className="w-[85%] ml-auto mr-auto mt-10">
          <div className="flex justify-between mt-20">
            <div className="space-x-5">
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
                  <Button>Adicionar {selectedOption}</Button>
                </DialogTrigger>
                <DialogContent className='space-y-1 p-8'>
                  <DialogTitle>Adicionar cliente</DialogTitle>
                  <Label htmlFor="nome">Nome</Label>
                  <Input
                    type="text"
                    id="nome"
                    placeholder="Nome"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                  />
                  <Label htmlFor="email">Email</Label>
                  <Input
                    type="email"
                    id="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <DialogClose asChild>
                    <Button onClick={handleCreateCliente}>Salvar</Button>
                  </DialogClose>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          <div className="flex justify-center mt-10" >
            
            
            <Table>
              <TableHeader>
                <TableRow className="font-bold">
                  {selectedOption === 'clientes' ? ( 
                    <>
                      <TableHead>Nome</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Ativos</TableHead>
                    </>
                  ) : (
                    <>
                      <TableHead>Nome</TableHead>
                      <TableHead>Valor Atual</TableHead>
                    </>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((item: any) => (
                  <TableRow key={item.id}>
                    {selectedOption === 'clientes' ? (
                      <>
                        <TableCell className='w-[25%]'>{item.nome}</TableCell>
                        <TableCell className='w-[25%]'>{item.email}</TableCell>
                        <TableCell className='w-[15%]'>{item.status ? 'Ativo' : 'Inativo'}</TableCell>
                        <TableCell className='w-[30%]' >{Array.isArray(item.ativos) ? item.ativos.map((ativo: any) => ativo.nome).join(', ') : ''}</TableCell>
                      </>
                    ) : (
                      <>
                        <TableCell className='w-[35%]'>{item.nome}</TableCell>
                        <TableCell className='w-[35%]'>R$ {item.valorAtual}</TableCell>
                      </>
                    )}
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="icon" onClick={() => {
                            setClienteId(item.id);
                            setNome(item.nome);
                            setEmail(item.email);
                          }}
                          >
                            <Ellipsis />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className='space-y-1 p-8'>
                          <DialogTitle>Editar cliente</DialogTitle>
                          <Label htmlFor="nome">Nome</Label>
                          <Input
                            type="text"
                            id="nome"
                            placeholder="Nome"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                          />
                          <Label htmlFor="email">Email</Label>
                          <Input
                            type="email"
                            id="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                          />
                          <DialogClose asChild>
                            <Button onClick={handleEditCliente}>Editar</Button>
                          </DialogClose>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="icon" onClick={() => {
                            setClienteId(item.id);
                          }}
                          >
                            <Trash2 />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className='p-8'>
                          <DialogTitle>Excluir cliente</DialogTitle>
                          <DialogDescription className='text-md'>
                            Você quer excluir permanentemente este cliente ou inativá-lo?
                          </DialogDescription>

                          <DialogClose asChild>
                            <Button onClick={handleInativeCliente}>Inativar</Button>
                          </DialogClose>

                          <DialogClose asChild>
                            <Button onClick={handleDeleteCliente}>Excluir permanentemente</Button>
                          </DialogClose>

                        </DialogContent>

                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </main>
    </div>
  );
}
