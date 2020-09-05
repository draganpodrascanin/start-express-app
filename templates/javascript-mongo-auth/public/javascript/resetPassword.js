const form = document.querySelector('#ressetpassword-form');

const resetPassword = async (password, passwordConfirm) => {
  let url = window.location.href.split('/');
  let token = url[url.length - 1];
  console.log(token);
  try {
    const res = await axios.patch(
      `http://localhost:8000/api/v1/users/resetPassword/${token}`,
      {
        password,
        passwordConfirm
      }
    );

    document.querySelector(
      '#success'
    ).innerHTML = `<span>${res.data.status}</span>`;

    setTimeout(() => {
      location.replace('/');
    }, 1500);
  } catch (err) {
    console.log(err.response);
    document.querySelector(
      '#error'
    ).innerHTML = `<span>${err.response.data.message}</span>`;
  }
};

form.addEventListener('submit', e => {
  e.preventDefault();

  const password = document.getElementById('password').value;
  const passwordConfirm = document.getElementById('passwordConfirm').value;

  resetPassword(password, passwordConfirm);
});
