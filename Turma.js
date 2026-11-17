class Turma {
  constructor(nome, professor, curso) {
    this.nome = nome;
    this.professor = professor;
    this.curso = curso;
    this.alunos = [];
  }

  adicionarAluno(aluno) {
    this.alunos.push(aluno);
  }
}
