function escoreCategoria(media) {
  if (media < 3) return { rotulo: 'Baixo', cor: 'green' };
  if (media < 7) return { rotulo: 'Moderado', cor: 'orange' };
  return { rotulo: 'Alto', cor: 'red' };
}

function coletarDoFormulario() {
  const v = id => Number(document.getElementById(id).value) || 0;

  const paciente = document.getElementById('paciente').value.trim();
  const dataAvaliacao = document.getElementById('dataAvaliacao').value;

  const dados = {
    paciente,
    dataAvaliacao,
    dor: v('dor'),
    cansaco: v('cansaco'),
    nausea: v('nausea'),
    depressao: v('depressao'),
    ansiedade: v('ansiedade'),
    sonolencia: v('sonolencia'),
    apetite: v('apetite'),
    bemestar: v('bemestar'),
    faltaAr: v('faltaAr'),
    observacoes: document.getElementById('observacoes').value.trim(),
    criadoEm: new Date().toISOString()
  };

  const soma = dados.dor + dados.cansaco + dados.nausea + dados.depressao +
               dados.ansiedade + dados.sonolencia + dados.apetite +
               dados.bemestar + dados.faltaAr;
  const media = Number((soma / 9).toFixed(2));
  const cat = escoreCategoria(media);

  return { dados, soma, media, cat };
}

function carregarAvaliacoes() {
  const json = localStorage.getItem('esas_avaliacoes');
  return json ? JSON.parse(json) : [];
}

function salvarAvaliacoes(lista) {
  localStorage.setItem('esas_avaliacoes', JSON.stringify(lista));
}

function atualizarTabela() {
  const tbody = document.querySelector('#tabelaHistorico tbody');
  tbody.innerHTML = '';

  const lista = carregarAvaliacoes();
  lista.forEach(item => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${item.paciente}</td>
      <td>${item.dataAvaliacao}</td>
      <td>${item.media}</td>
      <td style="color:${item.corCategoria}; font-weight:600;">${item.categoria}</td>
    `;
    tbody.appendChild(tr);
  });
}

document.getElementById('formEsas').addEventListener('submit', (e) => {
  e.preventDefault();
  const { dados, soma, media, cat } = coletarDoFormulario();

  if (!dados.paciente || !dados.dataAvaliacao) {
    alert('Preencha paciente e data.');
    return;
  }

  const lista = carregarAvaliacoes();
  lista.push({
    ...dados,
    soma,
    media,
    categoria: cat.rotulo,
    corCategoria: cat.cor
  });
  salvarAvaliacoes(lista);
  atualizarTabela();
  e.target.reset();
  alert('Avaliação salva (no navegador) para testes.');
});

document.getElementById('btnLimpar').addEventListener('click', () => {
  if (confirm('Tem certeza que deseja limpar todas as avaliações de teste?')) {
    localStorage.removeItem('esas_avaliacoes');
    atualizarTabela();
  }
});

// inicializa tabela
atualizarTabela();
