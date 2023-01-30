import { UsuariosProvider } from "../../database/providers/usuarios";
import { StatusCodes } from "http-status-codes";
import { Request, Response } from "express";
import * as yup from "yup";

import { validation } from "../../shared/middleware";
import { IUsuario } from "../../database/models";

interface IBodyProps extends Omit<IUsuario, "id"> {}

export const signUpValidation = validation((getSchema) => ({
	body: getSchema<IBodyProps>(yup.object().shape({
		nome: yup.string().required().min(3),
		email: yup.string().required().email().min(5),
		senha: yup.string().required().min(8)
	}))
}));


export const signUp = async (req: Request<{}, {}, IBodyProps>, res: Response) => {

	const result  = await UsuariosProvider.create(req.body);

	if (result instanceof Error) {
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			errors:{
				default: result.message
			}
		});
	}

	console.log(result);

	return res.status(StatusCodes.CREATED).json(result);
};