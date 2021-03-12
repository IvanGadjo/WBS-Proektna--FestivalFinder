const debug = require('debug')('app:sparqlService');
const SparqlClient = require('sparql-http-client');



function sparqlService() {




    const searchFestivals = async (country, genre) => {



        const constructFestivalsArray = (theStream) => {

            // let nizaFestivali = [{
            //     name: 'tmp',
            //     locations: ['tmp1', 'tmp2'],
            //     genres: ['tmp1', 'tmp2'],
            //     websites: ['tmp'],
            //     dates: ['tmp'],
            //     image: 'tmp'
            // }];
            
            let nizaFestivali = [];
            let currentFestName = '';

    
    
            theStream.on('data', row => {
                Object.entries(row).forEach(([key, value]) => {
                // debug(`${key}: ${value.value} (${value.termType})`);
                
                
                let vrednost = `${value.value}`;
                const tipNaResurs = `${value.termType}`;        // tip na resurs na vrednosta


                if (tipNaResurs === 'NamedNode' && key !== 'slika') {       // ova znaci deka vrednost e url i treba da se izvadi posledniot string samo
                    const splittedArray = vrednost.split('/');
                    const lastWord = splittedArray[splittedArray.length - 1];
                    vrednost = lastWord;
                }


    
                if (key === 'topic') {       // if topic subj in tripple is encountered

                    if (key !== currentFestName) {      // if festival is new, add a new fest to nizaFestivali
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
         
                            } else {      //key = slika

                                // eslint-disable-next-line no-param-reassign
                                fstvl.image = vrednost;
                            }
                        }
                    });
                }
                
                
    
                });
            });
            
    
            theStream.on('error', err => {
                debug(err);
            });

            return nizaFestivali;
        };





        const endpointUrl = 'https://dbpedia.org/sparql';
        const client = new SparqlClient({ endpointUrl });
        

        const query = `
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


        // execute the query
        const stream = await client.query.select(query);

        // construct an array of festivals
        const festivalsArray = constructFestivalsArray(stream);

        debug(festivalsArray);

        // const nizaFestivali = [{
        //     name: 'tmp',
        //     locations: ['tmp1', 'tmp2'],
        //     genres: ['tmp1', 'tmp2'],
        //     website: 'tmp',
        //     dates: ['tmp'],
        //     image: 'tmp'
        // }];
        
        // let prevFestName = '';


        // stream.on('data', row => {
        //     Object.entries(row).forEach(([key, value]) => {
        //     debug(`${key}: ${value.value} (${value.termType})`);
            
            
        //     const vrednost = `${value.value}`;

        //     if (key === 'topic') {
        //         prevFestName = key;
        //     }
            

        //     nizaFestivali.forEach(fstvl => {
        //         if (fstvl.name === prevFestName) {
        //             if(key === 'zanr'){

        //             }
        //             else if(key === 'lokacija') {
        //                 if(fstvl.locations.includes())
        //             } 
        //             else if(key === 'dati') {

        //             }
        //             else if(key === 'sleden') {

        //             }
        //             else if(key === 'posleden_pat') {

        //             }
        //             else if(key === 'slika') {

        //             }
        //             else if(key === 'lokacija') {

        //             }
                    
                    
        //         }
        //     });

        //     // const newFestival = {
        //     //     key,
        //     //     value: value.value,
        //     //     termType: value.termType
        //     // };

        //     });
        // });
        

        // stream.on('error', err => {
        //     debug(err);
        // });

    };

    

    return {
        searchFestivals
    };

}

module.exports = sparqlService();



// festivali: http://dbpedia.org/resource/Incheon_Korean_Music_Wave (NamedNode)
// topic: Incheon Korean Music Wave (Literal)
// zanr: http://dbpedia.org/resource/Rock_music (NamedNode)
// lokacija: http://dbpedia.org/resource/South_Korea (NamedNode)
