import { ETableNames } from "../ETableNames";
import { Knex } from "knex";


export const seed = async (knex: Knex) => {
	const [{ count }] = await knex(ETableNames.cidade).count<[{ count: number }]>("* as count");
	if (!Number.isInteger(count) || Number(count) > 0) return;

	const cidadesToInsert = cidadesDeMinasGerais.map(nomeDaCidade => ({ nome: nomeDaCidade }));
    
	await knex(ETableNames.cidade).insert(cidadesToInsert);

};

const cidadesDeMinasGerais = [
	"Água Clara",
	"Alcinópolis",
	"Amambaí",
	"Anastácio",
	"Anaurilândia",
	"Angélica",
	"Antônio João",
	"Aparecida do Taboado",
	"Aquidauana",
	"Aral Moreira",
	"Bandeirantes",
	"Bataguassu",
	"Bataiporã",
	"Bela Vista",
	"Bodoquena",
	"Bonito",
	"Brasilândia",
	"Caarapó",
	"Camapuã",
	"Campo Grande",
	"Caracol",
	"Cassilândia",
	"Chapadão do Sul",
	"Corguinho",
	"Coronel Sapucaia",
];