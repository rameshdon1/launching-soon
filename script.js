// Validate form and show notification
const body = document.body;
const overlay = document.getElementById('overlay');
const overlayLayer = document.getElementById('overlay-layer');

const menuIcon = document.querySelector('.btn');
menuIcon.addEventListener('click', () => {
  menuIcon.classList.toggle('active');
  menuIcon.classList.toggle('not-active');
});

const emailForm = document.getElementById('email-form');

emailForm.addEventListener('submit', async (event) => {
  event.preventDefault(); // prevent the form from submitting normally

  const formData = new FormData(emailForm); // get the form data
  const url = 'https://example.com/api/endpoint'; // replace with your API endpoint

  try {
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    console.log(data); // do something with the response data

    //select popup by id
    //toggle popup here

    //get body and toggle the overflow and backgrond blur smoothly
    body.classList.toggle('overflow-hidden');
    body.classList.toggle('blur-md');
  } catch (error) {
    body.classList.toggle('overflow-hidden');
    overlay.classList.toggle('hidden');
    overlayLayer.classList.toggle('hidden');
    console.error('Error:', error);
  }
});

overlayLayer.addEventListener('click', (event) => {
  body.classList.toggle('overflow-hidden');

  overlay.classList.toggle('hidden');
  overlayLayer.classList.toggle('hidden');
});
