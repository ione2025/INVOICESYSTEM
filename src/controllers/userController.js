const User = require('../models/User');
const dataStore = require('../utils/dataStore');

class UserController {
  // Create a new user (buyer or seller)
  static createUser(req, res) {
    try {
      const validation = User.validate(req.body);
      
      if (!validation.isValid) {
        return res.status(400).json({
          success: false,
          errors: validation.errors
        });
      }

      const user = new User(req.body);
      dataStore.addUser(user);

      res.status(201).json({
        success: true,
        message: `${user.type.charAt(0).toUpperCase() + user.type.slice(1)} created successfully`,
        data: user.toJSON()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error creating user',
        error: error.message
      });
    }
  }

  // Get all users
  static getAllUsers(req, res) {
    try {
      const { type } = req.query;
      
      let users;
      if (type && ['buyer', 'seller'].includes(type)) {
        users = dataStore.getUsersByType(type);
      } else {
        users = dataStore.getAllUsers();
      }

      res.json({
        success: true,
        count: users.length,
        data: users.map(u => u.toJSON())
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching users',
        error: error.message
      });
    }
  }

  // Get user by ID
  static getUserById(req, res) {
    try {
      const user = dataStore.getUser(req.params.id);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      res.json({
        success: true,
        data: user.toJSON()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching user',
        error: error.message
      });
    }
  }

  // Update user
  static updateUser(req, res) {
    try {
      const user = dataStore.updateUser(req.params.id, req.body);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      res.json({
        success: true,
        message: 'User updated successfully',
        data: user.toJSON()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error updating user',
        error: error.message
      });
    }
  }

  // Delete user
  static deleteUser(req, res) {
    try {
      const deleted = dataStore.deleteUser(req.params.id);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      res.json({
        success: true,
        message: 'User deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error deleting user',
        error: error.message
      });
    }
  }
}

module.exports = UserController;
