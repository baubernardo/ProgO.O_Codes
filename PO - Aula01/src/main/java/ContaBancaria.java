public class ContaBancaria {
    protected double saldo;
    private String nomeCorrentista;

    public void depositar(double valor) {
        saldo = saldo + valor;
    }

    public void sacar(double valor){
        System.out.println("SACAR CONTA PADRÂO");
        if (saldo >= valor){
            saldo = saldo - valor;
        }else{
            System.out.println("Saldo insuficiente");
        }
    }

    public double retornaSaldo(){
        return saldo;
    }
}
