
const express = require('express');
const router = express.Router();
const validateToken = require('../middleware/validateTokenHandler');
const {
    getContacts, 
    createContact, 
    getContact, 
    updateContact, 
    deleteContact
} = require("../controllers/contactController");

 
router.use(validateToken);
 router.route("/").get(getContacts);
router.route("/").post(createContact);

// "/:id" means append id after a specific url ex-> /user1, /user2 etc

// we also write the same routes methods
// router.route("/:id").get(getContact).put(updateContact).delete(deleteContact);
// to save the lines of code
 
router.route("/:id").get(getContact);
router.route("/:id").put(updateContact);
router.route("/:id").delete(deleteContact);

module.exports = router;