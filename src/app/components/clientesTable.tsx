import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from '@/components/ui/button';
import AddCliente from '@/app/components/addCliente';
import { Ellipsis, Trash2, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface Cliente {
  id: number;
  nome: string;
  email: string;
  status: boolean;
  ativos: { nome: string }[]; // Se os 'ativos' são um array de objetos com 'nome'
}

export default function ClientesTable() {
  const [data, setData] = useState<Cliente[]>([]);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [clienteId, setClienteId] = useState<number | null>(null);

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
        prevData.filter((cliente) => cliente.id !== clienteId)
      );

      toast.success("Cliente excluído com sucesso!");
      setClienteId(null); // Resetar o ID após a exclusão
    } catch (error) {
      console.error('Erro ao deletar o cliente:', error);
      toast.error("Erro ao excluir o cliente.");
    }
  };

  const handleCreateCliente = (newCliente: Cliente) => {
    setData((prevData) => [newCliente, ...prevData]);
  };
 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/clientes`);
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
  }, []);

  return (
    <>
      <div className='flex flex-col w-full gap-6'>
        <div className='flex justify-end'>
          <AddCliente onCreateCliente={handleCreateCliente}/>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="font-bold">
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Ativos</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="w-[25%]">{item.nome}</TableCell>
                <TableCell className="w-[25%]">{item.email}</TableCell>
                <TableCell className="w-[15%]">{item.status ? 'Ativo' : 'Inativo'}</TableCell>
                <TableCell className="w-[30%]">
                  {Array.isArray(item.ativos) ? item.ativos.map((ativo) => ativo.nome).join(', ') : ''}
                </TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="icon" onClick={() => setClienteId(item.id)}>
                        <Plus />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="p-8">
                      <DialogTitle>Adicionar um ativo</DialogTitle>
                      <DialogDescription className="text-md">
                        Escolha um ativo para adicionar
                      </DialogDescription>
                      <Select>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecione o ativo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Ativos</SelectLabel>
                            <SelectItem value="apple">Apple</SelectItem>
                            <SelectItem value="banana">Banana</SelectItem>
                            <SelectItem value="blueberry">Blueberry</SelectItem>
                            <SelectItem value="grapes">Grapes</SelectItem>
                            <SelectItem value="pineapple">Pineapple</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <DialogClose asChild>
                        <Button>Adicionar</Button>
                      </DialogClose>
                    </DialogContent>
                  </Dialog>
                </TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="icon" onClick={() => {
                        setClienteId(item.id);
                        setNome(item.nome);
                        setEmail(item.email);
                      }}>
                        <Ellipsis />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="space-y-1 p-8">
                      <DialogTitle>Editar cliente</DialogTitle>
                      <DialogDescription>
                        Altere os campos abaixo para editar o cliente.
                      </DialogDescription>
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
                      <Button variant="outline" size="icon" onClick={() => setClienteId(item.id)}>
                        <Trash2 />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="p-8">
                      <DialogTitle>Excluir cliente</DialogTitle>
                      <DialogDescription className="text-md">
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
    </>
  );
};