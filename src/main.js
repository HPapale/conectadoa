import "./style.css";

const app = document.querySelector("#app");

app.innerHTML = `
  <h1>ConectaDoa</h1>
  <p>Status da API: <strong id="status">verificando...</strong></p>
  <h2>Doadores</h2>
  <form id="form-doador">
    <input name="nome" placeholder="Nome" required />
    <input name="email" type="email" placeholder="E-mail" required />
    <input name="telefone" placeholder="Telefone" />
    <button type="submit">Cadastrar</button>
  </form>
  <p id="mensagem" role="status"></p>
  <table>
    <thead>
      <tr><th>Nome</th><th>E-mail</th><th>Telefone</th><th></th></tr>
    </thead>
    <tbody id="lista"></tbody>
  </table>
`;

const mensagem = document.querySelector("#mensagem");

async function verificarApi() {
  const status = document.querySelector("#status");
  try {
    const resposta = await fetch("/api/health");
    const dados = await resposta.json();
    status.textContent = `${dados.status} (${dados.hora})`;
  } catch {
    status.textContent = "API fora do ar";
  }
}

async function carregarDoadores() {
  const lista = document.querySelector("#lista");
  lista.replaceChildren();
  try {
    const resposta = await fetch("/api/doadores");
    const doadores = await resposta.json();
    for (const d of doadores) {
      const linha = document.createElement("tr");
      for (const valor of [d.nome, d.email, d.telefone ?? ""]) {
        const celula = document.createElement("td");
        celula.textContent = valor;
        linha.append(celula);
      }
      const acoes = document.createElement("td");
      const botao = document.createElement("button");
      botao.type = "button";
      botao.textContent = "Remover";
      botao.addEventListener("click", () => removerDoador(d.id_doador));
      acoes.append(botao);
      linha.append(acoes);
      lista.append(linha);
    }
  } catch {
    mensagem.textContent = "Não foi possível carregar os doadores";
  }
}

async function removerDoador(id) {
  const resposta = await fetch(`/api/doadores/${id}`, { method: "DELETE" });
  if (resposta.ok) {
    mensagem.textContent = "Doador removido";
    await carregarDoadores();
  } else {
    const dados = await resposta.json();
    mensagem.textContent = dados.erro;
  }
}

document.querySelector("#form-doador").addEventListener("submit", async (evento) => {
  evento.preventDefault();
  const formulario = evento.target;
  const corpo = Object.fromEntries(new FormData(formulario));
  const resposta = await fetch("/api/doadores", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(corpo),
  });
  if (resposta.ok) {
    formulario.reset();
    mensagem.textContent = "Doador cadastrado";
    await carregarDoadores();
  } else {
    const dados = await resposta.json();
    mensagem.textContent = dados.erro;
  }
});

void verificarApi();
void carregarDoadores();
