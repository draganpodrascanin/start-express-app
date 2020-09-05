const form = document.querySelector('#forgotpassword-form');

const sendToken = async email => {
  try {
    const res = await axios.post(
      `http://localhost:8000/api/v1/users/forgotPassword`,
      {
        email
      }
    );

    document.querySelector(
      '#success'
    ).innerHTML = `<span>${res.data.message}</span>`;
  } catch (err) {
    console.log(err.response);
    document.querySelector(
      '#error'
    ).innerHTML = `<span>${err.response.data.message}</span>`;
  }
};

form.addEventListener('submit', e => {
  e.preventDefault();
  const email = document.getElementById('email').value;

  sendToken(email);
});
