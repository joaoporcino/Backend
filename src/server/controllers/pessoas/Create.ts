import { PessoasProvider } from "./../../database/providers/pessoas";
import { StatusCodes } from "http-status-codes";
import { Request, Response } from "express";
import * as yup from "yup";

import { validation } from "../../shared/middleware";
import { IPessoa } from "../../database/models";

interface IBodyProps extends Omit<IPessoa, "id"> {}

export const createValidation = validation((getSchema) => ({
	body: getSchema<IBodyProps>(yup.object().shape({
		nomeCompleto: yup.string().required().min(3),
		email: yup.string().required().email(),
		cidadeId: yup.number().required().min(1)
	}))
}));


export const create = async (req: Request<{}, {}, IBodyProps>, res: Response) => {

	const result  = await PessoasProvider.create(req.body);

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