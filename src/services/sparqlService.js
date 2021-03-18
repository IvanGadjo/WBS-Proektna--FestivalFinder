const debug = require('debug')('app:sparqlService');
const SparqlClient = require('sparql-http-client');



function sparqlService() {




    const searchFestivals = async (country, genre) => {



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

        // FIXME:
        const filterArrayByGenre = (festivalsArray, festivalGenre) => {

            // FIXME: It should exclude all predefined genres
            if (genre === 'other')
                return festivalsArray;
            
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



        const endpointUrl = 'https://dbpedia.org/sparql';
        const client = new SparqlClient({ endpointUrl });
        

        // subject: List_of_music_festivals_in_${country}
        const query1 = `
        PREFIX foaf: <http://xmlns.com/foaf/0.1/>
        PREFIX dbr: <http://dbpedia.org/resource/>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        PREFIX dbo: <http://dbpedia.org/ontology/>
        PREFIX dbp: <http://dbpedia.org/property/>
        SELECT ?topic ?zanr ?dati ?sleden ?websajt ?posleden_pat ?slika ?lokacija
        WHERE {
            dbr:List_of_music_festivals_in_${country} dbo:wikiPageWikiLink ?festivali.
            ?festivali rdfs:label ?topic.
            ?festivali dbp:genre ?zanr. #mozebi treba dbo:genre
            optional {?festivali dbp:dates ?dati}.
            optional {?festivali dbp:next ?sleden}.
            optional {?festivali dbo:wikiPageExternalLink ?websajt}.
            optional {?festivali dbp:last ?posleden_pat}.
            optional {?festivali dbo:thumbnail ?slika}.
            optional {?festivali dbp:location ?lokacija}.
            filter(lang(?topic)="en").
        }`;


        // object: Music_festivals_in_${country}
        const query2 = `
        PREFIX foaf: <http://xmlns.com/foaf/0.1/>
        PREFIX dbr: <http://dbpedia.org/resource/>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        PREFIX dbo: <http://dbpedia.org/ontology/>
        PREFIX dbp: <http://dbpedia.org/property/>
        SELECT ?festivali, ?topic, ?zanr, ?dati, ?sleden, ?websajt, ?posleden_pat, ?slika, ?lokacija
        WHERE {
            ?festivali dbo:wikiPageWikiLink dbc:Music_festivals_in_${country}.
            ?festivali rdfs:label ?topic.
            
            ?festivali dbp:genre ?zanr. #mozebi treba dbo:genre
            optional {?festivali dbp:dates ?dati}.
            optional {?festivali dbp:next ?sleden}.
            optional {?festivali dbo:wikiPageExternalLink ?websajt}.
            optional {?festivali dbp:last ?posleden_pat}.
            optional {?festivali dbo:thumbnail ?slika}
            optional {?festivali dbp:location ?lokacija}
            filter(lang(?topic)="en")
            }
        `;


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


        // TODO: Najloshoto resenie vo svetot
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


