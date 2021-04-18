// const debug = require('debug')('app:usersController');
const usersRepo = require('../repository/usersRepo');
const sparqlService = require('../services/sparqlService');
const defaultMusicGenres = require('../../config/defaultMusicGenres');


function usersController() {

    const createNewUser = (req, res) => {
        (async () => {
            const result = await usersRepo.createNewUser(req);
            res.json(result);
        })();
    };

    const getUserById = (req, res) => {
        (async () => {
            const result = await usersRepo.getUserById(req);
            res.json(result);
        })();
    };

    const addFestivalToUser = (req, res) => {
        (async () => {
            const result = await usersRepo.addFestivaltoUser(req);
            res.json(result);
        })();
    };

    const getFestivalsFromUser = (req, res) => {
        (async () => {
            const result = await usersRepo.getFestivalsFromUser(req);
            res.json(result);
        })();
    };

    const removeFestivalFromUser = (req, res) => {
        (async () => {
            const result = await usersRepo.removeFestivalFromUser(req);
            res.json(result);
        })();
    };
    
    const searchFestivals = (req, res, err) => {
        (async () => {
            const { country, genre } = req.params; 


            if (!defaultMusicGenres.includes(genre))
                err('Provided genre not in default genres list');
                

            const result = await sparqlService.searchFestivals(country, genre);
            res.json(result); 
        })();
    };

    return {
        createNewUser,
        getUserById,
        addFestivalToUser,
        getFestivalsFromUser,
        removeFestivalFromUser,
        searchFestivals
    };
}

module.exports = usersController;
