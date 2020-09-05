/* eslint-disable */
const h1 = document.querySelector('h1');

(async () => {
	try {
		const getMe = await axios.get('/api/v1/users/me');

		h1.innerText = `hello there, ${getMe.data.data.email}`;
	} catch (err) {
		h1.innerText = 'Ops.. something went wrong, try again later';
		console.log(err.message);
	}
})();
