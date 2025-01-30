import { Button } from "@/components/ui/button";

type SelectedOptionProps = {
  selectedOption: 'clientes' | 'ativos';
  onOptionChange: (option: 'clientes' | 'ativos') => void;
};

export default function SelectedOption({ selectedOption, onOptionChange }: SelectedOptionProps) {
  return (
    <>
      <Button
        variant={selectedOption === 'clientes' ? 'default' : 'outline'}
        onClick={() => onOptionChange('clientes')}
      >
        Clientes
      </Button>
      <Button
        variant={selectedOption === 'ativos' ? 'default' : 'outline'}
        onClick={() => onOptionChange('ativos')}
      >
        Ativos
      </Button>
    </>
  );
}
