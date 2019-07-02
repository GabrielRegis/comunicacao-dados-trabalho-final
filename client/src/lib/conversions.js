
function stringToBinary(str) {
	if (str === null) {
		return null;
	}

	let binStr = str.split("").map(char => {
		let asciiBinCode = char.charCodeAt().toString(2);

		// Padding para cada char ficar com 8 bits
		return "0".repeat(8 - asciiBinCode.length) + asciiBinCode;
	}).join('');

	return binStr;
}

function binaryToString(binStr) {
	if (str === null) {
		return null;
	}

	let bytes = binStr.match(/.{8}/g);

	let str = bytes.map(byte => {
		return String.fromCharCode(parseInt(byte, 2));
	}).join('');

	return str;
}

function binaryToNRZ(binStr) {
	if (binStr === null) {
		return null;
	}

	// Converte a string binária em um sinal NRZ
	// Ex: "010" --> [-1, 1, -1]
	const nrzSignal = binStr.split("").map(bit => {
			return bit === "1" ? 1 : -1;
	});

	return nrzSignal;
}

function NRZToBinary(nrzSignal) {
	if (nrzSignal === null) {
		return null;
	}

	// Converte o sinal NRZ em uma string binária
	// Ex: [-1, 1, -1] --> "010"
	let binStr = nrzSignal.map(value => {
		return value === 1 ? "1" : "0";
	}).join('');

	return binStr;
}

function binaryToRZ(binStr) {
	if (binStr === null) {
		return null;
	}

	// Converte a string binária em um sinal RZ
	// Ex: "010" --> [-1, 0, 1, 0, -1, 0]
	let rzSignal = [];
	for(let bit of binStr) {
		if (bit === "1") {
			rzSignal = rzSignal.concat([1, 0]);
		} else {
			rzSignal = rzSignal.concat([-1, 0]);
		}
	}

	return rzSignal;
}

function RZToBinary(rzSignal) {
	if (rzSignal === null) {
		return null;
	}

	// Converte o sinal RZ em uma string binária
	// Ex: [-1, 0, 1, 0, -1, 0] --> "010"
	let binStr = [];
	for(let i=0; i < rzSignal.length - 1; i+=2) {
		let bit = (rzSignal[i] === 1 && rzSignal[i+1] === 0) ? "1" : "0";
		binStr.push(bit);
	}
	binStr = binStr.join('');

	return binStr;
}

export {
	stringToBinary,
	binaryToString,
	binaryToNRZ,
	NRZToBinary,
	binaryToRZ,
	RZToBinary
}