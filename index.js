var data = null;

var xhr = new XMLHttpRequest();
xhr.withCredentials = true;

xhr.addEventListener("readystatechange", function () {
	if (this.readyState === this.DONE) {
        const jsonDataString = this.responseText;
        const jsonData = JSON.parse(jsonDataString).data;
        const covidStats = jsonData.covid19Stats;
        populateTable(covidStats)
	}
});

xhr.open("GET", "https://covid-19-coronavirus-statistics.p.rapidapi.com/v1/stats?country=Canada");
xhr.setRequestHeader("x-rapidapi-host", "covid-19-coronavirus-statistics.p.rapidapi.com");
xhr.setRequestHeader("x-rapidapi-key", "2f865679d3msh8d12b01bc987b18p1fd323jsnd5ec6e7da75f");

xhr.send(data);

var tabBody;

function populateTable(covidStats) {
    // Set the first row in the table
    if (!document.getElementsByClassName) return;
    tabBody=document.getElementsByClassName("statsTable").item(0);

    addHeader(["City", "State", "Country", "Confirmed Cases", "Deaths", "Recovered"]);

    covidStats.forEach(stat => {
        // Set each row for the data we receive
        addRow(stat);
    });
}

function addHeader(titles) {
    row=document.createElement("tr");
    titles.forEach(headerTitle => {
        cell = document.createElement("td");
        textnode=document.createTextNode(headerTitle);
        cell.appendChild(textnode);
        row.appendChild(cell);
    });
    tabBody.appendChild(row);
}

function addRow(stat) {
    console.log(stat.city);
    
    row=document.createElement("tr");
    cell = document.createElement("td");
    textnode=document.createTextNode(stat.city);
    cell.appendChild(textnode);
    row.appendChild(cell);
    tabBody.appendChild(row);
}