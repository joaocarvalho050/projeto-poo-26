class Interface {
  static #turmasAtual = [];
  static #indiceTurmaEdicao = null;
  static #indiceAlunoEdicao = null;

  constructor() {}

  // Função auxiliar para simplificar a troca de abas
  static #ativarAba(idBotao, idConteudo) {
    // Remove 'active' de todos os botões e abas
    document
      .querySelectorAll('.tab-button')
      .forEach((btn) => btn.classList.remove('active'));
    document
      .querySelectorAll('.tab-content')
      .forEach((tab) => tab.classList.remove('active'));

    // Ativa apenas a aba e botão selecionados
    document.getElementById(idBotao).classList.add('active');
    document.getElementById(idConteudo).classList.add('active');
  }

  static #cadastrarAlunoNaTurma(a, nomeCurso, turmas_) {
    for (let i = 0; i < turmas_.length; i++) {
      if (turmas_[i].getNomeCurso() === nomeCurso) {
        turmas_[i].adicionarAluno(a);
      }
    }
    return turmas_;
  }

  // Gera o HTML estilizado para um aluno
  static #exibirAlunoCard(aluno, nomeCurso, indiceTurma, indiceAluno) {
    const media = Number(aluno.media).toFixed(1);

    // Define classe CSS com base no estado do aluno
    let statusClass = 'status-reprovado';
    if (aluno.estado === 'Aprovado') statusClass = 'status-aprovado';
    else if (aluno.estado === 'Recuperação') statusClass = 'status-recuperacao';

    return `
      <li class="card-aluno">
        <div class="card-aluno-header">
          <strong>${aluno.getNome()}</strong>
          <span class="badge ${statusClass}">${aluno.estado}</span>
        </div>
        <div class="card-aluno-detalhes">
          <small>Curso: <b>${nomeCurso}</b></small>
          <div class="notas-grid">
            <span>N1: ${aluno.getNota(1)}</span>
            <span>N2: ${aluno.getNota(2)}</span>
            <span>N3: ${aluno.getNota(3)}</span>
            <span>Média: <b>${media}</b></span>
          </div>
          <button
            type="button"
            class="btn-editar-nota"
            onclick="Interface.abrirModalEdicao(${indiceTurma}, ${indiceAluno})"
          >
            Alterar Notas
          </button>
        </div>
      </li>
    `;
  }

  static salvar(turmas_) {
    const nomeInput = document.getElementById('nome');
    const n1Input = document.getElementById('n1');
    const n2Input = document.getElementById('n2');
    const n3Input = document.getElementById('n3');
    const cursoSelect = document.getElementById('meuSelect');

    const nome = nomeInput.value.trim();
    const n1Str = n1Input.value.trim();
    const n2Str = n2Input.value.trim();
    const n3Str = n3Input.value.trim();

    const n1 = Number(n1Str);
    const n2 = Number(n2Str);
    const n3 = Number(n3Str);
    const nomeCurso = cursoSelect.value;

    if (
      !nome ||
      !nomeCurso ||
      n1Str === '' ||
      n2Str === '' ||
      n3Str === '' ||
      isNaN(n1) ||
      isNaN(n2) ||
      isNaN(n3)
    ) {
      alert('Por favor, preencha todos os campos e notas corretamente!');
      return turmas_;
    }

    const a1 = new Aluno(nome, n1, n2, n3);
    a1.gerarEstado(a1.gerarMedia(n1, n2, n3));

    turmas_ = this.#cadastrarAlunoNaTurma(a1, nomeCurso, turmas_);

    alert('Aluno cadastrado com sucesso!');

    // Limpa o formulário
    nomeInput.value = '';
    n1Input.value = '';
    n2Input.value = '';
    n3Input.value = '';
    cursoSelect.value = '';

    return turmas_;
  }

  static listar(turmas) {
    this.#turmasAtual = turmas;
    this.#ativarAba('btn-listar', 'tab-listar');

    const container = document.getElementById('alunos');
    let listaHTML = '';
    let totalAlunos = 0;

    for (let i = 0; i < turmas.length; i++) {
      const turma = turmas[i];
      for (let j = 0; j < turma.alunos.length; j++) {
        listaHTML += this.#exibirAlunoCard(
          turma.alunos[j],
          turma.getNomeCurso(),
          i,
          j
        );
        totalAlunos++;
      }
    }

    if (totalAlunos === 0) {
      container.innerHTML =
        '<li class="vazio">Nenhum aluno cadastrado ainda.</li>';
    } else {
      container.innerHTML = listaHTML;
    }
  }

  // Abre o modal preenchendo as notas atuais do aluno selecionado
  static abrirModalEdicao(indiceTurma, indiceAluno) {
    const turma = this.#turmasAtual[indiceTurma];
    if (!turma) return;

    const aluno = turma.alunos[indiceAluno];
    if (!aluno) return;

    this.#indiceTurmaEdicao = indiceTurma;
    this.#indiceAlunoEdicao = indiceAluno;

    document.getElementById(
      'edit-aluno-nome'
    ).textContent = `${aluno.getNome()} — ${turma.getNomeCurso()}`;
    document.getElementById('edit-n1').value = aluno.getNota(1);
    document.getElementById('edit-n2').value = aluno.getNota(2);
    document.getElementById('edit-n3').value = aluno.getNota(3);

    document.getElementById('modal-editar-nota').classList.add('active');
  }

  // Fecha o modal sem salvar alterações
  static fecharModalEdicao() {
    this.#indiceTurmaEdicao = null;
    this.#indiceAlunoEdicao = null;
    document.getElementById('modal-editar-nota').classList.remove('active');
  }

  // Salva as novas notas no objeto Aluno, recalcula média/estado e atualiza a tela
  static salvarEdicaoNota() {
    if (this.#indiceTurmaEdicao === null || this.#indiceAlunoEdicao === null) {
      return;
    }

    const turma = this.#turmasAtual[this.#indiceTurmaEdicao];
    const aluno = turma ? turma.alunos[this.#indiceAlunoEdicao] : null;
    if (!aluno) return;

    const n1Str = document.getElementById('edit-n1').value.trim();
    const n2Str = document.getElementById('edit-n2').value.trim();
    const n3Str = document.getElementById('edit-n3').value.trim();

    const n1 = Number(n1Str);
    const n2 = Number(n2Str);
    const n3 = Number(n3Str);

    if (
      n1Str === '' ||
      n2Str === '' ||
      n3Str === '' ||
      isNaN(n1) ||
      isNaN(n2) ||
      isNaN(n3)
    ) {
      alert('Por favor, informe notas válidas!');
      return;
    }

    aluno.setNota(1, n1);
    aluno.setNota(2, n2);
    aluno.setNota(3, n3);
    aluno.gerarEstado(aluno.gerarMedia(n1, n2, n3));

    this.fecharModalEdicao();
    this.listar(this.#turmasAtual);
  }

  static cadastrar(turmas) {
    this.#ativarAba('btn-cadastrar', 'tab-cadastrar');

    const select = document.getElementById('meuSelect');
    select.innerHTML = '<option value="">Selecione uma turma...</option>';

    for (let i = 0; i < turmas.length; i++) {
      const option = document.createElement('option');
      option.value = turmas[i].getNomeCurso();
      option.textContent = turmas[i].getNomeCurso();
      select.appendChild(option);
    }
  }

  static listarTurma(turmas) {
    this.#ativarAba('btn-listar-turma', 'tab-listar-turma');

    const container = document.querySelector('#listar-turma');

    if (!turmas || turmas.length === 0) {
      container.innerHTML =
        '<li class="vazio">Nenhuma turma cadastrada ainda.</li>';
      return;
    }

    let html = `
      <table class="tabela-custom">
        <thead>
          <tr>
            <th>Curso</th>
            <th>Professor</th>
            <th style="text-align: center;">Qtd. Alunos</th>
          </tr>
        </thead>
        <tbody>
    `;

    for (let i = 0; i < turmas.length; i++) {
      html += `
        <tr>
          <td><strong>${turmas[i].getNomeCurso()}</strong></td>
          <td>${turmas[i].getProfessor()}</td>
          <td style="text-align: center;"><span class="badge badge-qtd">${
            turmas[i].alunos.length
          }</span></td>
        </tr>
      `;
    }

    html += '</tbody></table>';
    container.innerHTML = html;
  }

  static cadastrarTurma() {
    this.#ativarAba('btn-cadastrar-turma', 'tab-cadastrar-turma');
  }

  static bntSalvarTurma() {
    const cursoInput = document.getElementById('nomeCurso');
    const professorInput = document.getElementById('professor');

    const curso = cursoInput.value.trim();
    const professor = professorInput.value.trim();

    if (!curso || !professor) {
      alert('Preencha o nome do curso e o nome do professor!');
      return null;
    }

    const novaTurma = new Turma(professor, curso);
    alert('Turma salva com sucesso!');

    cursoInput.value = '';
    professorInput.value = '';

    return novaTurma;
  }
}
