import * as XLSX from "xlsx";
import { toast } from "sonner";

export function exportToExcel(data: Record<string, unknown>[], fileName: string, sheetName = "Dados") {
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  XLSX.writeFile(wb, `${fileName}.xlsx`);
}

export function importFromExcel<T>(
  file: File,
  mapRow: (row: Record<string, unknown>, index: number) => T | null,
): Promise<T[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const wb = XLSX.read(data, { type: "array" });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const jsonRows = XLSX.utils.sheet_to_json<Record<string, unknown>>(ws);

        if (jsonRows.length === 0) {
          toast.error("Planilha vazia ou formato inválido.");
          resolve([]);
          return;
        }

        const mapped = jsonRows
          .map((row, i) => {
            try {
              return mapRow(row, i);
            } catch {
              return null;
            }
          })
          .filter((item): item is T => item !== null);

        if (mapped.length === 0) {
          toast.error("Nenhum registro válido encontrado. Verifique as colunas da planilha.");
        } else {
          toast.success(`${mapped.length} registro(s) importado(s) com sucesso!`);
        }
        resolve(mapped);
      } catch {
        toast.error("Erro ao ler o arquivo Excel.");
        reject(new Error("Failed to parse Excel"));
      }
    };
    reader.onerror = () => {
      toast.error("Erro ao ler o arquivo.");
      reject(new Error("FileReader error"));
    };
    reader.readAsArrayBuffer(file);
  });
}
