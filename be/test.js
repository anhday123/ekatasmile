let changeNumberToTime = (hours) => {
    let hour = Math.floor(hours);
    let minute = Math.ceil((hours - Math.floor(hours)) * 60);
    return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
};

console.log(Math.floor(1.5));
