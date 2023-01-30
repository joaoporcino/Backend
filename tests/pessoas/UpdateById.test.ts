import { StatusCodes } from "http-status-codes";

import { testServer } from "../jest.setup";


describe("Pessoas - UpdateById", () => {

	let accessToken = "";

	beforeAll(async () => {
		const email = "update-pessoas@email.com";
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

	it("Atualiza registro", async () => {

		const res1 = await testServer
			.post("/pessoas")
			.set({ Authorization: `Bearer ${accessToken}` })
			.send({ 
				nomeCompleto: "Ana Clara",
				email: "clara@email.com",
				cidadeId
			});

		expect(res1.statusCode).toEqual(StatusCodes.CREATED);

		const resAtualizada = await testServer
			.put(`/pessoas/${res1.body}`)
			.set({ Authorization: `Bearer ${accessToken}` })
			.send({ 
				nomeCompleto: "Ana",
				email: "clara@email.com",
				cidadeId: 1
			});

		expect(resAtualizada.statusCode).toEqual(StatusCodes.NO_CONTENT);
	});
    
	it("Tenta atualizar registro que não existe", async () => {

		const res1 = await testServer
			.put("/pessoas/99999")
			.set({ Authorization: `Bearer ${accessToken}` })
			.send({ 
				nomeCompleto: "Ana Clara",
				email: "anaclara@email.com",
				cidadeId: 1
			});

		expect(res1.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
		expect(res1.body).toHaveProperty("errors.default");
	});

	it("Tenta atualizar registro sem accessToken", async () => {

		const res1 = await testServer
			.post("/pessoas")
			.set({ Authorization: `Bearer ${accessToken}` })
			.send({ 
				nomeCompleto: "Ana Clara",
				email: "clara-diferente@email.com",
				cidadeId
			});

		expect(res1.statusCode).toEqual(StatusCodes.CREATED);

		const resAtualizada = await testServer
			.put(`/pessoas/${res1.body}`)
			.send({ 
				nomeCompleto: "Ana",
				email: "clara@email.com",
				cidadeId: 1
			});

		expect(resAtualizada.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
		expect(resAtualizada.body).toHaveProperty("errors.default");
	});
});