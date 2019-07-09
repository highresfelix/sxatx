
function printCredits() {
    console.log("                                                                                          \
            \n     ______          ______      __  __                 ______                      _            \
            \n    / ____/___  ____/ / __/___ _/ /_/ /_  ___  _____   / ____/________ _____  _____(_)____       \
            \n   / / __/ __ \\/ __  / /_/ __ `/ __/ __ \\/ _ \\/ ___/  / /_  / ___/ __ `/ __ \\/ ___/ / ___/   \
            \n  / /_/ / /_/ / /_/ / __/ /_/ / /_/ / / /  __/ /     / __/ / /  / /_/ / / / / /__/ (__  )        \
            \n  \\____/\\____/\\__,_/_/  \\__,_/\\__/_/ /_/\\___/_/     /_/   /_/   \\__,_/_/ /_/\\___/_/____/ \
            \n    _________________________________________________________________________________            \
            \n       ___________________________________________________________________________               \
            \n                                                                                                 \
            \nCreated by Aaron 'Godfather' Francis                                                             \
            \nAaron Francis :: Developer + Creative + Design                                                   \
            \n  >Twitter: @highresfelix                                                                     \
            ");
}

// printCredits();

var proxyurl = "https://cors-anywhere.herokuapp.com/";
var XML_URL = 'http://content.abia.org:8080/webfids/webfids?action=updateArrivals';

fetch(proxyurl + XML_URL)
    .then(response => response.text())
    .then(data=>{
        /*console.log(data);*/ // string
        var parse = new DOMParser().parseFromString(data, 'text/xml');
        var test = xmlToJson(parse);
        console.log(test);

})

function xmlToJson(xml) {
    // Create the return object
    var obj = {};

    if (xml.nodeType == 1) {
        // element
        // do attributes
        if (xml.attributes.length > 0) {
            obj["@attributes"] = {};
            for (var j = 0; j < xml.attributes.length; j++) {
                var attribute = xml.attributes.item(j);
                obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
            }
        }
    } else if (xml.nodeType == 3) {
        // text
        obj = xml.nodeValue;
    }

    // do children
    // If all text nodes inside, get concatenated text from them.
    var textNodes = [].slice.call(xml.childNodes).filter(function(node) {
        return node.nodeType === 3;
    });
    if (xml.hasChildNodes() && xml.childNodes.length === textNodes.length) {
        obj = [].slice.call(xml.childNodes).reduce(function(text, node) {
            return text + node.nodeValue;
        }, "");
    } else if (xml.hasChildNodes()) {
        for (var i = 0; i < xml.childNodes.length; i++) {
            var item = xml.childNodes.item(i);
            var nodeName = item.nodeName;
            if (typeof obj[nodeName] == "undefined") {
                obj[nodeName] = xmlToJson(item);
            } else {
                if (typeof obj[nodeName].push == "undefined") {
                    var old = obj[nodeName];
                    obj[nodeName] = [];
                    obj[nodeName].push(old);
                }
                obj[nodeName].push(xmlToJson(item));
            }
        }
    }
    return obj;
}
