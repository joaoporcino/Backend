import { StatusCodes } from "http-status-codes";

import { testServer } from "../jest.setup";


describe("Pessoas - GetById", () => {

	let accessToken = "";

	beforeAll(async () => {
		const email = "get-pessoas@email.com";
		await testServer.post("/cadastrar").send({ nome: "Teste", email, senha: "12345678"});
		const signInRes = await testServer.post("/entrar").send({ email, senha: "12345678"});

		accessToken = signInRes.body.accessToken;
	});

	let cidadeId: number | undefined = undefined;

	beforeAll(async () => {
		const resCidade = await testServer
			.post("/cidades")
			.set({ Authorization: `Bearer ${accessToken}` })
			.send({nome: "teste"});
        
		cidadeId = resCidade.body;
	});

	it("Busca registro por id", async () => {

		const res1 = await testServer
			.post("/pessoas")
			.set({ Authorization: `Bearer ${accessToken}` })
			.send({ 
				nomeCompleto: "Ana Clara",
				email: "anaclara@email.com",
				cidadeId
			});

		expect(res1.statusCode).toEqual(StatusCodes.CREATED);

		const resBuscada = await testServer
			.get(`/pessoas/${res1.body}`)
			.set({ Authorization: `Bearer ${accessToken}` })
			.send();

		expect(resBuscada.statusCode).toEqual(StatusCodes.OK);
		expect(resBuscada.body).toHaveProperty("nomeCompleto");
		expect(resBuscada.body).toHaveProperty("email");
		expect(resBuscada.body).toHaveProperty("cidadeId");
	});

	it("Tenta buscar registro que não existe", async () => {

		const res1 = await testServer
			.get("/pessoas/99999")
			.set({ Authorization: `Bearer ${accessToken}` })
			.send();

		expect(res1.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
		expect(res1.body).toHaveProperty("errors.default");
	});

	it("Tenta buscar registro por id sem accessToken", async () => {

		const res1 = await testServer
			.post("/pessoas")
			.set({ Authorization: `Bearer ${accessToken}` })
			.send({ 
				nomeCompleto: "Ana Clara",
				email: "anaclara-diferente@email.com",
				cidadeId
			});

		expect(res1.statusCode).toEqual(StatusCodes.CREATED);

		const resBuscada = await testServer
			.get(`/pessoas/${res1.body}`)
			.send();

		expect(resBuscada.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
		expect(resBuscada.body).toHaveProperty("errors.default");
	});
});