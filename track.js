let geoLocationData = {
  latitude: '',
  longitude: '',
  timezone: '',
  cc: '',
  region_code: '',
  region: '',
  city: '',
  country: '',
  address: '',
};

const geoLocationAPI = async () => {
  try {
    const request = await fetch('https://ipinfo.io/json?token=6a70ff20596569');
    const { loc, timezone, abuse, region, city } = await request.json();
    const { country: CC, address } = abuse;

    const [latitude, longitude] = loc.split(',');

    const country = address.split(', ')[address.split(', ').length - 1];

    geoLocationData['latitude'] = latitude;
    geoLocationData['longitude'] = longitude;
    geoLocationData['timezone'] = timezone;
    geoLocationData['cc'] = CC;
    // geoLocationData['region_code'] =
    geoLocationData['region'] = region;
    geoLocationData['city'] = city;
    geoLocationData['country'] = country;
    geoLocationData['address'] = address;
  } catch (e) {
    console.log(e, 'Error');
  }
};
geoLocationAPI();

const submitForm = async () => {
  const full_name = document.querySelector('input[name="FNAME"]').value;
  const email = document.querySelector('input[name="EMAIL"]').value;

  const finalResponse = {
    email,
    full_name,
    date_time: optInTime(),
    ...geoLocationData,
  };

  sendEmail(finalResponse);
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

  return (formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`);
}
