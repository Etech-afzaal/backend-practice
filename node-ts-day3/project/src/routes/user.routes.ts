import { Router } from "express";

import {
  getUsers,
  getUser,
  addUser,
  replaceUser,
  patchUser,
  removeUser,
} from "../controllers/user.controller.js";

const router = Router();

router.get("/", getUsers);
router.get("/:id", getUser);
router.post("/", addUser);
router.put("/:id", replaceUser);
router.patch("/:id", patchUser);
router.delete("/:id", removeUser);

export default router;
