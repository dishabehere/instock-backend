export const excludeTimestamps = (obj) => {
    const { created_at, updated_at, ...rest } = obj;
    return rest;
};

export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};
  
export const validatePhoneNumber = (phoneNumber) => {
    const phoneRegex =
      /^(\+\d{1,3}[-]?)?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}$/;
    return phoneRegex.test(phoneNumber);
};
  