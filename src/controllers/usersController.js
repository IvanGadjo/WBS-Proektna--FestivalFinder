const debug = require('debug')('app:usersController');
const usersRepo = require('../repository/usersRepo');
const sparqlService = require('../services/sparqlService');


function usersController() {

    const createNewUser = (req, res) => {
        (async () => {
            const result = await usersRepo.createNewUser(req);
            res.json(result);
        })();
    };

    
    
    const searchFestivals = (req, res) => {
        (async () => {
            const result = await sparqlService.searchFestivals('');
            res.json(result); 
        })();
    };

    return {
        createNewUser,
        searchFestivals
    };
}

module.exports = usersController;
