var headerArea;
var menuButton;
var algorithmList;
var algorithmCharts;
var displaySelect;
var listArea;

var firstRun = true;
var showAll;
var showFavorites;
var displayByNumber;
var displayByName;
var displayByCategory;

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

var currentState;
var savedState = localStorage.savedState;
if (savedState === undefined) {
	currentState = {
		'show': 'all',
		'displayBy': 'by number',
		'openAlgorithms': [],
		'favorites': [],
	}
}
else {
	currentState = JSON.parse(savedState);
	firstRun = false;
}

window.onload = function() {
	headerArea = document.getElementById('header');
	menuButton = document.getElementById('menu_button');
	displaySelect = document.getElementById('display_select');
	listArea = document.getElementById('list');

	showAll = document.getElementById('show_all');
	showFavorites = document.getElementById('show_favorites');

	displayByNumber = document.getElementById('by_number');
	displayByName = document.getElementById('by_name');
	displayByCategory = document.getElementById('by_category');

	getJSON('algorithms.json', function(response) {
		algorithmList = response;

		for (var i = 0; i < algorithmList.length; i++) {
				nameIndex[algorithmList[i].name] = i;
				nameList[i] = algorithmList[i].name;
				categoryList[algorithmList[i].category].algorithms.push(i);
		}
		nameList.sort();

		getJSON('algorithms_charts.json', function(response) {
				algorithmCharts = response;
				writeList();
		});
	});

	menuButton.onclick = function () {
		if (!menuButton.classList.contains('open')) {
				menuButton.classList.add('open');
				headerArea.style.height = (document.getElementById('welcome_message').clientHeight + 130) + 'px';
		}
		else {
				menuButton.classList.remove('open');
				headerArea.style.height = 'var(--headerheight)';
		}
	};

	showAll.onclick = function() {
		currentState.show = 'all';
		writeList('show');
		saveState();
	};

	showFavorites.onclick = function() {
		currentState.show = 'favorites';
		writeList('show');
		saveState();
	};

	displayByNumber.onclick = function() {
		currentState.displayBy = 'by number';
		writeList('list by');
		saveState();
	};

	displayByName.onclick = function() {
		currentState.displayBy = 'by name';
		writeList('list by');
		saveState();
	};

	displayByCategory.onclick = function() {
		currentState.displayBy = 'by category';
		writeList('list by');
		saveState();
	};

	if (firstRun) {
		setTimeout(function() {
				menuButton.click();

		}, 2100);
	}
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
		var algorithms = categoryList[category].algorithms;

		var shouldShowCategory = true;
		if (currentState.show === 'favorites') {
				shouldShowCategory = false;
				for (var j = 0; j < algorithms.length; j++) {
					if (currentState.favorites.indexOf(algorithmList[algorithms[j]].algorithm) !== -1) {
						shouldShowCategory = true;
						break;
					}
				}
		}

		if (shouldShowCategory) {
				var categoryHeading = categoryList[category].heading;
				var categoryHeader = document.createElement('h2');

				if (categoryHeading) {
					categoryHeader.innerHTML = categoryList[category].heading + ' - ' + category;
				}
				else {
					categoryHeader.innerHTML = category;
				}
				listArea.appendChild(categoryHeader);

				for (var j = 0; j < algorithms.length; j++) {
					displayAlgorithm(algorithmList[algorithms[j]]);
				}

				var categorySeparator = document.createElement('div');
				categorySeparator.classList.add('category_separator');
				listArea.appendChild(categorySeparator);
		}

	}
}

