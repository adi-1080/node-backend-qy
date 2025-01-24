import UserContact from '../models/usercontact-model.js'; // Import the updated model

const createUserContact = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      organization,
      region,
      industry,
      helpQuery,
      subscribeToProductUpdates,
      subscribeToEventUpdates,
    } = req.body;
    console.log(req.body)

    // Create a new user contact instance
    const newUserContact = new UserContact({
      firstName,
      lastName,
      email,
      organization,
      region,
      industry,
      helpQuery,
      subscribeToProductUpdates: subscribeToProductUpdates || false, // Default to false if not provided
      subscribeToEventUpdates: subscribeToEventUpdates || false, // Default to false if not provided
    });

    // Save the user contact to the database
    await newUserContact.save();

    res.status(201).json({
      message: 'User contact created successfully',
      userContact: newUserContact,
    });
  }catch(error){
    console.error('Error creating user contact:', error);
    res.status(500).json({
      message: 'Failed to create user contact',
      error: error.message,
    });
  }
};

export default createUserContact