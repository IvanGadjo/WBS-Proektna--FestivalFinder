//const debug = require('debug')('app:usersController');
const usersRepo = require('../repository/usersRepo');
const sparqlService = require('../services/sparqlService');


function usersController() {

    const createNewUser = (req, res) => {
        (async () => {
            const result = await usersRepo.createNewUser(req);
            res.json(result);
        })();
    };

    const addFestivalToUser = (req, res) => {
        (async () => {
            const result = await usersRepo.addFestivaltoUser(req);
            res.json(result);
        })();
    };

    const removeFestivalFromUser = (req, res) => {
        (async () => {
            const result = await usersRepo.removeFestivalFromUser(req);
            res.json(result);
        })();
    };
    
    const searchFestivals = (req, res) => {
        (async () => {
            const { country, genre } = req.params; 

            // const result = await sparqlService.searchFestivals(country, genre);
            const result = await sparqlService.searchFestivals('South_Korea', 'Pop_music');
            res.json(result); 
        })();
    };

    return {
        createNewUser,
        addFestivalToUser,
        removeFestivalFromUser,
        searchFestivals
    };
}

module.exports = usersController;
