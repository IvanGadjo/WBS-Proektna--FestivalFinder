// subject: List_of_music_festivals_in_${country}
const constructQuery1 = (country) => {

    return `
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
};


// object: Music_festivals_in_${country}
const constructQuery2 = (country) => {

    return `
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
};

module.exports.constructQuery1 = constructQuery1;
module.exports.constructQuery2 = constructQuery2;
