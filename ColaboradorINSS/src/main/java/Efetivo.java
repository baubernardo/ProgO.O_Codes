public class Efetivo extends Colaborador {
    private String nivelCargo;
    private static final double SALARIO_MINIMO = 1550.00;

    public Efetivo(String nome, int dependentes, String nivelCargo) {

        super(nome, dependentes);
        this.nivelCargo = nivelCargo.toUpperCase();
    }

    @Override
    public void calcularSalarioBruto() {
        switch (this.nivelCargo) {
            case "JR":
                this.salario = SALARIO_MINIMO;
                break;
            case "PL":
                this.salario = SALARIO_MINIMO * 2;
                break;
            case "SR":
                this.salario = SALARIO_MINIMO * 5;
                break;
            default:
                this.salario = 0;
                break;
        }
    }
}