function displayAlgorithm(info) {
	if (currentState.show === 'all' || currentState.favorites.indexOf(info.algorithm) !== -1) {
		var algoDiv = document.createElement('div');

		var headerName = info.algorithm + '_header';
		var titleName = info.algorithm + '_title';
		var infoName = info.algorithm + '_info';
		var videoImgName = info.algorithm + '_videolink';
		var favoritesButtonName = info.algorithm + '_favoritesbutton';

		// ********* Heading *********
		var algoHeader = document.createElement('div');
		algoHeader.id = headerName;
		algoHeader.classList.add('listing');

		// *** Title ***
		algoTitle = document.createElement('div');
		algoTitle.id = titleName;
		algoTitle.classList.add('pointy', 'title');
		algoTitle.innerHTML = '<h3>' + info.algorithm + ' ' + info.name + '</h3> ';
		algoTitle.onclick = function (event) {
				var infoDiv = document.getElementById(infoName);
				var headerDiv = document.getElementById(headerName);
				var videoIcon = document.getElementById(videoImgName);

				if (infoDiv.getAttribute('data-collapsed') === 'true') {
					infoDiv.style.height = (infoDiv.scrollHeight + 28) + 'px';
					headerDiv.classList.add('open');
					videoIcon.classList.remove('transparent');
					videoIcon.classList.add('pointy');
					infoDiv.setAttribute('data-collapsed', 'false');

					if (event.isTrusted) {
						currentState.openAlgorithms.push(info.algorithm);
						saveState();
					}
				}
				else {
					infoDiv.style.height = '0px';
					headerDiv.classList.remove('open');
					videoIcon.classList.add('transparent');
					videoIcon.classList.remove('pointy');
					infoDiv.setAttribute('data-collapsed', 'true');

					if (event.isTrusted) {
						var index = currentState.openAlgorithms.indexOf(info.algorithm);
						if (index > -1) {
								currentState.openAlgorithms.splice(index, 1);
						}
						saveState();
						}
				}
				return false;
		};
		algoHeader.appendChild(algoTitle);

		// *** Video Link Button ***
		var videoDiv = document.createElement('div');
		videoImg = document.createElement('img');
		videoImg.id = videoImgName;
		videoImg.setAttribute('src', 'youtube_icon.png')
		videoImg.classList.add('videoicon');
		videoImg.classList.add('transparent');
		videoImg.onclick = function() {
				var videoIcon = document.getElementById(videoImgName);
				console.log(videoIcon.classList);
				if (!videoIcon.classList.contains('transparent')) {
					window.open('https://www.youtube.com/watch?v=' + info.video, '_blank');
				}
		};
		videoDiv.appendChild(videoImg);
		algoHeader.appendChild(videoDiv);

		// *** Favorites Button ***
		var favoritesButton = document.createElement('div');
		favoritesButton.id = favoritesButtonName;
		favoritesButton.classList.add('heart');
		favoritesButton.classList.add('pointy');
		if (currentState.favorites.indexOf(info.algorithm) !== -1) {
				favoritesButton.classList.add('fav');
				// favoritesButton.innerHTML = '&#9829;';
		}
		else {
				// favoritesButton.classList.add('notfav');
				// favoritesButton.innerHTML = '&#9825;';
		}
		favoritesButton.onclick = function (event) {
				var index = currentState.favorites.indexOf(info.algorithm);
				if (index === -1) {
					currentState.favorites.push(info.algorithm);
					favoritesButton.classList.add('fav');
					saveState();
				}
				else {
					currentState.favorites.splice(index, 1);
					favoritesButton.classList.remove('fav');
					saveState();
					if (currentState.show === 'favorites') {
						algoHeader.parentElement.style.display = 'none';
					}
				}
		}
		algoHeader.appendChild(favoritesButton);

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
				thParam.innerHTML = 'Param';
				headerTR.appendChild(thParam);

				var thMin = document.createElement('th');
				thMin.innerHTML = 'Min';
				headerTR.appendChild(thMin);

				var thMax = document.createElement('th');
				thMax.innerHTML = 'Max';
				headerTR.appendChild(thMax);

				var thDefault = document.createElement('th');
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
					tdParam.innerHTML = i;
					paramTR.appendChild(tdParam);

					var tdMin = document.createElement('td');
					tdMin.innerHTML = paramList[i][0];
					paramTR.appendChild(tdMin);

					var tdMax = document.createElement('td');
					tdMax.innerHTML = paramList[i][1];
					paramTR.appendChild(tdMax);

					var tdDefault = document.createElement('td');
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

		// ********* Charts *********
		var charts = algorithmCharts[info.algorithm];
		if (charts) {
				for (var i = 0; i < charts.length; i++) {
					var chart = charts[i];
					var chartLabelH = document.createElement('h4');
					chartLabelH.innerHTML = chart.chartLabel + ':';
					infoDiv.appendChild(chartLabelH);

					var horizontalHeader = chart.horizontalHeader;
					var verticalHeader = chart.verticalHeader;
					var chartValues = chart.chartValues;

					var chartTable = document.createElement('table');
					var chartHeaderTR = document.createElement('tr');

					for (var j = 0; j < horizontalHeader.length; j++) {
						var th = document.createElement('th');
						th.innerHTML = horizontalHeader[j];
						chartHeaderTR.appendChild(th);
					}
					chartTable.appendChild(chartHeaderTR);

					var chartWidth = horizontalHeader.length;
					if (verticalHeader) {
						chartWidth--;
					}
					var rowColor;
					for (var j = 0; j < chartValues.length; j++) {
						var column = j % chartWidth;
						if (!column ) {
								if (rowColor === 'odd') {
									rowColor = 'even'
								}
								else {
									rowColor = 'odd'
								}                    var tr = document.createElement('tr');
								if (verticalHeader) {
									var th = document.createElement('th');
									th.innerHTML = verticalHeader[Math.floor(j / chartWidth)];
									tr.appendChild(th);
								}

						}

						var td = document.createElement('td');
						td.innerHTML = chartValues[j];
						td.classList.add(rowColor);
						if (chart.columnAlignment[column] === 'left') {
								td.classList.add('lefttext');
						}
						tr.appendChild(td);
						if (column === chartWidth - 1) {
								chartTable.appendChild(tr);
						}

					}
					infoDiv.appendChild(chartTable);

				}

		}
		algoDiv.appendChild(infoDiv);
		listArea.appendChild(algoDiv);
	}
}

