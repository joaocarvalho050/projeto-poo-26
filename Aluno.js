class Aluno {
  #nota1;
  #nota2;
  #nota3;

  constructor(nome, nota1, nota2, nota3) {
    this.nome = nome;
    this.atualizarNotas(nota1, nota2, nota3);
  }

  get nota1() {
    return this.#nota1;
  }

  set nota1(valor) {
    this.#nota1 = Aluno.#validarNota(valor);
  }

  get nota2() {
    return this.#nota2;
  }

  set nota2(valor) {
    this.#nota2 = Aluno.#validarNota(valor);
  }

  get nota3() {
    return this.#nota3;
  }

  set nota3(valor) {
    this.#nota3 = Aluno.#validarNota(valor);
  }

  static #validarNota(valor) {
    if (!Number.isFinite(valor) || valor < 0 || valor > 10) {
      throw new RangeError('Informe três notas de 0 a 10.');
    }
    return valor;
  }

  atualizarNotas(nota1, nota2, nota3) {
    const notas = [nota1, nota2, nota3].map(Aluno.#validarNota);
    [this.#nota1, this.#nota2, this.#nota3] = notas;
  }

  get media() {
    return this.gerarMedia();
  }

  get estado() {
    return this.gerarEstado();
  }

  gerarMedia(nota1 = this.nota1, nota2 = this.nota2, nota3 = this.nota3) {
    return (nota1 + nota2 + nota3) / 3;
  }

  gerarEstado(media = this.media) {
    if (media >= 6) {
      return 'Aprovado';
    }
    if (media >= 3) {
      return 'Recuperação';
    }
    return 'Reprovado';
  }
}
