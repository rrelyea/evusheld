import reportWebVitals from './reportWebVitals';
import Papa from 'papaparse';
import React from 'react';
import ReactDOM from 'react-dom'
import MapChart from "./MapChart";
import allStates from "./data/allstates.json";
import DoseViewer from './DoseViewer.js'

const styles = {
  countyCity: {
    fontSize: '14pt'
  },
  providerTable: {
    marginLeft: '10px',
    marginTop: '30px',
    marginBottom: '30px',
    margin: '0 auto',
  },
  doseCount: {
    fontSize: '14pt',
    verticalAlign: 'bottom'
  },
  doseLabel: {
    verticalAlign: 'top',
  },
  mediumFont: {
    fontSize: '14pt'
  },  
  smallerFont: {
    fontSize: '10pt'
  },
  eightPointFont: {
    fontSize: '8pt'
  },
  tinyFont: {
    fontSize: '5pt'
  },  
  chooseState: {
    fontSize: '18pt'
  },
  mapDiv: {
    margin: '0 auto',
    height: '250px',
    width: '350px',
  },
  centered: {
    textAlign: 'center',
  },
  td: {
    width: 'auto',
    verticalAlign: 'top',
    wordWrap: 'break-word',
  },
  tdProvider: {
    width: '1%',
    whiteSpace: 'nowrap',
    verticalAlign: 'top',
    wordWrap: 'break-word',
  },
  // table color theme started with primary color of #f1ec90 and used https://material.io/design/color/the-color-system.html#tools-for-picking-colors
  th: {
    position: 'sticky',
    backgroundColor: '#9095f1',
    top: '0px',
    zIndex: 2,
    fontSize: '20px'
  },
  odd: {
    background: 'white',
  },
  even: {
    background: '#f1ec90',
  },
  stateInfo: {
    backgroundColor: '#f1bb90',
    textAlign: 'left',
    paddingLeft: '10px',
  },
  infoLabels: {
    backgroundColor: '#f1bb90',
    textAlign: 'right',
    paddingRight: '10px',
  },
  totals: {
    lineHeight: '60px',
    padding: '0 0',
    backgroundColor: '#f1bb90',
  },
}

var stateFilter = null;
var countyFilter = null;
var cityFilter = null;
var zipFilter = null;
var providerFilter = null;
var daysnotreported_filter = "";

function toTitleCase(str) {
  return str.toLowerCase().split(' ').map(function (word) {
    return (word.charAt(0).toUpperCase() + word.slice(1));
  }).join(' ');
}

function toNumber(str) {
  if (str.trim() === "") {
    return "--";
  }
  else
  {
    return parseFloat(str).toFixed(0);
  }
}

function GetStateDetails(states, providers) {
  const StateDetails = states.map((state,index) => {
    return GetProviderDetails(state, index, providers);
  })
  if (stateFilter !== null || zipFilter !== null || providerFilter !== null || cityFilter != null || countyFilter !== null)
  {
    return (
      <table style={styles.providerTable}>
        <thead>
        <tr>
          <th style={styles.th}>State - County - City</th>
          <th style={styles.th}>Provider</th>
          <th style={styles.th}>Inventory</th>
        </tr>
        </thead>
        {StateDetails}
      </table>);
  }
  else
  {
    return <div></div>
  }
}

function toDate(str) {
  if (str.trim() === "") {
    return "--";
  }
  else
  {
    var dateString = (new Date(str)).toDateString();
    var dateLength = dateString.length;
    return dateString.substring(0, dateLength - 5);
  }
}

function SwapKeyword(url, keyword) {
  return url.replace("KEYWORD", keyword)
}

