export const WEEK_DAYS = {
    Monday: 'Понедельник',
    Tuesday: 'Вторник',
    Wednesday: 'Среда',
    Thursday: 'Четверг',
    Friday: 'Пятница',
    Saturday: 'Суббота',
    Sunday: 'Воскресенье'
};
export const MONTHS = [
    'Январь',
    'Февраль',
    'Март',
    'Апрель',
    'Май',
    'Июнь',
    'Июль',
    'Август',
    'Сентябрь',
    'Октябрь',
    'Ноябрь',
    'Декабрь'
];
export const TEST_MONTHS = ['Январь', 'Февраль', 'Март'];
// export const TEST_MONTHS = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь'];
export const YEARS = [2022, 2023, 2024, 2025, 2026];

export function getDateInFormatDDMMYY(year, month, day) {
    return new Date(year, month, day).toLocaleDateString('pl', { day: 'numeric', month: 'numeric', year: '2-digit' });
}

// export function getDateFromString(date) {
//     let parts = date.split('.');
//     return new Date(Number('20' + parts[2]), Number(parts[1] - 1), Number(parts[0]));
// }

export function getDateFromString(date) {
    const DATE_FORMAT_CONF = {
        point: () => {
            let parts = date.split('.').reverse();
            // console.log(`parts: ${JSON.stringify(parts, null, 4)}`);
            let year = Number(parts[0].length > 3 && parts[0].length <= 4 ? parts[0] : '20' + parts[0]);
            let month = Number(parts[1] - 1);
            let day = Number(parts[2]);

            return new Date(year, month, day);
        },
        dash: () => {
            let parts = date.split('-');
            // console.log(`parts: ${JSON.stringify(parts, null, 4)}`);
            let year = Number(parts[0].length > 3 && parts[0].length <= 4 ? parts[0] : '20' + parts[0]);
            let month = Number(parts[1] - 1);
            let day = Number(parts[2]);

            return new Date(year, month, day);
        }
    };

    if (date) return date.indexOf('.') !== -1 ? DATE_FORMAT_CONF.point() : DATE_FORMAT_CONF.dash();
}

export function getDateDiff(firstDate, secondDate) {
    // console.log(`date diff: ${Math.round((secondDate - firstDate) / (1000 * 60 * 60 * 24))}`);
    return secondDate ? Math.round((secondDate - firstDate) / (1000 * 60 * 60 * 24)) : -1;
}
