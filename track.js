const submitForm = async () => {
  const full_name = document.querySelector('input[name="FNAME"]').value;
  const email = document.querySelector('input[name="EMAIL"]').value;

  const finalResponse = {
    email,
    full_name,
    date_time: optInTime(),
    latitude: '',
    longitude: '',
    timezone: '',
    cc: '',
    region_code: '',
    region: '',
    city: '',
    country: '',
  };

  await fetch('http://ip-api.com/json/')
    .then((data) => {
      if (!data.status === 'success') {
        throw new Error('Geo Ip Error');
      }
      return data.json();
    })
    .then((geoIp) => {
      finalResponse['latitude'] = geoIp.lat;
      finalResponse['longitude'] = geoIp.lon;
      finalResponse['timezone'] = geoIp.timezone;
      finalResponse['cc'] = geoIp.countryCode;
      finalResponse['region_code'] = geoIp.region;
      finalResponse['region'] = geoIp.regionName;
      finalResponse['city'] = geoIp.city;
      finalResponse['country'] = geoIp.country;
    })
    .finally(() => sendEmail(finalResponse));
};

function sendEmail(data) {
  return fetch('https://kind-jade-chipmunk-suit.cyclic.app/email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
}

function optInTime() {
  const currentDate = new Date();
  const month = currentDate.getMonth() + 1;
  const day = currentDate.getDate();
  const year = currentDate.getFullYear();
  const hours = currentDate.getHours();
  const minutes = currentDate.getMinutes();
  const seconds = currentDate.getSeconds();

  return (formattedDate =
    month +
    '/' +
    day +
    '/' +
    year +
    ' ' +
    hours +
    ':' +
    minutes +
    ':' +
    seconds);
}
