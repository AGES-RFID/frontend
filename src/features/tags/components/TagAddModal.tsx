import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { toast } from "@/components/ui/toast";
import { useBulkCreateTags, useCreateTag } from "../hooks";

interface CsvPreviewTag {
  line: number;
  tid: string;
  epc: string;
}

interface TagAddModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function parseCsvLine(line: string) {
  const values: string[] = [];
  let current = "";
  let insideQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const nextChar = line[index + 1];

    if (char === '"' && insideQuotes && nextChar === '"') {
      current += '"';
      index += 1;
      continue;
    }

    if (char === '"') {
      insideQuotes = !insideQuotes;
      continue;
    }

    if (char === "," && !insideQuotes) {
      values.push(current.trim());
      current = "";
      continue;
    }

    current += char;
  }

  values.push(current.trim());
  return values;
}

function parseCsvPreview(content: string) {
  const lines = content.split(/\r?\n/);
  const firstFilledLineIndex = lines.findIndex((line) => line.trim() !== "");

  if (firstFilledLineIndex === -1) return [];

  const firstLine = lines[firstFilledLineIndex] ?? "";
  const firstValues = parseCsvLine(firstLine).map((value) =>
    value.toLowerCase(),
  );
  const hasHeader =
    firstValues.length >= 2 &&
    firstValues[0] === "tid" &&
    firstValues[1] === "epc";

  return lines
    .map((line, index) => ({ line, lineNumber: index + 1 }))
    .filter(({ line, lineNumber }) => {
      if (line.trim() === "") return false;
      return !(hasHeader && lineNumber === firstFilledLineIndex + 1);
    })
    .map(({ line, lineNumber }) => {
      const [tid = "", epc = ""] = parseCsvLine(line);

      return {
        line: lineNumber,
        tid,
        epc,
      };
    })
    .filter((tag) => tag.tid !== "" && tag.epc !== "");
}

