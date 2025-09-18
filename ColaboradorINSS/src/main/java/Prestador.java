public class Prestador extends Colaborador {
    private double horasTrabalhadas;
    private double valorHora;

    public Prestador(String nome, int dependentes, double horasTrabalhadas, double valorHora) {
        super(nome, dependentes);
        this.horasTrabalhadas = horasTrabalhadas;
        this.valorHora = valorHora;
    }

    @Override
    public void calcularSalarioBruto() {
        this.salario = this.horasTrabalhadas * this.valorHora;
    }
}