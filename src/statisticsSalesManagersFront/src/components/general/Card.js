// Импорт доп.функционала
import { getDateFromString, getDateDiff } from '@helpers/calendar';
import { numberWithSpaces } from '@helpers/helper';

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
        <li
            key={cardData?.contract_id}
            className="card"
            style={{ border: `1px solid ${cardData?.time_val ? getPriorityTask(dateDiff) : '#d9d9d9'}` }}
        >
            <h2 className="card__main-title">
                {cardData?.adress ? <span>{cardData?.adress}</span> : String.fromCharCode(8212)}
            </h2>
            <ul className="card__list">
                {cardData?.info && cardData?.info.length !== 0
                    ? cardData?.info.map(item => (item ? <li className="card__list-item">{item}</li> : null))
                    : null}
            </ul>
            <div className="card__bottom">
                <h3 className="card__bottom-title">
                    {cardData?.price ? (
                        <span className="card__bottom-price">{numberWithSpaces(cardData?.price)}&nbsp;&#8381;</span>
                    ) : (
                        String.fromCharCode(8212)
                    )}
                    <span>/</span>
                    {cardData?.rest ? (
                        <span className="card__bottom-rest">{numberWithSpaces(cardData?.rest)}&nbsp;&#8381;</span>
                    ) : (
                        String.fromCharCode(8212)
                    )}
                </h3>
                <p className="card__bottom-subtitle">{cardData?.date || String.fromCharCode(8212)}</p>
            </div>
        </li>
    );
}