export function TagAddModal({ isOpen, onClose }: TagAddModalProps) {
  const [mode, setMode] = useState<"manual" | "csv">("manual");
  const [tid, setTid] = useState("");
  const [epc, setEpc] = useState("");
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvPreview, setCsvPreview] = useState<CsvPreviewTag[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const createTagMutation = useCreateTag();
  const bulkCreateTagsMutation = useBulkCreateTags();
  const isSubmitting =
    createTagMutation.isPending || bulkCreateTagsMutation.isPending;

  const handleCancel = () => {
    setTid("");
    setEpc("");
    setCsvFile(null);
    setCsvPreview([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
    onClose();
  };

  const handleCsvFile = async (file?: File) => {
    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".csv") && file.type !== "text/csv") {
      toast.error("Selecione um arquivo CSV válido.");
      return;
    }

    setCsvFile(file);

    try {
      setCsvPreview(parseCsvPreview(await file.text()));
    } catch {
      setCsvPreview([]);
      toast.error("NÃ£o foi possÃ­vel ler o preview do CSV.");
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    void handleCsvFile(event.dataTransfer.files?.[0]);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const cleanTid = tid.trim();
    const cleanEpc = epc.trim();

    if (mode === "csv") {
      if (!csvFile) {
        toast.error("Selecione um arquivo CSV para importar.");
        return;
      }

      try {
        const result = await bulkCreateTagsMutation.mutateAsync(csvFile);
        toast.success(
          `${result.createdCount} etiqueta(s) importada(s) com sucesso.`,
        );

        if (result.errorCount > 0) {
          toast.warning(
            `${result.errorCount} linha(s) do CSV não foram importadas.`,
          );
        }

        setCsvFile(null);
        setCsvPreview([]);
        if (fileInputRef.current) fileInputRef.current.value = "";
        onClose();
      } catch {
        toast.error(
          "Erro ao importar CSV. Verifique o arquivo e tente novamente.",
        );
      }
      return;
    }

    if (!cleanTid || !cleanEpc) {
      toast.error("Preencha o TID e o EPC da etiqueta.");
      return;
    }

    try {
      await createTagMutation.mutateAsync({ tid: cleanTid, epc: cleanEpc });
      toast.success("Etiqueta adicionada com sucesso.");
      setTid("");
      setEpc("");
      onClose();
    } catch {
      toast.error(
        "Erro ao adicionar etiqueta. Verifique os campos e tente novamente.",
      );
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCancel}
      title="Adicionar etiqueta RFID"
    >
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-2">
          <Button
            type="button"
            variant={mode === "manual" ? "primary" : "secondary"}
            onClick={() => setMode("manual")}
            disabled={isSubmitting}
          >
            Manual
          </Button>
          <Button
            type="button"
            variant={mode === "csv" ? "primary" : "secondary"}
            onClick={() => setMode("csv")}
            disabled={isSubmitting}
          >
            CSV
          </Button>
        </div>

        <div className="mx-auto flex w-full max-w-xs flex-col gap-4">
          {mode === "manual" ? (
            <>
              <Input
                label="TID"
                placeholder="Ex: E200341201300000..."
                value={tid}
                width="100%"
                onChange={(e) => setTid(e.target.value)}
              />
              <Input
                label="EPC"
                placeholder="Ex: 300833B2DDD90140..."
                value={epc}
                width="100%"
                onChange={(e) => setEpc(e.target.value)}
              />
            </>
          ) : (
            <label
              className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-md border-2 border-light-gray border-dashed p-6 text-center transition-colors hover:border-dark-blue hover:bg-blue/10"
              onDragOver={(event) => event.preventDefault()}
              onDrop={handleDrop}
            >
              <span className="font-medium text-dark-gray text-sm">
                Arquivo CSV
              </span>
              <span className="text-gray text-xs">
                {csvFile
                  ? csvFile.name
                  : "Arraste o arquivo aqui ou clique para selecionar"}
              </span>
              <input
                ref={fileInputRef}
                type="file"
                aria-label="Arquivo CSV"
                accept=".csv,text/csv"
                className="sr-only"
                onChange={(e) => void handleCsvFile(e.target.files?.[0])}
              />
            </label>
          )}
        </div>

        {mode === "csv" && csvFile && (
          <div className="rounded-md border border-light-gray">
            <div className="flex items-center justify-between border-light-gray border-b px-3 py-2">
              <span className="font-medium text-dark-gray text-sm">
                Preview das tags
              </span>
              <span className="text-gray text-xs">
                {csvPreview.length} linha(s) vÃ¡lida(s)
              </span>
            </div>

            {csvPreview.length > 0 ? (
              <div className="max-h-44 overflow-auto">
                <table className="w-full table-fixed text-left text-xs">
                  <thead className="sticky top-0 bg-white text-gray">
                    <tr>
                      <th className="w-14 px-3 py-2 font-medium">Linha</th>
                      <th className="px-3 py-2 font-medium">TID</th>
                      <th className="px-3 py-2 font-medium">EPC</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-light-gray">
                    {csvPreview.slice(0, 5).map((tag) => (
                      <tr key={`${tag.line}-${tag.tid}-${tag.epc}`}>
                        <td className="px-3 py-2 text-gray">{tag.line}</td>
                        <td className="truncate px-3 py-2 text-dark-gray">
                          {tag.tid}
                        </td>
                        <td className="truncate px-3 py-2 text-dark-gray">
                          {tag.epc}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {csvPreview.length > 5 && (
                  <p className="border-light-gray border-t px-3 py-2 text-gray text-xs">
                    Mostrando 5 de {csvPreview.length} tags.
                  </p>
                )}
              </div>
            ) : (
              <p className="px-3 py-4 text-gray text-sm">
                Nenhuma tag vÃ¡lida encontrada no arquivo.
              </p>
            )}
          </div>
        )}

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="borderless" onClick={handleCancel}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Confirmando..." : "Confirmar"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