function GetProviderDetails(state, index, providers) {
  if (state[3].trim() === "") return null;

  var remainingTotals = 0;
  var orderedTotals = 0;
  var providerCountTotals = 0;
  var firstLink = 0;
  var d = new Date();
  if (daysnotreported_filter !== "") d.setDate(d.getDate() - toNumber(daysnotreported_filter));

  var state_code = state[3] !== null ? state[3].trim() : state[3];

  var header = state.length > 1 && state[2] != null && state[2].trim() !== "state" ?
    <tr>
      <td style={styles.infoLabels}>
        {state[2]} Health Dept Links:
      </td>
      <td style={styles.stateInfo} colSpan='2'>
        <span>{state[7] !== "" ? <span>&nbsp;{firstLink++ === 0?"":"|"} <a href={'https://'+SwapKeyword(state[7],'Evusheld')}>'Evusheld' search</a></span> : false }</span>
        <span>{state[8] !== ""? <span>&nbsp;{firstLink++ === 0?"":"|"} <a href={'https://'+state[8]}>Covid Info</a></span> : false }</span>
        <span>{state[0] !== "" ? <span>&nbsp;{firstLink++ === 0?"":"|"} <a href={"https://"+state[0]}>{state[0]}</a></span> : false }</span>
        <span>{state[5] !== "" ? <span><span> | </span><a href={"mailto:"+state[5]}>{state[5]}</a></span> : ""}</span>  
        <span>{state[6] !== "" ? " | " + state[6] : ""}</span> 
        <span>{state[4] !== "" ? <span> | <a href={"https://twitter.com/"+state[4]}>{'@'+state[4]}</a></span> : false } </span> 
      </td>
    </tr>
    : false;

  var lastCity = "";
  var lastCounty = "";
  var lastState = "";
  var lastCityStyle = null;
  var cityMarkup = null;
  var providerList = providers.map((provider, index) => {
    // ignore blank lines in provider file
    if (provider.length === 1) 
    {
      return false;
    }

    const provider_state = provider[5].trim();
    var provider_x = null;
    var county = provider[4] !== null ? provider[4].trim() : provider[4];
    var city = provider[3] !== null ? provider[3].trim() : provider[3];
    var d2 = null;
    if (provider[13] !== "" && provider[10] !== "") { // no reported date, but did get delivery
      d2 = new Date(provider[10]);
    }

    if (provider_state === state_code &&
          (daysnotreported_filter === ""
            || d > new Date(provider[13])
            || (provider[13] === "" && provider[10] !== "" && d > d2)
            )
       ) { 
      
      if ((stateFilter === null || stateFilter === state_code) 
         && (zipFilter === null || zipFilter === provider[6].substring(0,5))
         && (countyFilter === null || countyFilter === county.toUpperCase())
         && (cityFilter === null || cityFilter === city.toUpperCase())
         ) {
          
          var providerUpper = provider[0].replaceAll('-',' ').toUpperCase();
          provider_x = toTitleCase(provider[0]);
          if (providerFilter === null || providerUpper.includes(providerFilter) ) {
            var linkToProvider = "?zip=" + provider[6].substring(0,5) + "&provider=" + provider_x.replaceAll(' ', '-');
            var linkToState = "?state=" + state_code;
            var zipCode = provider[6].substring(0,5);
            var linkToZip = linkToState + "&zip=" + zipCode;
            var linkToCounty = linkToState + "&county=" + county;
            var linkToCity = linkToState + "&city=" + city;
            var firstRowOfCity = lastCity !== toTitleCase(city) || lastCounty !== county || lastState !== state_code;
            if (firstRowOfCity) {
              lastCity = toTitleCase(city); 
              lastState = state_code;
              lastCounty = county;
              cityMarkup = 
              <div style={styles.countyCity}>
                <a href={linkToState}>{state_code}</a> - <a href={linkToCounty}>{toTitleCase(county)}</a> - <a href={linkToCity}>{toTitleCase(city)}</a>
              </div>;
              lastCityStyle = lastCityStyle === styles.odd ? styles.even : styles.odd;
            } else {
              cityMarkup = null;
            }
            var remaining = toNumber(provider[12]);
            var ordered = toNumber(provider[11]);
            var npi = provider[15].trim() === "" ? "" : "NPI# " + parseInt(provider[15]);
            remainingTotals += remaining === "--" ? 0 : parseInt(remaining);
            orderedTotals += ordered === "--" ? 0 : parseInt(ordered);
            providerCountTotals += 1;

            return <><tr key={state_code+"-"+index.toString()} style={lastCityStyle}>
              <td style={styles.td}>
                {cityMarkup}
              </td>
              <td style={styles.tdProvider}>
                <div style={styles.mediumFont}>{provider_x}</div>
                <div>{provider[1]}</div>
                <div>{provider[2]}</div>
                <div>{provider[6]}</div>
                <div>{npi}</div>
                <div style={styles.smallerFont}>{zipFilter === null && providerFilter === null ? <a href={linkToProvider}>Inventory details</a> : false }</div>
                <div style={styles.tinyFont}>&nbsp;</div>
              </td>
              <td style={styles.td}>
                { zipFilter !== null && providerFilter !== null ? (<>
                  <div><span style={styles.doseCount}>{remaining}</span> <span style={styles.doseLabel}> avail @{toDate(provider[13])}</span></div>
                  <div><span style={styles.doseCount}>{ordered}</span> <span style={styles.doseLabel}> allotted @{toDate(provider[9])}</span></div>
                  <div>&nbsp;&nbsp;&nbsp;&nbsp;Last delivery: {toDate(provider[10])}</div>
                  <div style={styles.tinyFont}>&nbsp;</div>
                </>) :
                (
                <>
                <a href={linkToProvider}>
                  <DoseViewer zipCode={zipCode} provider={providerUpper} mini='true' available={remaining} allotted={ordered} />
                </a>
                </>
                )}
              </td>
            </tr>
            {zipFilter !== null && providerFilter !== null ?
              <tr style={lastCityStyle}>
                <td colSpan='3'>
                  <DoseViewer zipCode={zipFilter} provider={providerUpper} />
                </td>
              </tr>
              :false
            }
            </>
          
        }
      }
    }
  });

  var footer = state.length > 1 && state[2] != null && state[2].trim() !== "state" ?
  <tr style={styles.totals}>
    <td style={styles.totals}>{cityFilter !== null ? "City":(countyFilter !== null?"County":(zipFilter!=null?"Zip":(stateFilter != null ? "State":"")))} Totals:</td>
    <td style={styles.doseCount}>{providerCountTotals} providers</td>
    <td style={styles.doseCount}>{remainingTotals + " / " + orderedTotals}</td>
  </tr>
  : false;

  return <tbody>
       { stateFilter !== null && state_code === stateFilter ? header : false }
       { providerList }
       { (stateFilter !== null && state_code===stateFilter) && (zipFilter !== null || countyFilter !== null || cityFilter !== null | stateFilter !== null) ? footer : false}
       </tbody>
}

