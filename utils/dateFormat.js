module.exports = dateFormat = date => {
    const day = date.toDateString();
    const hours = date.getHours();
    const mins = date.getMinutes();

    let time;

    if(hours > 12) {
        time = hours - 12 + ':' + mins + 'pm'
    } else {
        time = hours + ':' + mins + 'am'
    }
    return `${day}, ${time }`;
};