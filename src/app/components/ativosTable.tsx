import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogClose, DialogDescription } from '@radix-ui/react-dialog';
import { Trash2 } from 'lucide-react';

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
  }, []);

  return (
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
            <TableCell className="w-[25%]">{item.nome}</TableCell>
            <TableCell className="w-[25%]">{item.valorAtual}</TableCell>
            <TableCell>
            </TableCell>
            <TableCell>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="icon" onClick={() => setClienteId(item.id)}>
                    <Trash2 />
                  </Button>
                </DialogTrigger>
                <DialogContent className="p-8">
                  <DialogTitle>Excluir ativo</DialogTitle>
                  <DialogDescription className="text-md">
                    Você quer excluir este ativo?
                  </DialogDescription>
                  <DialogClose asChild>
                    <Button onClick={handleDeleteCliente}>Excluir ativo</Button>
                  </DialogClose>
                </DialogContent>
              </Dialog>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}