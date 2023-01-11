import { Knex } from "knex";
import { ETableNames } from "../ETableNames";

export async function up(knex: Knex) {
	return knex
		.schema
		.createTable(ETableNames.endereco, table => {
			table.bigIncrements("id").primary().index();
			table.string("tipo").index().notNullable();
			table.integer("cep").index().notNullable();
			table.string("rua").notNullable();
			table.integer("numero").notNullable();
			table.string("bairro").notNullable();
			table.string("estado").notNullable();
            

			table
				.bigInteger("pessoaId")
				.index().notNullable()
				.references("id")
				.inTable(ETableNames.pessoa)
				.onUpdate("CASCADE")
				.onDelete("RESTRICT");

			table.comment("Tabela usada para armazenar os endereços da pessoa.");
		})
		.then(() => {
			console.log(`# Created table ${ETableNames.endereco}`);
		});
}

export async function down(knex: Knex) {
	return knex
		.schema
		.dropTable(ETableNames.endereco)
		.then(() => {
			console.log(`# Dropped table ${ETableNames.endereco}`);
		});
}

