const debug = require('debug')('app:sparqlService');
const SparqlClient = require('sparql-http-client');
const defaultMusicGenres = require('../../../config/defaultMusicGenres');
const { constructQuery1, constructQuery2 } = require('./ConstructSparqlQueries');



function sparqlService() {

    const constructFestivalsArray = (theStream) => {
            
        // eslint-disable-next-line prefer-const
        let nizaFestivali = [];
        let currentFestName = '';


        return new Promise((resolve, reject) => {

        

            theStream.on('data', row => {
                Object.entries(row).forEach(([key, value]) => {
                // debug(`${key}: ${value.value} (${value.termType})`);
                
                                                                
                let vrednost = `${value.value}`;                // vrednost od trojkata
                const tipNaResurs = `${value.termType}`;        // tip na resurs na vrednosta


                if (tipNaResurs === 'NamedNode' && key !== 'slika' && key !== 'websajt') {       // ova znaci deka vrednost e url i treba da se izvadi posledniot string samo
                    const splittedArray = vrednost.split('/');
                    const lastWord = splittedArray[splittedArray.length - 1];
                    vrednost = lastWord;
                }


    
                if (key === 'topic') {       // if topic subj in tripple is encountered

                    if (vrednost !== currentFestName) {      // if festival is new, add a new fest to nizaFestivali
                        currentFestName = vrednost;
                        
                        nizaFestivali.push({
                            name: currentFestName,
                            locations: [],
                            genres: [],
                            websites: [],
                            dates: [],
                            image: ''
                        });
                        
                    }

                } else {        // other subject encountered

                    // traverse array and add new values
                    nizaFestivali.forEach(fstvl => {

                        if (fstvl.name === currentFestName) {
                            if (key === 'zanr') {

                                if (!fstvl.genres.includes(vrednost))
                                    fstvl.genres.push(vrednost);


                            } else if (key === 'lokacija') {

                                if (!fstvl.locations.includes(vrednost))
                                    fstvl.locations.push(vrednost);

                            } else if (key === 'dati') {

                                if (!fstvl.dates.includes(vrednost))
                                    fstvl.dates.push(vrednost);
        
                            } else if (key === 'sleden') {

                                if (!fstvl.dates.includes(vrednost))
                                    fstvl.dates.push(vrednost);
        
                            } else if (key === 'posleden_pat') {

                                if (!fstvl.dates.includes(vrednost))
                                    fstvl.dates.push(vrednost);
        
                            } else if (key === 'websajt') {

                                if (!fstvl.websites.includes(vrednost))
                                    fstvl.websites.push(vrednost);
        
                            } else if (key === 'slika') {      //key = slika

                                // eslint-disable-next-line no-param-reassign
                                fstvl.image = vrednost;
                            }
                        }
                    });
                }
                
                
    
                });
            });

            theStream.on('end', () => resolve(nizaFestivali));

            
            theStream.on('error', err => {
                debug('-- ERROR -- ', err);
                reject(err);
            });


        });


        // debug(nizaFestivali);

        // return nizaFestivali;
    };

    const filterArrayByGenre = (festivalsArray, festivalGenre) => {


            
        if (festivalGenre === 'Other') {


            const newFestivalsArray = festivalsArray.filter(fstvl => {

                let hasDefaultGenre = false;
                defaultMusicGenres.forEach(dmg => {
                    
                    if (fstvl.genres.includes(dmg)) {
                        debug('Contains main genre: ', fstvl.name);
                        hasDefaultGenre = true;
                    }  
                        
                });

                return !hasDefaultGenre;
            });
            return newFestivalsArray;


        }
            
        
        return festivalsArray.filter(fstvl => fstvl.genres.includes(festivalGenre));
        
    };

    const removeBlankValues = (festivalsArray) => {

        const cleanedFestivalsArray = [];

        festivalsArray.forEach(fstvl => {

            const newFestival = {};

            newFestival.name = fstvl.name;
            newFestival.image = fstvl.image;
            newFestival.locations = fstvl.locations.filter(Boolean);
            newFestival.genres = fstvl.genres.filter(Boolean);
            newFestival.websites = fstvl.websites.filter(Boolean);
            newFestival.dates = fstvl.dates.filter(Boolean);

            cleanedFestivalsArray.push(newFestival);
        });

        return cleanedFestivalsArray;
    };

    const searchFestivals = async (country, genre) => {


        const endpointUrl = 'https://dbpedia.org/sparql';
        const client = new SparqlClient({ endpointUrl });
        

        // subject: List_of_music_festivals_in_${country}
        const query1 = constructQuery1(country);
        // object: Music_festivals_in_${country}
        const query2 = constructQuery2(country);

        // execute the queries
        const stream = await client.query.select(query1);
        const stream2 = await client.query.select(query2);

        // construct an array of festivals
        const festivalsArray = await constructFestivalsArray(stream);
        const festivalsArray2 = await constructFestivalsArray(stream2);

        // clean the empty values in the props of the festivals
        const cleanedFestivalsArray = removeBlankValues(festivalsArray);
        const cleanedFestivalsArray2 = removeBlankValues(festivalsArray2);

        // filter the array by category
        const filteredFestivalArray = filterArrayByGenre(cleanedFestivalsArray, genre);
        const filteredFestivalArray2 = filterArrayByGenre(cleanedFestivalsArray2, genre);



        // debug('-------KRAJ: ', festivalsArray);
        // debug('-------BR FEST 1: ', festivalsArray.length);

        // debug('-------KRAJ: ', festivalsArray2);
        // debug('-------BR FEST 2: ', festivalsArray2.length);



        // const result = [...filteredFestivalArray, ...filteredFestivalArray2];
        // debug('-------BR FEST KRAJ: ', result.length);


        
        const my = new Set(filteredFestivalArray);
        filteredFestivalArray2.forEach(f => {
            if (!Array.from(my).map(ff => ff.name).includes(f.name))
                my.add(f);
        });
        const finalArr = Array.from(my);
        

        // return filteredFestivalArray;
        // return filteredFestivalArray2;
        // return result;
        return finalArr;

    };

    

    

    return {
        searchFestivals
    };

}

module.exports = sparqlService();
