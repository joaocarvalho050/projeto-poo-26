class Turma {
  professor;
  nomeCurso;
  alunos;

  constructor(p, n, a) {
    this.professor = p;
    this.nomeCurso = n;
    this.alunos = a;

    if (!a) {
      this.alunos = [];
    }
  }

  getProfessor() {
    return this.professor;
  }

  getNomeCurso() {
    return this.nomeCurso;
  }

  setProfessor(p) {
    this.professor = p;
  }

  adicionarAluno(a) {
    this.alunos.push(a);
  }
}
