const form = document.querySelector('#loginform');

const signUp = async (
  firstName,
  lastName,
  email,
  password,
  passwordConfirm
) => {
  try {
    const res = await axios.post('http://localhost:8000/api/v1/users', {
      firstName,
      lastName,
      email,
      password,
      passwordConfirm,
    });

    setTimeout(() => {
      window.location.replace('http://localhost:8000/');
    }, 1000);
  } catch (err) {
    console.log(err);
    document.querySelector(
      '#error'
    ).innerHTML = `<span>${err.response.data.message}</span>`;
  }
};

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const passwordConfirm = document.getElementById('passwordConfirm').value;
  const firstName = document.getElementById('firstName').value;
  const lastName = document.getElementById('lastName').value;
  signUp(firstName, lastName, email, password, passwordConfirm);
});
