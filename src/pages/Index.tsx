const validate = (data) => {
  return {
    upiId: data.upiId ? undefined : 'UPI ID is required',
    name: undefined, // Name is now optional
    amount: undefined, // Amount is now optional
    note: undefined, // Note is now optional
  };
};