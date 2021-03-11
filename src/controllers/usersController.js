const debug = require('debug')('app:usersController');
const usersRepo = require('../repository/usersRepo');
const sparqlService = require('../services/sparqlService');


function usersController() {

    const searchFestivals = (req, res) => {
        (async () => {
            const result = await sparqlService.searchFestivals('');
            res.json(result); 
        })();
    };

    return {
        searchFestivals
    };
}

module.exports = usersController;
