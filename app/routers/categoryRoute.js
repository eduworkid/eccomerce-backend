const router = require("express").Router();

const { verifyToken } = require("../../middleware");
const categoryController = require("../controllers/categoryController");

router.get("/category",[verifyToken],categoryController.index);
router.post("/category", [verifyToken],categoryController.store);
router.put("/category/:id",[verifyToken] ,categoryController.update);
router.get("/category/:id", [verifyToken],categoryController.show);
router.delete("/category/:id",[verifyToken],categoryController.destroy
);
module.exports = router;
