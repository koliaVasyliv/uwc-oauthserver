
const clientRouter = require('express').Router();


module.exports = function (User, Client) {
    const clientController = require('../controllers/clientController')(User, Client);
    const userController = require('../controllers/userController')(User);

    clientRouter.route('/')
        .all(userController.checkAuthentication)
        .get(clientController.getClients)
        .post(clientController.createClient);

    clientRouter.route('/:name')
        .all(userController.checkAuthentication)
        .get(clientController.getClient)

    return clientRouter;
};