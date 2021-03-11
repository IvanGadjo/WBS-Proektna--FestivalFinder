// sparql service


function sparqlService() {

    var parser = new SparqlParser();
    var parsedQuery = null;

    const searchFestivals = async (term) => {
        parsedQuery = parser.parse(

            'PREFIX foaf: <http://xmlns.com/foaf/0.1/> ' +
            'PREFIX dbr: <http://dbpedia.org/resource/> ' +
            'PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> ' +
            'PREFIX dbo: <http://dbpedia.org/ontology/> ' +
            'PREFIX dbp: <http://dbpedia.org/property/> ' +
            'SELECT ?festivali, ?topic, ?zanr, ?dati, ?sleden, ?websajt, ?posleden_pat, ?slika, ?lokacija ' +
            'WHERE { ' +
            'dbr:List_of_music_festivals_in_South_Korea dbo:wikiPageWikiLink ?festivali. ' +
            '?festivali rdfs:label ?topic. ' +
            '?festivali dbp:genre ?zanr. #mozebi treba dbo:genre ' +
            'optional {?festivali dbp:dates ?dati}. ' +
            'optional {?festivali dbp:next ?sleden}. ' +
            'optional {?festivali dbo:wikiPageExternalLink ?websajt}. ' +
            'optional {?festivali dbp:last ?posleden_pat}. ' +
            'optional {?festivali dbo:thumbnail ?slika} ' +
            'optional {?festivali dbp:location ?lokacija} ' +
            'filter(lang(?topic)="en")'
        )

        var generator = new SparqlGenerator({});
        parsedQuery.variables = ['?festivali'];
        var generatedQuery = generator.stringify(parsedQuery);

        debug('-----------GENERIRANO QUERY:')
        debug(generatedQuery)
    }


    return {
        searchFestivals
    }
}

module.exports = sparqlService();