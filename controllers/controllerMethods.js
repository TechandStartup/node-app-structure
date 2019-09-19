exports.formErrors = (err) => {
  const errors = []
  for (var property in err.errors) {
    errors.push({msg: err.errors[property].message});
  }
  return errors;
}