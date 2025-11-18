CREATE TABLE IF NOT EXISTS "setor" (
    "id" serial NOT NULL UNIQUE,
    "nome" varchar(50) NOT NULL,
    PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "equipamentos" (
    "id" serial NOT NULL UNIQUE,
    "codigo" varchar(10) NOT NULL,
    "numero_serie" varchar(40) NOT NULL,
    "setor_id" bigint NOT NULL,
    "usuario" varchar(100) NOT NULL,
    "data_validacao" date NOT NULL,
    PRIMARY KEY ("id")
);

ALTER TABLE "equipamentos" ADD CONSTRAINT "equipamentos_fk3" FOREIGN KEY ("setor_id") REFERENCES "setor"("id");