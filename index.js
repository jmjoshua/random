var data = null;
var tabBody;
var containsCity = false;
var usingProvince = false;
var currentCountry = "US";

// First functions
sortByConfirmed();

// Fetch Data
function fetchData(sortBy, reverse) {
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === this.DONE) {
            const jsonDataString = this.responseText;
            const jsonData = JSON.parse(jsonDataString).data;
            var covidStats = jsonData.covid19Stats;

            // Filter out the "recovered" array element
            covidStats = covidStats.filter(stat => (stat.state !== "Recovered" && (stat.province !== "Recovered")));

            // Sort by selected sort string
            covidStats = covidStats.sort(dynamicSort(sortBy));
            if (reverse) { covidStats.reverse(); }

            // Set stateOrProvince
            usingProvince = covidStats[0].state == "" || covidStats[covidStats.length - 1].state == "";

            populateTable(covidStats);
        }
    });

    xhr.open("GET", "https://covid-19-coronavirus-statistics.p.rapidapi.com/v1/stats?country=" + currentCountry);
    xhr.setRequestHeader("x-rapidapi-host", "covid-19-coronavirus-statistics.p.rapidapi.com");
    xhr.setRequestHeader("x-rapidapi-key", "2f865679d3msh8d12b01bc987b18p1fd323jsnd5ec6e7da75f");

    xhr.send(data);
}

function populateTable(covidStats) {
    clearTable();

    // Enable city attribute if it exists
    if (covidStats[0].city !== "" || covidStats[covidStats.length - 1].city !== "") {
        containsCity = true;
    }
    else {
        // Remove the sort by city button
        removeSortByCity();
    }

    // Set the first row in the table
    if (!document.getElementsByClassName) return;
    tabBody=document.getElementsByClassName("statsTable").item(0);

    // Set header based on whether city exists
    var headerStringArray = ["State/Province", "Country", "Confirmed Cases", "Deaths"];
    if (containsCity) {
        headerStringArray.unshift("City");
    }
    addHeader(headerStringArray);
    
    covidStats.forEach(stat => {
        // Set each row for the data we receive
        addRow(stat);
    });
}

function clearTable() {
    if (!tabBody) return;
    tabBody.innerHTML = "";
}

function addHeader(titles) {
    row=document.createElement("tr");
    row.className = "headerRow";
    titles.forEach(headerTitle => {
        cell = document.createElement("td");
        textnode=document.createTextNode(headerTitle);
        cell.appendChild(textnode);
        row.appendChild(cell);
    });
    tabBody.appendChild(row);
}

function addRow(stat) {
    // console.log(stat);
    var stateOrProvince = usingProvince ? stat.state : stat.province;
    
    row=document.createElement("tr");
    const cellsArray = [stateOrProvince, stat.country, stat.confirmed, stat.deaths];

    // Add city string if this query returned cities
    if (containsCity) {
        cellsArray.unshift(stat.city);
    }

    cellsArray.forEach(cellString => {
        row.appendChild(cellForString(cellString));
    });
    tabBody.appendChild(row);
}

function cellForString(cellString) {
    cell = document.createElement("td");
    textnode=document.createTextNode(cellString);
    cell.appendChild(textnode);
    return cell;
}

// Sort By Functions
function removeSortByCity() {
    if (!document.getElementById('cityButton')) {
        // This button does not exist
        return;
    }

    var elem = document.getElementById('cityButton');
    elem.parentNode.removeChild(elem);
    return false;
}

// Button Functions
function switchCountries() {
    if (!document.getElementById('cityButton')) {
        // This button does not exist
        return;
    }

    var textBox = document.getElementById('countryInput');
    currentCountry = textBox.value;
    fetchData("confirmed", true);
}
function toggleTableVisible() {
    if (tabBody.style.display === "none") {
        tabBody.style.display = "block";
    }
    else {
        tabBody.style.display = "none";
    }
}
function sortByCity() {
    const category = "city";
    fetchData(category, false);
    updateSortByString(category);
}
function sortByState() {
    const category = usingProvince ? "state" : "province";
    fetchData(category, false);
    updateSortByString(category);
}
function sortByCountry() {
    const category = "country";
    fetchData(category, true);
    updateSortByString(category);
}
function sortByConfirmed() {
    const category = "confirmed";
    fetchData(category, true);
    updateSortByString(category);
}
function sortByDeaths() {
    const category = "deaths";
    fetchData(category, true);
    updateSortByString(category);
}

// UI Update
function updateSortByString(category) {
    if (!document.getElementsByClassName('sortByLabel').item(0)) {
        // This button does not exist
        return;
    }

    var sortByLabel = document.getElementsByClassName('sortByLabel').item(0);
    sortByLabel.innerHTML = "Sort By: " + category.bold();
}

// Helper Functions
function dynamicSort(property) {
    var sortOrder = 1;
    if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a,b) {
        /* next line works with strings and numbers, 
         * and you may want to customize it to your needs
         */
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
}