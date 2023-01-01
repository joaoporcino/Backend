import { StatusCodes } from "http-status-codes";
import { Request, Response } from "express";
import * as yup from "yup";

import { validation } from "../../shared/middleware";

interface IQueryProps {
    page?: number;
    limit?: number;
    filter?: string;
}

export const getAllValidation = validation((getSchema) => ({
	query: getSchema<IQueryProps>(yup.object().shape({
		page: yup.number().notRequired().moreThan(0),
		limit: yup.number().notRequired().moreThan(0),
		filter: yup.string().notRequired(),
	}))
}));


export const getAll = async (req: Request<{}, {}, {}, IQueryProps>, res: Response) => {

	console.log(req.query);

	return res.status(StatusCodes.OK).json([
		{
			id: 1,
			nome: "Caxias do Sul",
		}
	]);
};