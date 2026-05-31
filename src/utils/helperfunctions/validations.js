import moment from 'moment';
export const ValueEmpty = value => {
  if (value?.trim()) {
    return false;
  }
  return true;
};

export const ValidateMobile = mobile => {
  const reg = new RegExp('^\\d+$');

  // if (ValueEmpty(mobile)) {
  //   return 'success';
  //   // return '*Required';
  // }
  // else if (!reg.test(mobile)) {
  //   return 'Invalid mobile number';
  // } 
  // else if (mobile.length < 10) {
  //   return 'Please enter 10 digit mobile number';
  // } 
  if (ValueEmpty(mobile)) {
    return 'Mobile Number is required ';
  } else if (mobile.length < 10) {
    return 'Please enter 10 digit mobile number';
  } else if (!reg.test(mobile)) {
    return 'Invalid mobile number';
  }
  return 'success';
};
export const ValidateGHIN = mobile => {
  const reg = new RegExp('^\\d+$');

  if (ValueEmpty(mobile)) {
    return 'success';
    // return '*Required';
  } else if (!reg.test(mobile)) {
    return 'Invalid GHIN number';
  } 
  // else if (mobile.length < 10) {
  //   return 'Please enter 10 digit mobile number';
  // } 
  else return 'success';
};
export const ValidateCardNumber= mobile => {
  const reg = new RegExp('^\\d+$');

  if (ValueEmpty(mobile)) {
    return 'success';
    // return '*Required';
  } else if (!reg.test(mobile)) {
    return 'Invalid Card number';
  } 
  // else if (mobile.length < 10) {
  //   return 'Please enter 10 digit mobile number';
  // } 
  else return 'success';
};

export const ValidateCVV= mobile => {
  const reg = new RegExp('^\\d+$');

  if (ValueEmpty(mobile)) {
    return 'success';
    // return '*Required';
  } else if (!reg.test(mobile)) {
    return 'Invalid cvv number';
  } 
  // else if (mobile.length < 10) {
  //   return 'Please enter 10 digit mobile number';
  // } 
  else return 'success';
};

export const ValidateBall= ball => {
  const reg = new RegExp('^\\d+$');

  if (!reg.test(ball)) {
    return 'Ball should be Numeric ';
  } 
  // else if (mobile.length < 10) {
  //   return 'Please enter 10 digit mobile number';
  // } 
  else return 'success';
};

export const Validatehdcp= ball => {
  const reg = new RegExp('^\\d+$');

  if (!reg.test(ball)) {
    return 'BHandicap Must be a valid number';
  } 
  // else if (mobile.length < 10) {
  //   return 'Please enter 10 digit mobile number';
  // } 
  else return 'success';
};

export const specialCharactorRemove = value => {
  const reg = new RegExp(/^[0-9a-zA-Z\_]+$/);
  if (!reg.test(value)) {
    return 'Special characters are not allowed';
  } else return 'success';
};

// export const ValidateMail = email => {
//   // if (ValueEmpty(email)) {
//   //   return 'Please provide valid email';
//   // }
//   const emailPattern =
//     /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-?\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;

//   const re =
//     /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
//     if (ValueEmpty(email)) {
//       return 'Email is Required';
//     }else if (!re.test(email)) {
//     return 'Please enter a valid email address';
//   }
//   return 'success';
// };


export const ValidateMail = email => {
  // Regular expression to validate email (no consecutive dots in domain, etc.)
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (ValueEmpty(email)) {
          return 'Email is Required';
        }else  if (emailRegex.test(email)) {
    // Check if there's a double dot in the domain part (e.g., ".gmail.gmail")
    const domainPart = email.split('@')[1];
    const domainPartDot = domainPart.split('.');
    if (domainPartDot.length === 2) {  // Ensure there is only one dot in the domain extension
      return 'success';
    }
    return 'Please enter a valid email address'
  } 
    return "Please enter a valid email address";
  
};

export const AlternativeValidateMail = email => {
  // Regular expression to validate email (no consecutive dots in domain, etc.)
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
 if (emailRegex.test(email)) {
    // Check if there's a double dot in the domain part (e.g., ".gmail.gmail")
    const domainPart = email.split('@')[1];
    const domainPartDot = domainPart.split('.');
    if (domainPartDot.length === 2) {  // Ensure there is only one dot in the domain extension
      return 'success';
    }
    return 'Please enter a valid email address'
  } 
    return "Please enter a valid email address";
  
};



