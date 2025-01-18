import mongoose from 'mongoose'
const Schema = mongoose.Schema

const userContactSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {  
    type: String,
    required: true,
  },
  organization: {
    type: String,
    default: null,
  },
  region: {
    type: String,
    default: null,
  },
  industry: {
    type: String,
    default: null,
  },
  helpQuery: {
    type: String, // Stores the user's response to "How can we help you?"
    maxlength: 1500,
    default: null,
  },
  subscribeToProductUpdates: {
    type: Boolean, // For the first checkbox: receive details about products, services, and events
    default: false,
  },
  subscribeToEventUpdates: {
    type: Boolean, // For the second checkbox: receive details about events
    default: false,
  },
});

const UserContact = mongoose.model('UserContact', userContactSchema);
export default UserContact;