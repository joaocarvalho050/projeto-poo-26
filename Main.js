let turma = [];

function listarAluno() {
  Interface.listar(turma);
}

function btnSalvar() {
  turma = Interface.salvar(turma);
}

function cadastroAluno() {
  Interface.cadastrar(turma);
}

function listarTurma() {
  Interface.listarTurma(turma);
}

function cadastrarTurma() {
  Interface.cadastrarTurma();
}

function bntSalvarTurma() {
  let novaTurma = Interface.bntSalvarTurma();
  turma.push(novaTurma);
}
