// as we are using async methods therfore we have to implement try catch block
// individually for each async merthod
// the better way to do that is to use a middle called 
// async handler
// it will going to provide the hhandling mechanism with ease


const asyncHandler = require('express-async-handler');
const Contact = require('../models/contactModel');
//@desc GET all contacts
//@route GET /api/contacts
//@access private


const getContacts = asyncHandler(async (req, res) => {
    const contact = await Contact.find({ user_id: req.user.id});
 res.status(200).json(contact);
});


//@desc GET contact
//@route GET /api/contacts/:id
//@access private

const getContact = asyncHandler(async (req, res) => {
    const contact = await Contact.findById(req.params.id);
    if(!contact){
        res.status(process.env.NOT_FOUND);

        throw new Error("Contact not found");
    }
    res.status(200).json(contact);
});

//@desc Create contacts
//@route POST /api/contacts
//@access private

const createContact = asyncHandler(async (req, res) => {
    console.log("The data of  body: ", req.body); 
    // handling the request if it do not contains one of the field
    const {name, email, phone} = req.body;
    if(!name || !email || !phone){
        res.status(400);
        throw new Error("All fields are mandatory");
    }

    console.log("before create");
    const contact = await Contact.create({
        name,
        email,
        phone,
        user_id: req.user.id
    });

    console.log("after create");
    res.status(201).json(contact);
});

//@desc Update contact
//@route PUT /api/contacts/:id
//@access private

const updateContact = asyncHandler(async (req, res) => {
    const contact = await Contact.findById(req.params.id);
    if(!contact){
        res.status(404);
        throw new Error("Contact not found");
    }

    if(contact.user_id.toString() !== req.user.id){
        res.status(403);
        throw new Error("User don't have permission to update other user's contacts");
    }
     const updatedContact = await Contact.findByIdAndUpdate(
        req.params.id,
        req.body,
        {new: true}
     );
    res.status(200).json(updatedContact);
});


//@desc Delete contacts
//@route Delete /api/contacts/:id
//@access private

const deleteContact = asyncHandler(async (req, res) => {
    const contact = await Contact.findById(req.params.id);
    if(!contact){
        res.status(404);
        throw new Error("Contact not found");
    }
    
    if(contact.user_id.toString() !== req.user.id){
        res.status(403);
        throw new Error("User don't have permission to delete other user's contacts");
    }
     await Contact.deleteOne({_id: req.params.id});
    res.status(200).json(contact);
});




module.exports = {
    getContacts, 
    createContact, 
    getContact, 
    updateContact, 
    deleteContact
};
