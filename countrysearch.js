const allCountries = ['Afghanistan','Albania','Algeria','Andorra','Angola','Antigua & Deps','Argentina','Armenia','Australia','Austria','Azerbaijan','Bahamas','Bahrain','Bangladesh','Barbados','Belarus','Belgium','Belize','Benin','Bhutan','Bolivia','Bosnia Herzegovina','Botswana','Brazil','Brunei','Bulgaria','Burkina','Burundi','Cambodia','Cameroon','Canada','Cape Verde','Central African Rep','Chad','Chile','China','Colombia','Comoros','Congo','Congo {Democratic Rep}','Costa Rica','Croatia','Cuba','Cyprus','Czech Republic','Denmark','Djibouti','Dominica','Dominican Republic','East Timor','Ecuador','Egypt','El Salvador','Equatorial Guinea','Eritrea','Estonia','Ethiopia','Fiji','Finland','France','Gabon','Gambia','Georgia','Germany','Ghana','Greece','Grenada','Guatemala','Guinea','Guinea-Bissau','Guyana','Haiti','Honduras','Hungary','Iceland','India','Indonesia','Iran','Iraq','Ireland {Republic}','Israel','Italy','Ivory Coast','Jamaica','Japan','Jordan','Kazakhstan','Kenya','Kiribati','Korea North','Korea South','Kosovo','Kuwait','Kyrgyzstan','Laos','Latvia','Lebanon','Lesotho','Liberia','Libya','Liechtenstein','Lithuania','Luxembourg','Macedonia','Madagascar','Malawi','Malaysia','Maldives','Mali','Malta','Marshall Islands','Mauritania','Mauritius','Mexico','Micronesia','Moldova','Monaco','Mongolia','Montenegro','Morocco','Mozambique','Myanmar, {Burma}','Namibia','Nauru','Nepal','Netherlands','New Zealand','Nicaragua','Niger','Nigeria','Norway','Oman','Pakistan','Palau','Panama','Papua New Guinea','Paraguay','Peru','Philippines','Poland','Portugal','Qatar','Romania','Russian Federation','Rwanda','St Kitts & Nevis','St Lucia','Saint Vincent & the Grenadines','Samoa','San Marino','Sao Tome & Principe','Saudi Arabia','Senegal','Serbia','Seychelles','Sierra Leone','Singapore','Slovakia','Slovenia','Solomon Islands','Somalia','South Africa','South Sudan','Spain','Sri Lanka','Sudan','Suriname','Swaziland','Sweden','Switzerland','Syria','Taiwan','Tajikistan','Tanzania','Thailand','Togo','Tonga','Trinidad & Tobago','Tunisia','Turkey','Turkmenistan','Tuvalu','Uganda','Ukraine','United Arab Emirates','United Kingdom','United States','Uruguay','Uzbekistan','Vanuatu','Vatican City','Venezuela','Vietnam','Yemen','Zambia','Zimbabwe']
    
const levenshteinDistance = (string1 = '', string2 = '') => {
    const matrix = Array(string2.length + 1).fill(Array(string1.length + 1));
    for(let i = 0; i <= string1.length; i+=1){
        matrix[0][i] = i;
    }
    for(let j = 0; j <= string2.length; j+=1){
        matrix[j][0] = j;
    }
    for(let j = 1; j <= string2.length; j+=1){
        for(let i = 1; i <= string1.length; i += 1){
            const thisNumber = string1[i-1] === string2[i-1] ? 0 : 1;
            matrix[j][i] = Math.min(
                matrix[j][i - 1] + 1, // deletion
                matrix[j - 1][i] + 1, // insertion
                matrix[j - 1][i - 1] + thisNumber, // substitution
            );
        }
    }
    return matrix[string2.length][string1.length];
};
const findByLevenshteinDistance = (query = '') =>{
    return allCountries
                .map(x => {
                    let obj = {};
                    obj['value'] = x;
                    obj['dist'] = levenshteinDistance(query.toLowerCase(), x.toLowerCase());
                    return obj;
                })
                .sort((a,b) => (a.dist > b.dist) ? 1 : -1)
                .slice(0, 10);
};

const findByLevenshteinDistanceMaarBeter = (query = '') =>{
    return allCountries
                .map(x => {
                    let obj = {};
                    obj['value'] = x;
                    var dist = 99999; // heel hoog dus
                    for(let i = 0; i <= x.length - query.length; i+=1){
                        var tmpDist = levenshteinDistance(query.toLowerCase(), x.substring(i, query.length+i).toLowerCase());
                        if(tmpDist < dist){
                            dist = tmpDist;
                        }
                    }
                    obj['dist'] = dist - query.length;
                    return obj;
                })
                .sort((a,b) => (a.dist > b.dist) ? 1 : -1)
                .filter(x => x.dist < 5)
                .slice(0, 10);
};

const input = document.getElementById("country-finder");
input.addEventListener("keyup", (e) =>{
    let resultlist = document.querySelector("ul.results-list");
    resultlist.innerHTML = '';
    findByLevenshteinDistanceMaarBeter(e.target.value)
        .forEach(x => {
            var el = document.createElement("li");
            el.innerText = x.value + '\t\t(' + x.dist + ')';
            resultlist.appendChild(el);
        });
});