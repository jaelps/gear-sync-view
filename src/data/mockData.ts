export interface Insumo {
  id: string;
  nome: string;
  codigo: string;
  categoria: string;
  unidade: string;
  qtdAtual: number;
  estoqueMinimo: number;
  fornecedor: string;
  custoUnitario: number;
  dataEntrada: string;
  dataValidade?: string;
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
  status: "Ativo" | "Manutenção" | "Inativo";
}

export const insumos: Insumo[] = [
  { id: "1", nome: "Resina Epóxi", codigo: "INS-001", categoria: "Químico", unidade: "kg", qtdAtual: 45, estoqueMinimo: 100, fornecedor: "QuímicaBR", custoUnitario: 28.5, dataEntrada: "2026-02-20", dataValidade: "2026-06-20" },
  { id: "2", nome: "Aço Inox 304", codigo: "INS-002", categoria: "Metal", unidade: "kg", qtdAtual: 320, estoqueMinimo: 200, fornecedor: "MetalSul", custoUnitario: 15.0, dataEntrada: "2026-02-15" },
  { id: "3", nome: "Parafuso M8", codigo: "INS-003", categoria: "Fixação", unidade: "un", qtdAtual: 1200, estoqueMinimo: 500, fornecedor: "FixaTudo", custoUnitario: 0.35, dataEntrada: "2026-02-18" },
  { id: "4", nome: "Óleo Lubrificante", codigo: "INS-004", categoria: "Químico", unidade: "L", qtdAtual: 12, estoqueMinimo: 30, fornecedor: "LubriMax", custoUnitario: 42.0, dataEntrada: "2026-02-10", dataValidade: "2026-03-10" },
  { id: "5", nome: "Chapa Alumínio 2mm", codigo: "INS-005", categoria: "Metal", unidade: "m²", qtdAtual: 85, estoqueMinimo: 50, fornecedor: "AlumiPro", custoUnitario: 62.0, dataEntrada: "2026-02-22" },
  { id: "6", nome: "Tinta Industrial", codigo: "INS-006", categoria: "Químico", unidade: "L", qtdAtual: 8, estoqueMinimo: 25, fornecedor: "PintaCor", custoUnitario: 55.0, dataEntrada: "2026-02-12", dataValidade: "2026-04-12" },
  { id: "7", nome: "Borracha Vedação", codigo: "INS-007", categoria: "Vedação", unidade: "m", qtdAtual: 150, estoqueMinimo: 80, fornecedor: "VedaBem", custoUnitario: 8.9, dataEntrada: "2026-02-25" },
  { id: "8", nome: "Solda MIG", codigo: "INS-008", categoria: "Consumível", unidade: "kg", qtdAtual: 18, estoqueMinimo: 40, fornecedor: "SoldaTec", custoUnitario: 35.0, dataEntrada: "2026-02-14" },
];

export const funcionarios: Funcionario[] = [
  { id: "1", nome: "Carlos Silva", producaoHoje: 142, metaDiaria: 150, eficiencia: 94.7, tempoMedio: 4.2 },
  { id: "2", nome: "Ana Souza", producaoHoje: 168, metaDiaria: 150, eficiencia: 112.0, tempoMedio: 3.6 },
  { id: "3", nome: "Pedro Lima", producaoHoje: 130, metaDiaria: 150, eficiencia: 86.7, tempoMedio: 4.8 },
  { id: "4", nome: "Maria Oliveira", producaoHoje: 155, metaDiaria: 150, eficiencia: 103.3, tempoMedio: 3.9 },
  { id: "5", nome: "João Santos", producaoHoje: 118, metaDiaria: 150, eficiencia: 78.7, tempoMedio: 5.1 },
];

export const producaoDiaria = [
  { dia: "Seg", producao: 680, meta: 750 },
  { dia: "Ter", producao: 720, meta: 750 },
  { dia: "Qua", producao: 695, meta: 750 },
  { dia: "Qui", producao: 780, meta: 750 },
  { dia: "Sex", producao: 713, meta: 750 },
  { dia: "Sáb", producao: 450, meta: 500 },
  { dia: "Hoje", producao: 613, meta: 750 },
];

export const consumoInsumos = [
  { nome: "Resina Epóxi", valor: 320 },
  { nome: "Aço Inox", valor: 280 },
  { nome: "Parafusos", valor: 450 },
  { nome: "Óleo Lub.", valor: 120 },
  { nome: "Tinta Ind.", valor: 180 },
];

export const equipamentos: Equipamento[] = [
  { id: "1", nome: "Torno CNC A1", codigo: "EQ-001", tipo: "Usinagem", capacidade: 200, status: "Ativo" },
  { id: "2", nome: "Prensa Hidráulica", codigo: "EQ-002", tipo: "Conformação", capacidade: 150, status: "Ativo" },
  { id: "3", nome: "Fresadora B2", codigo: "EQ-003", tipo: "Usinagem", capacidade: 180, status: "Manutenção" },
  { id: "4", nome: "Soldadora MIG", codigo: "EQ-004", tipo: "Soldagem", capacidade: 120, status: "Ativo" },
  { id: "5", nome: "Injetora Plástico", codigo: "EQ-005", tipo: "Injeção", capacidade: 300, status: "Inativo" },
];
