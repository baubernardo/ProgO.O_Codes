package br.edu.setrem.meuapp.aula;

import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class ContaCorrente extends ContaBancaria {
    private double limiteCredito;

    public void definirLimiteCredito(double valor) {
        this.limiteCredito = valor;
    }

    @Override
    public void sacar(double valor) throws Exception {
        System.out.println("Sacar da conta corrente");
        if ((saldo + limiteCredito) >= valor ) {
            saldo = saldo - valor;
        } else {
            throw new Exception("Saldo indisponivel");
        }
    }
}
