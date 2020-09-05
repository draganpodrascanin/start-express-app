const form = document.querySelector('#loginform');

const signUp = async (name, email, password, passwordConfirm) => {
	try {
		const res = await axios.post('http://localhost:8000/api/v1/users/signUp', {
			name,
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
	const name = document.getElementById('name').value;
	signUp(name, email, password, passwordConfirm);
});
