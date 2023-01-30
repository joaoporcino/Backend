import { StatusCodes } from "http-status-codes";
import { testServer } from "../jest.setup";

describe("Pessoas - Create", () => {

	let accessToken = "";

	beforeAll(async () => {
		const email = "create-pessoas@email.com";
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

	it("Cria registro", async () => {

		const res1 = await testServer
			.post("/pessoas")
			.set({ Authorization: `Bearer ${accessToken}` })
			.send({ 
				nomeCompleto: "Ana Clara",
				email: "anaclara@email.com",
				cidadeId
			});
    
    
		expect(res1.statusCode).toEqual(StatusCodes.CREATED);
		expect(typeof res1.body).toEqual("number");
	});

	it("Tenta criar um registro com nome curto", async () => {

		const res1 = await testServer
			.post("/pessoas")
			.set({ Authorization: `Bearer ${accessToken}` })
			.send({ 
				nomeCompleto: "An",
				email: "anaclara@email.com",
				cidadeId: 1
			});
    
    
		expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
		expect(res1.body).toHaveProperty("errors.body.nomeCompleto");
	});

	it("Tenta criar um registro com email invalido", async () => {

		const res1 = await testServer
			.post("/pessoas")
			.set({ Authorization: `Bearer ${accessToken}` })
			.send({ 
				nomeCompleto: "Ana Clara",
				email: "anaclara",
				cidadeId: 1
			});
    
    
		expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
		expect(res1.body).toHaveProperty("errors.body.email");
	});

	it("Tenta criar um registro sem cidadeId", async () => {

		const res1 = await testServer
			.post("/pessoas")
			.set({ Authorization: `Bearer ${accessToken}` })
			.send({ 
				nomeCompleto: "Ana Clara",
				email: "anaclara",
				cidadeId: null
			});
    
    
		expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
		expect(res1.body).toHaveProperty("errors.body.cidadeId");
	});

	it("Tenta criar um registro com email duplicado", async () => {

		const res1 = await testServer
			.post("/pessoas")
			.set({ Authorization: `Bearer ${accessToken}` })
			.send({ 
				nomeCompleto: "Ana Clara",
				email: "anaclara2@email.com",
				cidadeId
			});
    
    
		expect(res1.statusCode).toEqual(StatusCodes.CREATED);
		expect(typeof res1.body).toEqual("number");

		const res2 = await testServer
			.post("/pessoas")
			.set({ Authorization: `Bearer ${accessToken}` })
			.send({ 
				nomeCompleto: "Ana Clara",
				email: "anaclara2@email.com",
				cidadeId
			});
    
    
		expect(res2.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
		expect(res2.body).toHaveProperty("errors.default");
	});

	it("Tenta criar um registro com cidadeId invalido", async () => {

		const res1 = await testServer
			.post("/pessoas")
			.set({ Authorization: `Bearer ${accessToken}` })
			.send({ 
				nomeCompleto: "Ana Clara",
				email: "anaclara@gmail.com",
				cidadeId: 9999999
			});
    
    
		expect(res1.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
		expect(res1.body).toHaveProperty("errors.default");
	});

	it("Tenta criar um registro sem body", async () => {

		const res1 = await testServer
			.post("/pessoas")
			.set({ Authorization: `Bearer ${accessToken}` })
			.send({});
    
    
		expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
		expect(res1.body).toHaveProperty("errors.body.nomeCompleto");
		expect(res1.body).toHaveProperty("errors.body.email");
		expect(res1.body).toHaveProperty("errors.body.cidadeId");
	});

	it("Tenta cria registro sem accessToken", async () => {

		const res1 = await testServer
			.post("/pessoas")
			.send({ 
				nomeCompleto: "Ana Clara",
				email: "anaclara@email.com",
				cidadeId
			});
    
    
		expect(res1.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
		expect(res1.body).toHaveProperty("errors.default");
	});
});