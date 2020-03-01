const form = document.querySelector('#loginform');

const login = async (email, password) => {
  try {
    const res = await axios.post('http://localhost:8000/api/v1/users/login', {
      email,
      password
    });
    console.log(res);

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

form.addEventListener('submit', e => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  login(email, password);
});
