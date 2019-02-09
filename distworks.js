var algorithmList;
var displaySelect;
var listArea;
var currentDisplay;

var nameIndex = {};
var nameList = [];
var categoryList = {
    'Oscillators': {'heading': 'Sound Generation', 'algorithms': []},
    'Sample Players': {'heading': 'Sound Generation', 'algorithms': []},
    'Recorders': {'algorithms': []},
    'Filters': {'heading': 'Audio Processing', 'algorithms': []},
    'Waveshaping': {'heading': 'Audio Processing', 'algorithms': []},
    'Modulation Effects': {'heading': 'Audio Processing', 'algorithms': []},
    'Delay': {'heading': 'Audio Processing', 'algorithms': []},
    'Reverb': {'heading': 'Audio Processing', 'algorithms': []},
    'Compression': {'heading': 'Audio Processing', 'algorithms': []},
    'LFO': {'heading': 'Modulation', 'algorithms': []},
    'Randomness & Patterns': {'heading': 'Modulation', 'algorithms': []},
    'Envelopes & VCA': {'heading': 'Modulation', 'algorithms': []},
    'Quantizers': {'algorithms': []},
    'CV Processing': {'algorithms': []},
    'MIDI & External Control': {'algorithms': []},
    'Utility': {'algorithms': []}
};
var categoryOrder = [
    'Oscillators', 
    'Sample Players', 
    'Recorders', 
    'Filters', 
    'Waveshaping', 
    'Modulation Effects', 
    'Delay', 
    'Reverb', 
    'Compression', 
    'LFO', 
    'Randomness & Patterns', 
    'Envelopes & VCA', 
    'Quantizers', 
    'CV Processing', 
    'MIDI & External Control', 
    'Utility'
];

window.onload = function() {
    currentDisplay = 'by category';

    displaySelect = document.getElementById('display_select');
    listArea = document.getElementById('list');

    displaySelect.oninput = function() {
        currentDisplay = displaySelect.value;
        writeList();
    };

    getJSON('algorithms.json', function(response) { 
        algorithmList = response;

        for (var i = 0; i < algorithmList.length; i++) {
            nameIndex[algorithmList[i].name] = i;
            nameList[i] = algorithmList[i].name;
            categoryList[algorithmList[i].category].algorithms.push(i);
        }
        nameList.sort();
        displaySelect.value = currentDisplay;
        writeList();
    });
}

function displayListByNumber() {
    clearListArea();
    for (var i = 0; i < algorithmList.length; i++) {
        var algorithm = algorithmList[i];
        displayAlgorithm(algorithm);
    }
}

function displayListByName() {
    clearListArea();
    for (var i = 0; i < nameList.length; i++) {        
        displayAlgorithm(algorithmList[nameIndex[nameList[i]]]);
    }
}

function displayListByCategory() {
    clearListArea();
    for (var i = 0; i < categoryOrder.length; i++) {
        var category = categoryOrder[i];
        var categoryHeading = categoryList[category].heading;
        
        var categoryHeader = document.createElement('h3');
        categoryHeader.classList.add('category_header');

        if (categoryHeading) {
            categoryHeader.innerHTML = categoryList[category].heading + ' - ' + category;
        }
        else {
            categoryHeader.innerHTML = category;
        }
        listArea.appendChild(categoryHeader);

        var algorithms = categoryList[category].algorithms;
        for (var j = 0; j < algorithms.length; j++) {
            displayAlgorithm(algorithmList[algorithms[j]]);
        }

        var categorySeparator = document.createElement('div');
        categorySeparator.classList.add('category_separator');
        listArea.appendChild(categorySeparator);
    }
}

