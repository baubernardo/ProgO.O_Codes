public abstract class Colaborador {
    private String nome;

    protected double salario;
    private int dependentes;

    public Colaborador(String nome, int dependentes) {
        this.nome = nome;
        this.dependentes = dependentes;
    }

    private double getPrevidencia(){
        if (salario <= 1518){
            return salario * 0.075;
        } else if  (salario > 1518 && salario <= 2794){
            return (salario * 0.09) - 22;
        } else if  (salario > 2794 && salario <= 4190){
            return (salario * 0.12) - 106;
        }  else {
            return  (salario * 0.14) - 190;
        }
    }

    private double getImpostoRenda(double salarioPrev) {
        if (salarioPrev <= 2259) {
            return 0;
        } else if (salarioPrev > 2259 && salarioPrev <= 2826) {
            return (salarioPrev * 0.075) - 182;
        } else if (salarioPrev > 2826 && salarioPrev <= 3751) {
            return (salarioPrev * 0.15) - 394;
        } else if (salarioPrev > 3751 && salarioPrev <= 4664) {
            return (salarioPrev * 0.225) - 675;
        } else {
            return (salarioPrev  * 0.275) - 908;
        }
    }

    public double getSalarioLiquido(){
        double salarioAposPrevidencia = this.salario - getPrevidencia();
        double descontoIR = getImpostoRenda(salarioAposPrevidencia);

        if (descontoIR < 0) {
            descontoIR = 0;
        }

        return  salarioAposPrevidencia - descontoIR;
    }

    public String getNome() {
        return nome;
    }

    public double getSalarioBruto() {
        return salario;
    }

    public int getDependentes() {
        return dependentes;
    }

    public abstract void calcularSalarioBruto();
}