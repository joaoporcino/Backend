import { Knex } from "./server/database/knex";
import { server } from "./server/Server";

const StartServer = () => {
	server.listen(process.env.PORT || 3333, () => {
		console.log(`App rodando na porta ${process.env.PORT || 3333}`);
	});
};

if (process.env.IS_LOCALHOST !== "true") {

	Knex.migrate.latest()
		.then(() => {
			StartServer();
		})
		.catch(console.log);

} else {
	StartServer();
}
