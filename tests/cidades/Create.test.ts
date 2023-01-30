import { StatusCodes } from "http-status-codes";
import { testServer } from "../jest.setup";

describe("Cidades - Create", () => {

	let accessToken = "";

	beforeAll(async () => {
		const email = "create-cidades@email.com";
		await testServer.post("/cadastrar").send({ nome: "Teste", email, senha: "12345678"});
		const signInRes = await testServer.post("/entrar").send({ email, senha: "12345678"});

		accessToken = signInRes.body.accessToken;
	});

	it("Cria registro", async () => {

		const res1 = await testServer
			.post("/cidades")
			.set({ Authorization: `Bearer ${accessToken}` })
			.send({ nome: "Caxias do Sul" });
    
    
		expect(res1.statusCode).toEqual(StatusCodes.CREATED);
		expect(typeof res1.body).toEqual("number");
	});
	it("Tenta criar um registro com nome curto", async () => {

		const res1 = await testServer
			.post("/cidades")
			.set({ Authorization: `Bearer ${accessToken}` })
			.send({ nome: "Ca" });
    
    
		expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
		expect(res1.body).toHaveProperty("errors.body.nome");
	});
	it("Tenta criar um registro sem o accessToken", async () => {

		const res1 = await testServer
			.post("/cidades")
			.send({ nome: "Caxias do Sul" });
    
    
		expect(res1.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
		expect(res1.body).toHaveProperty("errors.default");
	});
});