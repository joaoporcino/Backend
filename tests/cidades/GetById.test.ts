import { StatusCodes } from "http-status-codes";

import { testServer } from "../jest.setup";


describe("Cidades - GetById", () => {

	let accessToken = "";

	beforeAll(async () => {
		const email = "get-by-id-cidades@email.com";
		await testServer.post("/cadastrar").send({ nome: "Teste", email, senha: "12345678"});
		const signInRes = await testServer.post("/entrar").send({ email, senha: "12345678"});

		accessToken = signInRes.body.accessToken;
	});

	it("Busca registro por id", async () => {

		const res1 = await testServer
			.post("/cidades")
			.set({ Authorization: `Bearer ${accessToken}` })
			.send({ nome: "Caxias do sul" });

		expect(res1.statusCode).toEqual(StatusCodes.CREATED);

		const resBuscada = await testServer
			.get(`/cidades/${res1.body}`)
			.set({ Authorization: `Bearer ${accessToken}` })
			.send();

		expect(resBuscada.statusCode).toEqual(StatusCodes.OK);
		expect(resBuscada.body).toHaveProperty("nome");
	});
	it("Tenta buscar registro que não existe", async () => {

		const res1 = await testServer
			.get("/cidades/99999")
			.set({ Authorization: `Bearer ${accessToken}` })
			.send();

		expect(res1.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
		expect(res1.body).toHaveProperty("errors.default");
	});
	it("Tenta buscar registro por id sem accessToken", async () => {

		const res1 = await testServer
			.post("/cidades")
			.set({ Authorization: `Bearer ${accessToken}` })
			.send({ nome: "Caxias do sul" });

		expect(res1.statusCode).toEqual(StatusCodes.CREATED);

		const resBuscada = await testServer
			.get(`/cidades/${res1.body}`)
			.send();

		expect(resBuscada.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
		expect(resBuscada.body).toHaveProperty("errors.default");
	});
});