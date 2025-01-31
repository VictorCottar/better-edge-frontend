import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";

interface Cliente {
  id: number;
  nome: string;
  email: string;
  status: boolean;
  ativos: { nome: string }[]; // Se os 'ativos' são um array de objetos com 'nome'
}

interface AddClienteProps {
  onCreateCliente: (newCliente: Cliente) => void;
}

export default function AddCliente({ onCreateCliente }: AddClienteProps) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  
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

      onCreateCliente(newCliente);

      toast.success("Cliente criado com sucesso!");

      setNome('');
      setEmail('');
    } catch (error) {
      console.error(error);
    }
  };

  return (

    <Dialog>
      <DialogTrigger asChild>
        <Button className='w-44'>Adicionar cliente</Button>
      </DialogTrigger>
      <DialogContent className='space-y-1 p-8'>
        <DialogTitle>Adicionar cliente</DialogTitle>
        <DialogDescription>
          Preencha os campos abaixo para adicionar um novo cliente.
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
        <Button onClick={handleCreateCliente}>Adicionar</Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  )
}
