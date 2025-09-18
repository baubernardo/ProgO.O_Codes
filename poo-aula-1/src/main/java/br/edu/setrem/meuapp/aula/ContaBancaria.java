package br.edu.setrem.meuapp.aula;

public class ContaBancaria {
    protected double saldo;
    private String nomeCorrentista;

    public void depositar(double valor) {
        saldo = saldo + valor;
    }

    public void sacar(double valor) throws Exception{
        System.out.println("Sacar da conta");
        if (saldo >= valor ) {
            saldo = saldo - valor;
        } else {
            throw new Exception("Saldo indisponivel");
        }
    }

    public double retornaSaldo() {
        return saldo;
    }
}
