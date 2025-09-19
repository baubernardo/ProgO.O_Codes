public class ContaCorrente extends ContaBancaria{
    private double limiteCredito;

    public void definirlimiteCredito(double valor){
        this.limiteCredito = valor;
    }

    @Override
    public void sacar(double valor){
        System.out.println("SACAR CONTA CORRENTE");
        if ((saldo +limiteCredito) >= valor){
            saldo = saldo - valor;
        }else{
            System.out.println("Saldo insuficiente");
        }

    }
}
