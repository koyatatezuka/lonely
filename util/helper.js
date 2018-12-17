// helper function to return age
exports.getAge = dob => {
	const today = new Date();
	const birthDate = new Date(dob);
	let age = today.getFullYear() - birthDate.getFullYear();
	const m = today.getMonth() - birthDate.getMonth();
	if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
		age--;
	}
	return age;
};

// return prefered gender
exports.getPreferedGender = (userGender, userSexualPreference) => {
	if (userGender === 'male' && userSexualPreference === 'straight') {
		return ['female'];
	} else if (userGender === 'male' && userSexualPreference === 'gayLesbian') {
		return ['male'];
	} else if (userGender === 'male' && userSexualPreference === 'biSexual') {
		return ['male', 'female'];
	} else if (userGender === 'female' && userSexualPreference === 'straight') {
		return ['male'];
	} else if (userGender === 'female' && userSexualPreference === 'gayLesbian') {
		return ['female'];
	} else if (userGender === 'female' && userSexualPreference === 'biSexual') {
		return ['male', 'female'];
	}
};

// return prefered sexual preference
exports.getPreferedSexualPreference = userSexualPreference => {
	if (userSexualPreference === 'straight') {
		return ['straight', 'biSexual'];
	} else if (userSexualPreference === 'gayLesbian') {
		return ['gayLesbian', 'biSexual'];
	} else if (userSexualPreference === 'biSexual') {
		return ['straight', 'biSexual', 'gayLesbian'];
	}
};