function displayAlgorithm(info) {
    var algoDiv = document.createElement('div');

    var infoName = info.algorithm + '_info';
    var headerName = info.algorithm + '_header';
    var videoLinkName = info.algorithm + '_videolink';

    // ********* Heading *********
    var algoHeader = document.createElement('h3');
    algoHeader.id = headerName;
    algoHeader.classList.add('listing');

    var videoLink = document.createElement('a');
    videoLink.id = videoLinkName;
    videoLink.classList.add('videolink');
    videoLink.classList.add('transparent');
    videoLink.setAttribute('href', 'https://www.youtube.com/watch?v=' + info.video);
    videoLink.setAttribute('target', '_blank');
    videoLink.innerHTML = '<img src="yt_icon_rgb.png" class="videoicon">';
    algoHeader.appendChild(videoLink);

    algoTitle = document.createElement('div');
    algoTitle.classList.add('pointy', 'title');
    algoTitle.innerHTML = info.algorithm + ' ' + info.name + ' ';
    algoTitle.onclick = function () {
        var infoDiv = document.getElementById(infoName);
        var headerDiv = document.getElementById(headerName);
        var videoDiv = document.getElementById(videoLinkName);
    
        if (infoDiv.getAttribute('data-collapsed') === 'true') {
            infoDiv.style.height = (infoDiv.scrollHeight + 40) + 'px';
            headerDiv.classList.remove('listing');
            videoDiv.classList.remove('transparent');
            infoDiv.setAttribute('data-collapsed', 'false');
        }
        else {
            infoDiv.style.height = '0px';
            headerDiv.classList.add('listing');
            videoDiv.classList.add('transparent');
            infoDiv.setAttribute('data-collapsed', 'true');
        }
        return false;
    }; 
    algoHeader.appendChild(algoTitle);

    algoDiv.appendChild(algoHeader);

    // ********* Info Div *********
    var infoDiv = document.createElement('div');
    infoDiv.id = info.algorithm + '_info';
    infoDiv.classList.add('algo_info');
    infoDiv.style.height = '0px';
    infoDiv.setAttribute('data-collapsed', 'true');

    // ********* IO *********
    var ioP = document.createElement('p');
    ioP.classList.add('io');
    var ioList = info.io;
    for (var i = 0; i < ioList.length; i++) {
        ioP.innerHTML += ioList[i] + '<br>';
    }
    infoDiv.appendChild(ioP);
    
    // ********* Extra *********
    if (info.extra) {
        var extraP = document.createElement('p');
        extraP.classList.add('extra');
        extraP.innerHTML += info.extra + '<br>';
        infoDiv.appendChild(extraP);    
    }

    // ********* Parameters *********
    var paramList = info.parameters;
    if (paramList.length) {
        var paramTable = document.createElement('table');
        var headerTR = document.createElement('tr');

        var thParam = document.createElement('th');
        // thParam.classList.add('param_row');
        thParam.innerHTML = 'Param';
        headerTR.appendChild(thParam);

        var thMin = document.createElement('th');
        // thMin.classList.add('param_value');
        thMin.innerHTML = 'Min';
        headerTR.appendChild(thMin);

        var thMax = document.createElement('th');
        // thMax.classList.add('param_value');
        thMax.innerHTML = 'Max';
        headerTR.appendChild(thMax);

        var thDefault = document.createElement('th');
        // thDefault.classList.add('param_value');
        thDefault.innerHTML = 'Default';
        headerTR.appendChild(thDefault);

        var thDesc = document.createElement('th');
        thDesc.classList.add('param_description');
        thDesc.innerHTML = 'Description';
        headerTR.appendChild(thDesc);

        paramTable.appendChild(headerTR);    

        for (var i= 0; i < paramList.length; i++) {
            var paramTR = document.createElement('tr');

            var tdParam = document.createElement('td');
            // tdParam.classList.add('param_row');
            tdParam.innerHTML = i;
            paramTR.appendChild(tdParam);
    
            var tdMin = document.createElement('td');
            // tdMin.classList.add('param_value');
            tdMin.innerHTML = paramList[i][0];
            paramTR.appendChild(tdMin);
    
            var tdMax = document.createElement('td');
            // tdMax.classList.add('param_value');
            tdMax.innerHTML = paramList[i][1];
            paramTR.appendChild(tdMax);
    
            var tdDefault = document.createElement('td');
            // tdDefault.classList.add('param_value');
            tdDefault.innerHTML = paramList[i][2]; 
            paramTR.appendChild(tdDefault);
    
            var tdDesc = document.createElement('td');
            tdDesc.classList.add('param_description');
            tdDesc.innerHTML = paramList[i][3];
            paramTR.appendChild(tdDesc);
            
            var rowColor;
            if (i % 2) {
                rowColor = 'odd';
            }
            else {
                rowColor = 'even';
            }

            tdParam.classList.add(rowColor);
            tdMin.classList.add(rowColor);
            tdMax.classList.add(rowColor);
            tdDefault.classList.add(rowColor);
            tdDesc.classList.add(rowColor);

            paramTable.appendChild(paramTR);    

        }
        infoDiv.appendChild(paramTable);    
    }
    else {
        var noParam = document.createElement('p');
        noParam.classList.add('io');
        noParam.innerText = '(no parameters)';
        infoDiv.appendChild(noParam);
    }
    
    algoDiv.appendChild(infoDiv);
    listArea.appendChild(algoDiv);
}

function writeList() {
    if (currentDisplay == 'by number') {
        displayListByNumber()
    }
    else if (currentDisplay == 'by name') {
        displayListByName();
    }
    else if (currentDisplay == 'by category') {
        displayListByCategory();
    }
}

// ******************   Utility   ******************

function clearListArea() {
    while (listArea.firstChild) {
        listArea.removeChild(listArea.firstChild);
    }
}

function getJSON(url, success) {
    var request = new XMLHttpRequest();
    request.onload = function (event) {
        success(event.target.response);
    };
    request.open('GET', url, true);
    request.responseType = 'json';
    request.send();    
}

