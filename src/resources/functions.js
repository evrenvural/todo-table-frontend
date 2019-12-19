export const convertToDoubleFromDate = (dateString) => {
    const date = new Date(dateString);
    return date.getTime();
}