import { Router } from "express";

import { CidadesController, PessoasControler } from "./../controllers";

const router = Router();

router.get("/", (req, res) => {

	return res.send("Ola, dev!");
});

router.get("/cidades", CidadesController.getAllValidation, CidadesController.getAll);
router.post("/cidades", CidadesController.createValidation, CidadesController.create);
router.get("/cidades/:id", CidadesController.getByIdValidation, CidadesController.getById);
router.put("/cidades/:id", CidadesController.updateByIdValidation, CidadesController.updateById);
router.delete("/cidades/:id", CidadesController.deleteByIdValidation, CidadesController.deleteById);

router.get("/pessoas", PessoasControler.getAllValidation, PessoasControler.getAll);
router.post("/pessoas", PessoasControler.createValidation, PessoasControler.create);
router.get("/pessoas/:id", PessoasControler.getByIdValidation, PessoasControler.getById);
router.put("/pessoas/:id", PessoasControler.updateByIdValidation, PessoasControler.updateById);
router.delete("/pessoas/:id", PessoasControler.deleteByIdValidation, PessoasControler.deleteById);


export { router };