const FORMATO_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const FORMATO_DATA = /^\d{4}-\d{2}-\d{2}$/;

export function validarDoador(dados = {}) {
  if (typeof dados.nome !== "string" || !dados.nome.trim()) return "Nome é obrigatório";
  if (dados.nome.length > 150) return "Nome pode ter no máximo 150 caracteres";
  if (typeof dados.email !== "string" || !dados.email.trim()) return "E-mail é obrigatório";
  if (dados.email.length > 100) return "E-mail pode ter no máximo 100 caracteres";
  if (!FORMATO_EMAIL.test(dados.email)) return "E-mail inválido";
  if (dados.telefone && String(dados.telefone).length > 20) {
    return "Telefone pode ter no máximo 20 caracteres";
  }
  return null;
}

export function validarDoacao(dados = {}) {
  if (!Number.isInteger(dados.id_doador)) return "Doador é obrigatório";
  if (!FORMATO_DATA.test(dados.data_doacao || "")) return "Data inválida (use AAAA-MM-DD)";
  if (dados.descricao && String(dados.descricao).length > 255) {
    return "Descrição pode ter no máximo 255 caracteres";
  }
  if (!Array.isArray(dados.itens) || dados.itens.length === 0) {
    return "Informe pelo menos um item";
  }
  for (const item of dados.itens) {
    if (!Number.isInteger(item.id_item)) return "Item inválido";
    if (!Number.isInteger(item.quantidade) || item.quantidade <= 0) {
      return "Quantidade deve ser um número inteiro maior que zero";
    }
  }
  return null;
}

export function validarLogin(dados = {}) {
  if (!dados.email || !dados.senha) return "Informe e-mail e senha";
  return null;
}
