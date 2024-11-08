import Calendar from 'react-calendar';

export default function CalendarWindow(props) {
    const { stateCalendar, setStateCalendar, date, setDate } = props;

    function onClickCloseWindow() {
        setStateCalendar(!stateCalendar);
    }

    return stateCalendar ? (
        <div className="calendar__window">
            <div className="calendar__header">
                <button className="btn__close-calendar" onClick={onClickCloseWindow}>
                    <img src="/img/cancel_bl.svg" alt="" />
                </button>
            </div>
            <Calendar value={date} onChange={setDate} />
        </div>
    ) : null;
}
