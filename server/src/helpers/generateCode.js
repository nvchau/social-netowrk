const ALPHABET = '0123456789ABCDEFGHIKLMNOPQRSTUVWXYZ'
module.exports = generate = () => {
	let code = '';
	for (let i = 0; i < 6; i++) {
		code += ALPHABET.charAt(Math.floor(Math.random() * ALPHABET.length));
	}
	return code;
};