export const ValidateTempleName = password => {
  var reg =  /^[A-Za-z]+$/;

  if (ValueEmpty(password)) {
    return 'Temple name is Required';
  } else if (password.length < 3|| password.length > 25) {
    return 'Name should be 3-25 characters long';
  } else if (!reg.test(password)) {
    return 'Name should be alphanumeric';
  }

  return 'success';
};




export const ValidateUserName = password => {
  if (ValueEmpty(password)) {
    return 'Username is Required';
  } else if (password.length < 3|| password.length > 25) {
    return 'Username should be 3-25 characters long';
  }

  return 'success';
};

export const ValidatePassword = password => {
  var reg =  /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*#?&])[a-zA-Z\d@$!%*#?&]{8,25}$/;

  if (ValueEmpty(password)) {
    return 'Password is Required';
  } else if (password.length < 8|| password.length > 25) {
    return 'Password should be 8-25 characters long';
  } else if (!reg.test(password)) {
    return 'Password must be 8-25 characters long, include at least one letter, one number, and one special character.';
  }

  return 'success';
};



export const  ValidatefirstName= firstName => {
  // Allow multi-word names with single spaces between words (e.g. "Raj Tomar Singh").
  // Keeps validation strict: letters only, no digits/special chars.
  const value = (firstName ?? '').trim().replace(/\s+/g, ' ');
  const reg = /^[A-Za-z]+(?: [A-Za-z]+)*$/;
  if (ValueEmpty(value)) {
    return 'First Name is required ';
  } else if (value.length > 100) {
    return 'First Name must be less than 100 characters';
  } else if (!reg.test(value)) {
    return 'Name must contain only letters and spaces';
  }
  return 'success';
};

export const  ValidateLocation= location => {
  const value = (location ?? '').trim().replace(/\s+/g, ' ');
  const reg = /^[A-Za-z]+(?: [A-Za-z]+)*$/;
 if (value?.length > 250) {
    return 'Location must be less than 250 characters';
  } else if (value && !reg.test(value)) {
    return 'Location must contain only letters and spaces';
  }
  return 'success';
};

export const  ValidateCity= city => {
  const value = (city ?? '').trim().replace(/\s+/g, ' ');
  const reg = /^[A-Za-z]+(?: [A-Za-z]+)*$/;
 if (value?.length > 100) {
    return 'City must be less than 100 characters';
  } else if (value && !reg.test(value)) {
    return 'City must contain only letters and spaces';
  }
  return 'success';
};
export const  ValidateClubs= club => {
  const value = (club ?? '').trim().replace(/\s+/g, ' ');
  const reg = /^[A-Za-z]+(?: [A-Za-z]+)*$/;
 if (value?.length > 100) {
    return 'Club must be less than 100 characters';
  } else if (value && !reg.test(value)) {
    return 'Club must contain only letters and spaces';
  }
  return 'success';
};

export const  ValidatelastName= lastName => {
  const value = (lastName ?? '').trim().replace(/\s+/g, ' ');
  const reg = /^[A-Za-z]+(?: [A-Za-z]+)*$/;
  if (ValueEmpty(value)) {
    return 'Last Name is required ';
  } else if (value.length > 100) {
    return 'Last Name must be less than 100 characters';
  } else if (!reg.test(value)) {
    return 'Name must contain only letters and spaces';
  }
  return 'success';
};



export const ifEmail = str => {
  const re =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  return re.test(str);
};

export const handleAPIErrorResponse = (response, caller) => {
  const {status, problem, data} = response;

  if (status === 200) {
    return;
  }

  if (status === 404) {
    throw `error in ${caller}: NOT FOUND`;
  }

  if (status === 500) {
    throw `error in ${caller}: SERVER ERROR`;
  }

  if (problem === 'CLIENT_ERROR') {
    throw `error in ${caller}: CLIENT_ERROR`;
  }
};

export const dateFormet = () => {
  const currentDate = moment().format('YYYY-MM-DD HH:mm:ss');
  return currentDate;
};
