const logout = async () => {
  try {
    await axios.get('http://localhost:8000/api/v1/users/logout');
    location.reload();
  } catch (err) {
    console.log(err);
  }
};

document.getElementById('logout').addEventListener('click', logout);
