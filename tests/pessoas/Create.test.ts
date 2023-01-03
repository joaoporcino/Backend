import { StatusCodes } from "http-status-codes";
import { testServer } from "../jest.setup";

describe("Pessoas - Create", () => {

	it("Cria registro", async () => {

		const res1 = await testServer
			.post("/pessoas")
			.send({ 
				nomeCompleto: "Ana Clara",
				email: "anaclara@email.com",
				cidadeId: 1
			});
    
    
		expect(res1.statusCode).toEqual(StatusCodes.CREATED);
		expect(typeof res1.body).toEqual("number");
	});
	it("Tenta criar um registro com nome curto", async () => {

		const res1 = await testServer
			.post("/pessoas")
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
			.send({ 
				nomeCompleto: "Ana Clara",
				email: "anaclara",
				cidadeId: 1
			});
    
    
		expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
		expect(res1.body).toHaveProperty("errors.body.email");
	});
	it("Tenta criar um registro sem cidade", async () => {

		const res1 = await testServer
			.post("/pessoas")
			.send({ 
				nomeCompleto: "Ana Clara",
				email: "anaclara",
				cidadeId: null
			});
    
    
		expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
		expect(res1.body).toHaveProperty("errors.body.cidadeId");
	});
});