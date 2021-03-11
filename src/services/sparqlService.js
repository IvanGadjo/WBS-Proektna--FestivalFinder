// sparql service


// Parse a SPARQL query to a JSON object
var SparqlParser = require('sparqljs').Parser;


var parser = new SparqlParser();
var parsedQuery = parser.parse(
    'PREFIX foaf: <http://xmlns.com/foaf/0.1/> ' +
    'SELECT * { ?mickey foaf:name "Mickey Mouse"@en; foaf:knows ?other. }');


    'PREFIX foaf: <http://xmlns.com/foaf/0.1/> ' +
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
    'filter(lang(?topic)="en") ' +
    '} '



// Regenerate a SPARQL query from a JSON object
var SparqlGenerator = require('sparqljs').Generator;
var generator = new SparqlGenerator({ /* prefixes, baseIRI, factory, sparqlStar */ });
parsedQuery.variables = ['?mickey'];
var generatedQuery = generator.stringify(parsedQuery);