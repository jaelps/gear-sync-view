export interface Insumo {
  id: string;
  nome: string;
  codigo: string;
  categoria: string;
  unidade: string;
  qtdAtual: number;
  estoqueMinimo: number;
  fornecedor: string;
  dataEntrada: string;
}

export interface ProducaoRegistro {
  id: string;
  data: string;
  funcionario: string;
  equipamento: string;
  qtdProduzida: number;
  tempoProducao: number;
  perdas: number;
}

export interface Funcionario {
  id: string;
  nome: string;
  producaoHoje: number;
  metaDiaria: number;
  eficiencia: number;
  tempoMedio: number;
}

export interface Equipamento {
  id: string;
  nome: string;
  codigo: string;
  tipo: string;
  capacidade: number;
  status: "Em Produção" | "Finalizado";
}

export const insumos: Insumo[] = [];

export const funcionarios: Funcionario[] = [];

export const producaoDiaria: { dia: string; producao: number; meta: number }[] = [];

export const consumoInsumos: { nome: string; valor: number }[] = [];

export const equipamentos: Equipamento[] = [];
