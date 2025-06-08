async function getCountryInfo() {
  const country = document.getElementById("countryInput").value;
  const response = await fetch(`https://restcountries.com/v3.1/name/${country}`);
  const data = await response.json();

  const countryData = data[0]; // ilk ülkeyi al

  const name = countryData.name.common;
  const capital = countryData.capital?.[0] || "Yok";
  const population = countryData.population.toLocaleString();
  const region = countryData.region;
  const flag = countryData.flags.png;
  const latlng = countryData.latlng;
  const language = Object.values(countryData.languages)[0];
  const currency = Object.values(countryData.currencies)[0];

  const infoHTML = `
    <h2>${name} (${capital})</h2>
    <img src="${flag}" width="100" alt="Flag of ${name}" />
    <p><strong>Nüfus:</strong> ${population}</p>
    <p><strong>Bölge:</strong> ${region}</p>
    <p><strong>Dil:</strong> ${language}</p>
    <p><strong>Para Birimi:</strong> ${currency.name} (${currency.symbol})</p>
    <p><strong>Koordinatlar:</strong> ${latlng[0]}, ${latlng[1]}</p>
  `;

  document.getElementById("infoBox").innerHTML = infoHTML;

  // JSON-LD verisini sayfaya ekle
  addJSONLD(countryData);
}

function addJSONLD(countryData) {
  const jsonLD = {
    "@context": "https://schema.org",
    "@type": "Country",
    "name": countryData.name.common,
    "alternateName": countryData.name.official,
    "capital": countryData.capital ? countryData.capital[0] : "",
    "population": countryData.population,
    "location": {
      "@type": "Place",
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": countryData.latlng[0],
        "longitude": countryData.latlng[1]
      }
    },
    "flag": countryData.flags.png,
    "currency": {
      "@type": "Currency",
      "name": Object.values(countryData.currencies)[0].name,
      "symbol": Object.values(countryData.currencies)[0].symbol
    },
    "language": {
      "@type": "Language",
      "name": Object.values(countryData.languages)[0]
    }
  };

  // Önce varsa önceki JSON-LD script tag'ini kaldır
  const existingScript = document.getElementById('json-ld-script');
  if (existingScript) {
    existingScript.remove();
  }

  // Yeni script etiketi oluştur
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.id = 'json-ld-script';
  script.text = JSON.stringify(jsonLD);

  // <head> içine ekle
  document.head.appendChild(script);
}

