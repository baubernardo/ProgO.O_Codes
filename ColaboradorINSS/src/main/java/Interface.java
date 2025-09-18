import java.util.Scanner;
import java.util.Locale;

public class Interface {
    public static void main(String[] args) {
        Scanner input = new Scanner(System.in).useLocale(Locale.US);

        System.out.print("Nome do Colaborador: ");
        String nome = input.nextLine();

        System.out.print("Dependentes do Colaborador: ");
        int dependentes = input.nextInt();

        Colaborador colaborador = null;

        System.out.print("Para Efetivo selecione 1, para Prestador (Terceiro) selecione 2: ");
        int tipoContrato = input.nextInt();

        if (tipoContrato == 1) {
            System.out.print("Digite o nível do cargo (JR, PL, ou SR): ");
            String nivel = input.next();

            colaborador = new Efetivo(nome, dependentes, nivel);

        } else if (tipoContrato == 2) {
            System.out.print("Horas trabalhadas no mês: ");
            double horas = input.nextDouble();

            System.out.print("Valor por hora: R$");
            double valorHora = input.nextDouble();

            colaborador = new Prestador(nome, dependentes, horas, valorHora);

        } else {
            System.out.println("Opção inválida!");
            input.close();
            return;
        }

        colaborador.calcularSalarioBruto();

        System.out.println("\n--- Folha de Pagamento ---");
        System.out.println("Nome: " + colaborador.getNome());
        System.out.printf("Salário Bruto: R$ %.2f\n", colaborador.getSalarioBruto());
        System.out.printf("Salário Líquido: R$ %.2f\n", colaborador.getSalarioLiquido());

        input.close();
    }
}