function navigateToState(state) {
  const params = new URLSearchParams(window.location.search);
  if (state !== "ChooseState") { params.set('state', state) } else if (params.has('state')) params.delete('state');
  if (params.has('county')) params.delete('county');
  if (params.has('city')) params.delete('city');
  if (params.has('zip')) params.delete('zip');
  if (params.has('provider')) params.delete('provider');

  window.history.replaceState({}, "Evusheld (" + state + ")", `${window.location.pathname}?${params.toString()}`);
  renderPage(states, evusheldSites, dataUpdates);
}

function showAllProviders(e) {
  const params = new URLSearchParams(window.location.search);
  if (params.has('daysnotreported')) params.delete('daysnotreported');
  window.history.replaceState({}, "Evusheld", `${window.location.pathname}?${params.toString()}`);
  daysnotreported_filter = "";
  renderPage(states, evusheldSites, dataUpdates);
}

function ShowdaysnotreportedBanner(days) {
  if (days !== "") {
    return <>Showing only those providers who have NOT reported their inventory to HHS in {days} or more days <button onClick={(e)=>showAllProviders(e)}>show all</button></>
  }
}

function renderPage(states, evusheldSites, dataUpdates) {
  const handleChange = (e) => {
    navigateToState(e.target.value);
  }
  const mapClick = (e) => {
    var element = e.target;
    var state_code = null;
    if (element.tagName === "text")
    {
      state_code = element.innerHTML;
    }
    else if (element.tagName === "path")
    {
      var parent = element.parentElement;
      var index = Array.from(parent.children).indexOf(element);
      const cur = allStates.find(s => s.index === index);
      state_code = cur.id;
    }

    var chooseState = document.getElementById('chooseState');

    if (state_code !== null) {
      chooseState.value = state_code;
      navigateToState(state_code);  
    }
    else
    {
      chooseState.value = "ChooseState";
      navigateToState("");
    }
  }

  if (states != null && evusheldSites != null)
  {
    var urlParams = new URLSearchParams(window.location.search);

    stateFilter = urlParams.has('state') ? urlParams.get('state').toUpperCase() : null;
    countyFilter = urlParams.has('county') ? urlParams.get('county').toUpperCase() : null;
    cityFilter = urlParams.has('city') ? urlParams.get('city').toUpperCase() : null;
    zipFilter = urlParams.has('zip') ? urlParams.get('zip') : null;
    providerFilter = urlParams.has('provider') ? urlParams.get('provider').toUpperCase().replaceAll('-',' ') : null;

    if (zipFilter !== null && providerFilter !== null) {
      document.title = toTitleCase(providerFilter);
    } else {
      if (stateFilter !== null && countyFilter !== null) document.title = stateFilter + "/" + toTitleCase(countyFilter) + " Evusheld";
      else if (stateFilter !== null && cityFilter !== null) document.title = stateFilter + "/" + toTitleCase(cityFilter) + " Evusheld";
      else if (stateFilter !== null) document.title = stateFilter + " Evusheld";
      else document.title = "Evusheld";
    }

    if (urlParams.has('daysnotreported')) {
      daysnotreported_filter = urlParams.get('daysnotreported');
    }

    var dataUpdated = new Date(dataUpdates.data[0][0]);
    var dataUpdatedLocalString = dataUpdated.toLocaleString('en-US', { weekday: 'short', month: 'numeric', day:'numeric', hour:'numeric', minute:'numeric', timeZoneName: 'short' });

    var page = 
      <div>
        <div style={styles.centered}>
          {zipFilter === null && providerFilter === null ?
          <>
          <label style={styles.chooseState} htmlFor='chooseState'>Evusheld order/inventory info for:&nbsp;</label>
          <select style={styles.mediumFont} id='chooseState' value={stateFilter !== null ? stateFilter.toUpperCase() : ""} onChange={(e) => handleChange(e)}>
            <option value="ChooseState">Choose State</option>
            {states.data.map((state,index) => 
              <option key={index} value={index > 0 ? state[3].trim(): "ALL"}>{index > 0 ? state[2].trim() + " (" + state[3].trim() + ")" : "All States & Territories"}</option>
            )} 
          </select>
          <div style={styles.smallerFont}>
            [Data harvested from <a href="https://healthdata.gov/Health/COVID-19-Public-Therapeutic-Locator/rxn6-qnx8">healthdata.gov</a>, which last updated: {dataUpdatedLocalString}]
          </div>
            <div onClick={mapClick} style={styles.mapDiv}>
              <MapChart id='mapChart' />
            </div>
          <div style={styles.smallerFont}>
            ( or view same data in <a href="https://covid-19-therapeutics-locator-dhhs.hub.arcgis.com/">a searchable map (HHS)</a>, <a href="https://1drv.ms/x/s!AhC1RgsYG5Ltv55eBLmCP2tJomHPFQ?e=XbsTzD"> Microsoft Excel</a>, <a href="https://docs.google.com/spreadsheets/d/14jiaYK5wzTWQ6o_dZogQjoOMWZopamrfAlWLBKWocLs/edit?usp=sharing">Google Sheets</a>, <a href="https://raw.githubusercontent.com/rrelyea/evusheld-locations-history/main/evusheld-data.csv">CSV File</a>, or <a href="https://healthdata.gov/Health/COVID-19-Public-Therapeutic-Locator/rxn6-qnx8/data">healthdata.gov</a> )
          </div>
          </>
          : false }
          <div>
            {
              ShowdaysnotreportedBanner(daysnotreported_filter)
            }
          </div>
          <div style={styles.smallerFont}>&nbsp;</div>
          <div>
            { 
              GetStateDetails(states.data, evusheldSites.data)
            }
          </div>
          <div style={styles.smallerFont}>&nbsp;</div>
          <div style={styles.smallerFont}>
            Contact: <a href="https://twitter.com/rrelyea">@rrelyea</a> or <a href="mailto:rob@relyeas.net">rob@relyeas.net</a> | 
            Github repo for <a href="https://github.com/rrelyea/evusheld">this site</a> and <a href="https://github.com/rrelyea/evusheld-locations-history">data fetching</a> |
            Treament locators: <a href="https://rrelyea.github.io/sotrovimab">sotrovimab</a> and <a href="https://rrelyea.github.io/paxlovid">paxlovid</a>
          </div>
        </div>
      </div>
      
    ReactDOM.render(page, document.getElementById('root'));
  }
}

var evusheldSites = null;
Papa.parse("https://raw.githubusercontent.com/rrelyea/evusheld-locations-history/main/evusheld-data.csv", {
  download: true,
  complete: function(evusheldResults) {
    evusheldSites = evusheldResults;
    renderPage(states, evusheldSites, dataUpdates);
  }
});

var states = null;
var baseUri = "https://raw.githubusercontent.com/rrelyea/evusheld-locations-history/main/";

var currentTime = new Date();
var urlSuffix = currentTime.getMinutes() + "-" + currentTime.getSeconds();
Papa.parse(baseUri + "state-health-departments.csv?"+urlSuffix, {
  download: true,
  complete: function(stateResults) {
    states = stateResults;
    renderPage(states, evusheldSites, dataUpdates);
  }
});

var dataUpdates = null;
Papa.parse(baseUri + "data/evusheld-data-updates.log", {
  download: true,
  complete: function(updates) {
    dataUpdates = updates;
    renderPage(states, evusheldSites, dataUpdates);
  }
});

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
