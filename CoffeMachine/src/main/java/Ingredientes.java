public class Ingredientes {

    //Definindo Variaveis
    private int codigo;
    private String nome;
    private int quantidade;
    private int quantidadeMaxima;

    public Ingredientes(int codigo, String nome, int quantidade, int quantidadeMaxima) {
        this.codigo = codigo;
        this.nome = nome;
        this.quantidade = quantidade;
        this.quantidadeMaxima = quantidadeMaxima;
    }

    public void repor(int qauntidade){
        if (this.quantidade + quantidade > quantidadeMaxima){
            this.quantidade = quantidadeMaxima;
            System.out.println("Estoque cheio. Não é possível ultrapassar o máximo!");
        } else {
            this.quantidade += qauntidade;
        }
    }

    public void consumir(int quantidade){
        if (quantidade <= this.quantidade){
            this.quantidade -= quantidade;
        } else {
            System.out.println("Ingrediente insuficiente para consumir " + quantidade + " unidades.");
        }
    }

    public void setQtdMaxima(int quantidadeMaxima) {
        this.quantidadeMaxima = quantidadeMaxima;
        if (this.quantidade > quantidadeMaxima) {
            this.quantidade = quantidadeMaxima;
        }
    }

    public int getTotal() {
        return this.quantidade;
    }

    public void mostrarInfo() {
        System.out.println("Código: " + codigo);
        System.out.println("Nome: " + nome);
        System.out.println("Quantidade: " + quantidade + "/" + quantidadeMaxima);
    }
}
