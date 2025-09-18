public class sistema {
    public static void main(String[] args) {
        Ingredientes agua = new Ingredientes(1,"Agua",1000,2000);

        agua.mostrarInfo();

        agua.repor(500);  // Reposição dentro do limite
        agua.mostrarInfo();

        agua.repor(800);  // Tentativa de ultrapassar limite
        agua.mostrarInfo();

        agua.consumir(300); // Consome um pouco
        agua.mostrarInfo();

        agua.consumir(5000); // Tentativa de consumir mais do que o disponível
        agua.mostrarInfo();
    }
}
