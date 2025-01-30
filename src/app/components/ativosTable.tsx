import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import AddAtivo from '@/app/components/addAtivo';

interface Ativos {
  id: number;
  nome: string;
  valorAtual: number;
}

export default function AtivosTable() {
  const [data, setData] = useState<Ativos[]>([]);
  const [ativoId, setAtivoId] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/ativos`);
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
  }, [data]);

  const handleDeleteAtivo = async () => {
    if (ativoId === null) {
      toast.error("Nenhum cliente selecionado para exclusão.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/ativos/${ativoId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        toast.error("Erro ao excluir o ativo.");
        return;
      }

      // Remover o cliente excluído da lista
      setData((prevData) =>
        prevData.filter((ativo) => ativo.id !== ativoId)
      );

      toast.success("Ativo excluído com sucesso!");
      setAtivoId(null); // Resetar o ID após a exclusão
    } catch (error) {
      console.error('Erro ao deletar o ativo:', error);
      toast.error("Erro ao excluir o ativo.");
    }
  };

  return (
    <div className='flex flex-col w-full gap-6'>
      <div className='flex justify-end'>
        <AddAtivo />
      </div>

      <Table>
        <TableHeader>
          <TableRow className="font-bold">
            <TableHead>Nome</TableHead>
            <TableHead>Valor atual</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="w-[46%]">{item.nome}</TableCell>
              <TableCell className="w-[46%]">R${item.valorAtual}</TableCell>
              <TableCell>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="icon" onClick={() => setAtivoId(item.id)}>
                      <Trash2 />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="p-8">
                    <DialogTitle>Excluir ativo</DialogTitle>
                    <DialogDescription >
                      Você quer excluir este ativo?
                    </DialogDescription>
                    <DialogClose asChild>
                      <Button onClick={handleDeleteAtivo}>Excluir</Button>
                    </DialogClose>
                  </DialogContent>
                </Dialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}