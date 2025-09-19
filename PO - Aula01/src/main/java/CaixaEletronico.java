import javax.swing.*;

public class CaixaEletronico {
    public static void main(String[] args) {

        System.out.println("Caixa Eletronico");
        var itau = new ContaBancaria();
        itau.depositar(100);
        itau.depositar(100);
        System.out.println("Saldo = R$" + itau.retornaSaldo());

        var sicredi = new ContaCorrente();
        sicredi.depositar(1000);
        sicredi.definirlimiteCredito(100);
        sicredi.sacar(1100);
        System.out.println("Saldo = R$" + sicredi.retornaSaldo());
//        JOptionPane.showMessageDialog(null, "Saldo = R$" + sicredi.retornaSaldo());
    }
}
