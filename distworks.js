var algorithmList;
var displayMenuArea;
var displaySelect;
var backButtonArea;
var listArea;

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
    'LFO', 
    'Randomness & Patterns', 
    'Envelopes & VCA', 
    'Quantizers', 
    'CV Processing', 
    'MIDI & External Control', 
    'Utility'
];

var currentDisplay = 'by number';

window.onload = function() {
    displayMenuArea = document.getElementById('display_menu');
    backButtonArea = document.getElementById('back_button');
    displaySelect = document.getElementById('display_select');
    listArea = document.getElementById('list');

    displaySelect.oninput = function() {
        currentDisplay = displaySelect.value;
        writeList();
    };
    backButtonArea.onclick = function() {
        writeList();
    }

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

function displayAllByNumber() {
    clearListArea();
    showCategoryMenu();
    for (var i = 0; i < algorithmList.length; i++) {
        displayAlgorithm(algorithmList[i]);
    }
}

function displayListByNumber() {
    clearListArea();
    showCategoryMenu();
    for (var i = 0; i < algorithmList.length; i++) {
        var algorithm = algorithmList[i];
        // displayName(algorithm);
        displayAlgorithm(algorithm);
        document.getElementById(algorithm.algorithm + '_info').classList.add('hide');
    }
}

function displayListByName() {
    clearListArea();
    showCategoryMenu();
    for (var i = 0; i < nameList.length; i++) {        
        displayName(algorithmList[nameIndex[nameList[i]]]);
    }
}

function displayListByCategory() {
    clearListArea();
    showCategoryMenu();
    for (var i = 0; i < categoryOrder.length; i++) {
        var category = categoryOrder[i];
        var categoryHeading = categoryList[category].heading;
        
        var categoryHeader = document.createElement('h3');
        if (categoryHeading) {
            categoryHeader.innerHTML = categoryList[category].heading + ' - ' + category;
        }
        else {
            categoryHeader.innerHTML = category;
        }
        listArea.appendChild(categoryHeader);

        var algorithms = categoryList[category].algorithms;
        for (var j = 0; j < algorithms.length; j++) {
            displayName(algorithmList[algorithms[j]]);
        }
    }
}


function displayAlgorithm(info) {
    var algoDiv = document.createElement('div');
    // algoDiv.id = info.algorithm + '_info';
    // algoDiv.classList.add('alfo_info');

    var infoName = info.algorithm + '_info';
    var headerName = info.algorithm + '_header';
    var videoLinkName = info.algorithm + '_videolink';

    // ********* Heading *********
    var algoHeader = document.createElement('h3');
    algoHeader.id = headerName;
    algoHeader.classList.add('listing');
    algoTitle = document.createElement('span');
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

    var videoLink = document.createElement('a');
    videoLink.id = videoLinkName;
    videoLink.classList.add('videolink');
    videoLink.classList.add('transparent');
    videoLink.setAttribute('href', 'https://www.youtube.com/watch?v=' + info.video);
    videoLink.setAttribute('target', '_blank');
    // videoLink.innerHTML = '( <span class="videoarrow">&#x25ba;</span> )';
    videoLink.innerHTML = '<img src="yt_icon_rgb.png" class="videoicon">';
    algoHeader.appendChild(videoLink);
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

function displayName(info, index) {
    var listDiv = document.createElement('div');
    var infoName = info.algorithm + '_info';
    var nameText = info.algorithm + '_name';
    listDiv.id = nameText;

    listDiv.classList.add('list_items');

    var nameLink = document.createElement('a');
    nameLink.setAttribute('href', 'sfdafsdfa');
    nameLink.innerHTML = info.algorithm + ' ' + info.name + '<br>';
    nameLink.onclick = function () { 
        document.getElementById(infoName).classList.remove('hide');
        document.getElementById(nameText).classList.add('hide');
        // clearListArea();
        // hideCategoryMenu();
        // displayAlgorithm(info);
        return false;
    }; 

    listDiv.appendChild(nameLink);

    listArea.appendChild(listDiv);
}

function hideCategoryMenu() {
    displayMenuArea.classList.add('hide');
    backButtonArea.classList.remove('hide');
}

function showCategoryMenu() {
    displayMenuArea.classList.remove('hide');
    backButtonArea.classList.add('hide');
}

function writeList() {
    if (currentDisplay == 'show all') {
        displayAllByNumber();        
    }
    else if (currentDisplay == 'by number') {
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

function collapseSection(element) {
    // get the height of the element's inner content, regardless of its actual size
    var sectionHeight = element.scrollHeight;
    
    // temporarily disable all css transitions
    var elementTransition = element.style.transition;
    element.style.transition = '';
    
    // on the next frame (as soon as the previous style change has taken effect),
    // explicitly set the element's height to its current pixel height, so we 
    // aren't transitioning out of 'auto'
    requestAnimationFrame(function() {
      element.style.height = sectionHeight + 'px';
      element.style.transition = elementTransition;
      
      // on the next frame (as soon as the previous style change has taken effect),
      // have the element transition to height: 0
      requestAnimationFrame(function() {
        element.style.height = 0 + 'px';
      });
    });
    
    // mark the section as "currently collapsed"
    element.setAttribute('data-collapsed', 'true');
  }
  
  function expandSection(element) {
    // get the height of the element's inner content, regardless of its actual size
    var sectionHeight = element.scrollHeight;
    
    // have the element transition to the height of its inner content
    element.style.height = sectionHeight + 'px';
  
    // when the next css transition finishes (which should be the one we just triggered)
    element.addEventListener('transitionend', function(e) {
      // remove this event listener so it only gets triggered once
      element.removeEventListener('transitionend', arguments.callee);
      
      // remove "height" from the element's inline styles, so it can return to its initial value
      element.style.height = null;
    });
    
    // mark the section as "currently not collapsed"
    element.setAttribute('data-collapsed', 'false');
  }