function writeList(change) {
	listArea.classList.add('fade');

	if (change === 'list by') {
		displayByNumber.classList.remove('selected');
		displayByName.classList.remove('selected');
		displayByCategory.classList.remove('selected');
	}
	else if (change === 'show') {
		showAll.classList.remove('selected');
		showFavorites.classList.remove('selected');
	}

	setTimeout(function() {
		if (currentState.displayBy == 'by number') {
				displayListByNumber();
				displayByNumber.classList.add('selected');
		}
		else if (currentState.displayBy == 'by name') {
				displayListByName();
				displayByName.classList.add('selected');
		}
		else if (currentState.displayBy == 'by category') {
				displayListByCategory();
				displayByCategory.classList.add('selected');
		}
		for (var i = 0; i < currentState.openAlgorithms.length; i++) {
				var algorithmLink =  document.getElementById(currentState.openAlgorithms[i] + '_title');
				if (algorithmLink) {
					algorithmLink.click();
				}
		}
		if (currentState.show === 'all') {
				showAll.classList.add('selected');
		}
		else {
				showFavorites.classList.add('selected');
				var listings = document.getElementsByClassName('title');
				console.log(listings);
				if (!listings.length) {
					listArea.innerHTML = '<p class="no_favorites">No favorites to show. To add algorithms to this list, click the heart next to favorite algorithms in the <span id="no_favorites_list_all">Show: All</span> listing.';

					document.getElementById('no_favorites_list_all').onclick = function() {
						currentState.show = 'all';
						writeList('show');
						saveState();
					};
				}
		}
		listArea.classList.remove('fade')
	}, 250)

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

function saveState() {
	localStorage.setItem('savedState', JSON.stringify(currentState));
}

