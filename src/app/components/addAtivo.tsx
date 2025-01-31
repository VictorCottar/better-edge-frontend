import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";

interface Ativo {
  nome: string,
  valorAtual: number,
  clienteId?: number
}

interface AddAtivoProps {
  onCreateAtivo: (newAtivo: Ativo) => void;
}

export default function AddAtivo({ onCreateAtivo }: AddAtivoProps) {
  const [nome, setNome] = useState('');
  const [valorAtual, setValorAtual] = useState<number>();


  const handleCreateAtivo= async () => {
    if (!nome || !valorAtual) {
      toast.error("Não foi possível criar o ativo, preencha todos os campos.");
      return;
    }
    try {
      const response = await fetch('http://localhost:3000/ativos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, valorAtual }),
      });

      if (!response.ok) {
        toast.error("Erro ao criar ativo.");
        return;
      }

      const newAtivo = await response.json();

      onCreateAtivo(newAtivo);

      toast.success("Ativo criado com sucesso!");

      setNome('');
      setValorAtual(undefined);
    } catch (error) {
      console.error(error);
    }
  };

  return (

    <Dialog>
      <DialogTrigger asChild>
        <Button className='w-44'>Adicionar ativo</Button>
      </DialogTrigger>
      <DialogContent className='space-y-1 p-8'>
        <DialogTitle>Adicionar ativo</DialogTitle>
        <DialogDescription>
          Preencha os campos abaixo para adicionar um novo ativo.
        </DialogDescription>
        <Label htmlFor="nome">Nome</Label>
        <Input
          type="text"
          id="nome"
          placeholder="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />
        <Label htmlFor="valor">Valor atual</Label>
        <Input
          type="number"
          min={0}
          id="valor"
          placeholder="Valor atual"
          value={valorAtual}
          onChange={(e) => setValorAtual(Number(e.target.value))}
        />
        <DialogClose asChild>
          <Button onClick={handleCreateAtivo}>Salvar</Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  )
}