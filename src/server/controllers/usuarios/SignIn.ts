import { JWTServer } from "./../../shared/services/JWTServices";
import { PasswordCrypt } from "./../../shared/services";
import { StatusCodes } from "http-status-codes";
import { Request, Response } from "express";
import * as yup from "yup";

import { IUsuario } from "../../database/models";
import { validation } from "../../shared/middleware";
import { UsuariosProvider } from "../../database/providers/usuarios";

interface IBodyProps extends Omit<IUsuario, "id" | "cidadeId" | "nome"> {}

export const signInValidation = validation((getSchema) => ({
	body: getSchema<IBodyProps>(yup.object().shape({
		email: yup.string().required().email(),
		senha: yup.string().required().min(8)
	}))
}));

export const signIn = async (req: Request<{}, {}, IBodyProps>, res: Response) => {

	const { email, senha } = req.body;

	const result = await UsuariosProvider.getByEmail(email);

	if(result instanceof Error){
		return res.status(StatusCodes.UNAUTHORIZED).json({
			errors: {
				default: "Email ou senha inválidos"
			}
		});
	}

	const passwordMatch = PasswordCrypt.verifyPassword(senha, result.senha);

	if(!passwordMatch) {
		return res.status(StatusCodes.UNAUTHORIZED).json({
			errors: {
				default: "Email ou senha inválidos"
			}
		});
	} else {

		const accessToken = JWTServer.sign({ uid: result.id });
		if (accessToken === "JWT_SECRET_NOT_FOUND") {
			return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
				errors: {
					default: "Erro ao gerar o token de acesso"
				}
			});
		}


		return res.status(StatusCodes.OK).json({ accessToken });
	}
};