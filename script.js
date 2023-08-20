// Validate form and show notification
function validateAndNotify() {
  let name = document.getElementById('name').value;
  let email = document.getElementById('email').value;

  if (name == '' || email == '') {
    alert('Please fill in both fields');
    return;
  }

  // Call API
  callApi(name, email).then((response) => {
    if (response.status == 200) {
      showPopover();
    }
  });
}

// API call
async function callApi(name, email) {
  // API logic
  return Promise.resolve({ status: 200 });
}

// Show popover
function showPopover() {
  // Popover display logic
}

const menuIcon = document.querySelector('.btn');
menuIcon.addEventListener('click', () => {
  menuIcon.classList.toggle('active');
  menuIcon.classList.toggle('not-active');
});
