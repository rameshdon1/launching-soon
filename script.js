// Validate form and show notification
const body = document.body;
const overlay = document.getElementById('overlay');
const overlayLayer = document.getElementById('overlay-layer');

const mailchimpuserdata = {
  email_address: '',
  full_name: [],
  status: 'subscribed',
  email_type: 'html',
  language: navigator.language.split('-')[0] ?? '',
  location: {
    latitude: '',
    longitude: '',
  },
  ip_signup: '',
  timestamp_signup: '',
  ip_opt: '',
  timestamp_opt: '',

  //spreadsheet specific data here
  timezone: '',
  cc: '',
  region_code: '',
  region: '',
  city: '',
  country: '',
  address: '',
};

fetch('https://api.ipify.org?format=json')
  .then((response) => response.json())
  .then((data) => {
    const ipAddress = data.ip;
    mailchimpuserdata.ip_signup = ipAddress;
    mailchimpuserdata.ip_opt = ipAddress;
  })
  .catch((error) => console.error(error));

const menuIcon = document.getElementById('hamburger');
menuIcon.addEventListener('click', () => {
  menuIcon.classList.toggle('active');
  menuIcon.classList.toggle('not-active');
});

const emailForm = document.getElementById('email-form');

emailForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = new FormData(emailForm);
  const formObjectData = Object.fromEntries(formData.entries());

  mailchimpuserdata['email_address'] = formObjectData['EMAIL'];
  mailchimpuserdata['full_name'] = splitString(formObjectData['FNAME']);
  mailchimpuserdata['timestamp_signup'] = new Date(Date.now())
    .toISOString()
    .replace(/\.\d{3}Z$/, 'Z');
  mailchimpuserdata['timestamp_opt'] = new Date(Date.now())
    .toISOString()
    .replace(/\.\d{3}Z$/, 'Z');

  //NEXTJS project as api www.samratdhital.com.np
  fetch('http://localhost:3000/email-subscription', {
    method: 'POST',
    body: JSON.stringify(mailchimpuserdata),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  //spreadsheet api 👇👇
  // await submitForm(formObjectData);

  //toggle overflow from body and unhide overlay and the background
  body.classList.toggle('overflow-hidden');
  overlay.classList.toggle('hidden');
  overlayLayer.classList.toggle('hidden');
});

overlayLayer.addEventListener('click', (event) => {
  body.classList.toggle('overflow-hidden');

  overlay.classList.toggle('hidden');
  overlayLayer.classList.toggle('hidden');
});

//TODO: sidebar menu on mobile screen
//select a sidebar element
const mobileMenu = document.getElementById('mobile-menu');
const hamburgerIcon = document.getElementById('hamburger');
hamburgerIcon.addEventListener('click', () => {
  mobileMenu.classList.toggle('translate-x-0');
  body.classList.toggle('overflow-hidden');
});

// Get the user's location using the Geolocation API
function getLocation() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        resolve({ latitude, longitude });
      },
      (error) => {
        reject(error);
      }
    );
  });
}

// Fetch the location data from the "https://ipapi.co/json" API
function fetchLocationData() {
  return fetch('https://ipapi.co/json')
    .then((response) => response.json())
    .then((data) => {
      const latitude = data.latitude;
      const longitude = data.longitude;

      //spreadsheet specific data here
      mailchimpuserdata.timezone = data.timezone ?? '';
      mailchimpuserdata.cc = data.country ?? '';
      mailchimpuserdata.region_code = data.region ?? '';
      mailchimpuserdata.region = data.region_name ?? '';
      mailchimpuserdata.city = data.city ?? '';
      mailchimpuserdata.country = data.country_name ?? '';
      mailchimpuserdata.address = data.city ?? '';

      return { latitude, longitude };
    });
}

// Get the user's location
async function getUserLocation() {
  const { latitude: ipLatitude, longitude: ipLongitude } =
    await fetchLocationData();
  try {
    const { latitude: gpsLatitude, longitude: gpsLongitude } =
      await getLocation();
    console.log('I am returning gps data', gpsLatitude, gpsLongitude);
    return { latitude: gpsLatitude, longitude: gpsLongitude };
  } catch (e) {
    console.log(e, 'I think gps permission is off');
  }
  console.log('I am returning ipDATA');
  return { latitude: ipLatitude, longitude: ipLongitude };
}

// Use the user's location to do something
getUserLocation().then(({ latitude, longitude }) => {
  mailchimpuserdata.location = {
    latitude,
    longitude,
  };
});

function splitString(a) {
  const splitArray = a.split(' ');
  const first = splitArray[0];
  const rest = splitArray.length > 1 ? splitArray.slice(1).join(' ') : '';
  return [first, rest];
}
