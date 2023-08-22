const body = document.body;
const thankyouModal = document.getElementById('thank-you');
const thankyouBackdrop = document.getElementById('thank-you-backdrop');

const menuIcon = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');

const emailForm = document.getElementById('email-form');

const formLoader = document.getElementById('form-loader');

const submitBtn = document.getElementById('submit-btn');

const thankyouClose = document.getElementById('thank-you-close');

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

//TODO: sidebar menu on mobile screen
menuIcon.addEventListener('click', () => {
  menuIcon.classList.toggle('active');
  menuIcon.classList.toggle('not-active');
  mobileMenu.classList.toggle('translate-x-0');
  body.classList.toggle('overflow-hidden');
});

let formSubmitted = false;
let successfulRequest = false;
let previousName = '';
let previousEmail = '';

emailForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = new FormData(emailForm);
  const formObjectData = Object.fromEntries(formData.entries());
  console.log(formSubmitted);

  if (
    !successfulRequest ||
    previousName !== formObjectData['FNAME'] ||
    (previousEmail !== formObjectData['EMAIL'] && !formSubmitted)
  ) {
    previousName = formObjectData['FNAME'];
    previousEmail = formObjectData['EMAIL'];

    formSubmitted = true;
    formLoader.classList.toggle('hidden');
    submitBtn.disabled = true;

    console.log(formObjectData, 'datat');

    mailchimpuserdata['email_address'] = formObjectData['EMAIL'];
    mailchimpuserdata['full_name'] = splitString(formObjectData['FNAME']);
    mailchimpuserdata['timestamp_signup'] = new Date(Date.now())
      .toISOString()
      .replace(/\.\d{3}Z$/, 'Z');
    mailchimpuserdata['timestamp_opt'] = new Date(Date.now())
      .toISOString()
      .replace(/\.\d{3}Z$/, 'Z');

    //NEXTJS project as api www.samratdhital.com.np
    fetch('https://samratdhital.com.np/email-subscription', {
      method: 'POST',
      body: JSON.stringify(mailchimpuserdata),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        formSubmitted = false;
        successfulRequest = true;

        body.classList.toggle('overflow-hidden');
        thankyouModal.classList.toggle('hidden');
        thankyouBackdrop.classList.toggle('hidden');

        formLoader.classList.toggle('hidden');
        submitBtn.disabled = false; // Set disabled to false
      })
      .catch(() => {
        console.log('errorrrrr');
        formSubmitted = false;

        // //FIXME: only on the successful request
        // body.classList.toggle('overflow-hidden');
        // thankyouModal.classList.toggle('hidden');
        // thankyouBackdrop.classList.toggle('hidden');

        formLoader.classList.toggle('hidden');
        submitBtn.disabled = false; // Set disabled to false
      });
  } else {
    body.classList.toggle('overflow-hidden');
    thankyouModal.classList.toggle('hidden');
    thankyouBackdrop.classList.toggle('hidden');
  }
});

// handles when thank you model is clicked outside
thankyouBackdrop.addEventListener('click', (event) => {
  body.classList.toggle('overflow-hidden');

  thankyouModal.classList.toggle('hidden');
  thankyouBackdrop.classList.toggle('hidden');
});
thankyouClose.addEventListener('click', (event) => {
  body.classList.toggle('overflow-hidden');

  thankyouModal.classList.toggle('hidden');
  thankyouBackdrop.classList.toggle('hidden');
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

//scroll this id to center of the screen
function scrollToSection() {
  const section = document.querySelector(`#email-form`);
  const sectionHeight = section.getBoundingClientRect().height;
  const screenHeight = window.innerHeight;
  const sectionTop = section.getBoundingClientRect().top + window.scrollY;
  const screenCenter = screenHeight / 2;
  const sectionCenter = sectionTop + sectionHeight / 2;
  const y = sectionCenter - screenCenter;
  window.scrollTo({
    top: y,
    behavior: 'smooth',
  });
}
