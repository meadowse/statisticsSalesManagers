// Импорт доп.функционала
import { getDateFromString, getDateDiff } from '@helpers/calendar';

// Импорт стилей
import './card.css';

export default function Card({ cardData }) {
    const dateDiff = getDateDiff(new Date(), getDateFromString(cardData?.date));
    // console.log(`dateDiff ${getDateFromString(cardData?.date)} - ${new Date()}}: ${dateDiff}`);

    function getPriorityTask(days) {
        switch (true) {
            case days <= 1:
                return '#D71920';
            case days > 1 && days <= 6:
                return '#E3AA74';
            case days >= 7:
                return '#92CA77';
            default:
                return '#D9D9D9';
        }
    }

    return (
        <li className="card" style={{ border: `1px solid ${getPriorityTask(dateDiff)}` }}>
            <h2 className="card__main-title">{cardData?.address}</h2>
            <ul className="card__list">
                {cardData?.info && cardData?.info.length !== 0
                    ? cardData?.info.map(item => <li className="card__list-item">{item}</li>)
                    : null}
            </ul>
            <div className="card__bottom">
                <h3>{cardData?.price}</h3>
                <p>{cardData?.date}</p>
            </div>
        </li>
    );
}
