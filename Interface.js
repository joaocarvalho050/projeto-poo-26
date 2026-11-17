class Interface {
  constructor() {
    this.turmas = [];
    this.btnCadastrar = document.getElementById('btn-cadastrar');
    this.btnListar = document.getElementById('btn-listar');
    this.tabCadastrar = document.getElementById('tab-cadastrar');
    this.tabListar = document.getElementById('tab-listar');
    this.formTurma = document.getElementById('form-turma');
    this.formAluno = document.getElementById('form-aluno');
    this.camposAluno = document.getElementById('campos-aluno');
    this.selecaoTurma = document.getElementById('turma-aluno');
    this.avisoTurma = document.getElementById('aviso-turma');
    this.lista = document.getElementById('turmas-cadastradas');
    this.dialogo = document.getElementById('editar-notas');
    this.formEdicao = document.getElementById('form-edicao');
    this.nomeEdicao = document.getElementById('nome-edicao');
    this.mensagem = document.getElementById('mensagem');
    this.alunoEmEdicao = null;
    this.formatoNota = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 20 });
    this.formatoMedia = new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    this.btnCadastrar.addEventListener('click', () => this.abrirAba(false));
    this.btnListar.addEventListener('click', () => this.abrirAba(true));
    this.formTurma.addEventListener('submit', (evento) => this.salvarTurma(evento));
    this.formAluno.addEventListener('submit', (evento) => this.salvarAluno(evento));
    this.formEdicao.addEventListener('submit', (evento) => this.salvarEdicao(evento));
    document.getElementById('cancelar-edicao').addEventListener('click', () => {
      this.dialogo.close();
    });
    this.dialogo.addEventListener('close', () => {
      if (!this.dialogo.open) {
        this.alunoEmEdicao = null;
      }
    });
  }

  abrirAba(listar) {
    this.btnCadastrar.classList.toggle('active', !listar);
    this.btnListar.classList.toggle('active', listar);
    this.btnCadastrar.setAttribute('aria-pressed', String(!listar));
    this.btnListar.setAttribute('aria-pressed', String(listar));
    this.tabCadastrar.classList.toggle('active', !listar);
    this.tabListar.classList.toggle('active', listar);
    this.mensagem.textContent = '';

    if (listar) {
      this.listar();
    }
  }

  salvarTurma(evento) {
    evento.preventDefault();
    const campos = this.formTurma.elements;
    const nome = campos.nome.value.trim();
    const professor = campos.professor.value.trim();
    const curso = campos.curso.value.trim();

    if (!nome || !professor || !curso) {
      this.mensagem.textContent = 'Preencha o nome da turma, o professor e o curso.';
      return;
    }

    const turma = new Turma(nome, professor, curso);
    const indice = this.turmas.push(turma) - 1;
    const opcao = new Option(`${nome} · ${curso} · ${professor}`, String(indice));
    this.selecaoTurma.add(opcao);
    this.selecaoTurma.value = opcao.value;
    this.camposAluno.disabled = false;
    this.avisoTurma.hidden = true;
    this.formTurma.reset();
    this.mensagem.textContent = 'Turma cadastrada.';
  }

  lerNotas(formulario) {
    const campos = formulario.elements;
    return [campos.nota1.valueAsNumber, campos.nota2.valueAsNumber, campos.nota3.valueAsNumber];
  }

  salvarAluno(evento) {
    evento.preventDefault();
    const turmaSelecionada = this.selecaoTurma.value;
    const turma = this.turmas[turmaSelecionada];
    const nome = this.formAluno.elements.nome.value.trim();

    if (!turma || !nome) {
      this.mensagem.textContent = 'Selecione uma turma e informe o nome do aluno.';
      return;
    }

    turma.adicionarAluno(new Aluno(nome, ...this.lerNotas(this.formAluno)));
    this.formAluno.reset();
    this.selecaoTurma.value = turmaSelecionada;
    this.mensagem.textContent = 'Aluno cadastrado.';
  }

  criarTexto(tag, texto) {
    const elemento = document.createElement(tag);
    elemento.textContent = texto;
    return elemento;
  }

  listar(alunoAtualizado) {
    this.lista.replaceChildren();
    if (this.turmas.length === 0) {
      this.lista.append(this.criarTexto('p', 'Nenhuma turma cadastrada.'));
      return;
    }

    let botaoAlunoAtualizado;
    for (const turma of this.turmas) {
      const secao = document.createElement('section');
      secao.className = 'turma-listada';
      secao.append(
        this.criarTexto('h3', turma.nome),
        this.criarTexto('p', `Professor: ${turma.professor} · Curso: ${turma.curso}`),
      );

      if (turma.alunos.length === 0) {
        secao.append(this.criarTexto('p', 'Nenhum aluno nesta turma.'));
      } else {
        const alunos = document.createElement('ul');
        alunos.className = 'lista-alunos';
        for (const aluno of turma.alunos) {
          const item = document.createElement('li');
          const notas = [aluno.nota1, aluno.nota2, aluno.nota3]
            .map((nota, indice) => `Nota ${indice + 1}: ${this.formatoNota.format(nota)}`)
            .join(' · ');
          const editar = this.criarTexto('button', 'Editar notas');
          editar.type = 'button';
          editar.setAttribute('aria-label', `Editar notas de ${aluno.nome}`);
          editar.addEventListener('click', () => this.editar(aluno));
          item.append(
            this.criarTexto('strong', aluno.nome),
            this.criarTexto('p', notas),
            this.criarTexto('p', `Média: ${this.formatoMedia.format(aluno.media)} · Situação: ${aluno.estado}`),
            editar,
          );
          alunos.append(item);
          if (aluno === alunoAtualizado) {
            botaoAlunoAtualizado = editar;
          }
        }
        secao.append(alunos);
      }
      this.lista.append(secao);
    }
    return botaoAlunoAtualizado;
  }

  editar(aluno) {
    this.alunoEmEdicao = aluno;
    this.nomeEdicao.textContent = aluno.nome;
    const campos = this.formEdicao.elements;
    campos.nota1.value = aluno.nota1;
    campos.nota2.value = aluno.nota2;
    campos.nota3.value = aluno.nota3;
    this.dialogo.showModal();
  }

  salvarEdicao(evento) {
    evento.preventDefault();
    const aluno = this.alunoEmEdicao;
    aluno.atualizarNotas(...this.lerNotas(this.formEdicao));
    this.dialogo.close();
    this.listar(aluno).focus();
    this.mensagem.textContent = 'Notas atualizadas.';
  }
}
