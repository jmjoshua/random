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

xhr.open("GET", "https://covid-19-coronavirus-statistics.p.rapidapi.com/v1/stats?country=US");
xhr.setRequestHeader("x-rapidapi-host", "covid-19-coronavirus-statistics.p.rapidapi.com");
xhr.setRequestHeader("x-rapidapi-key", "2f865679d3msh8d12b01bc987b18p1fd323jsnd5ec6e7da75f");

xhr.send(data);

function populateTable(covidStats) {
    covidStats.forEach(stat => {
        console.log(stat.province + ": " + stat.confirmed);
    });
}