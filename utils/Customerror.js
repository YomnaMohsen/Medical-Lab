export default function formatValidationErrors(err) {
    return Object.values(err.errors).map(error => error.message);
}
