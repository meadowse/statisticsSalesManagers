// Импорт компонентов
import Card from "../components/general/Card"

// Импорт доп.функционала
import { getDateFromString } from '../helpers/calendar';

// Импорт стилей
import './project_managers_page.css';

const tasks = [
    {
        title: 'Входящиие',
        price: '',
        data: [
            {
                address: 'Ул. Уличная д.12',
                info: ['ООО «Компания»', 'ТО-12/01/2023', 'Обследование', 'Д. Тарасевич'],
                price: '1 200 000 / 1 200 000',
                date: '20.11.24'
            },
            {
                address: 'Пр-кт. Проспекта д.10 к.3',
                info: ['ООО «Компания»', 'ТО-12/01/2023', 'Обследование', 'Д. Тарасевич'],
                price: '1 200 000 / 1 200 000',
                date: '20.11.24'
            }
        ]
    },
    {
        title: 'Ткаченко Максим',
        price: '1 120 000 ₽',
        data: [
            {
                address: 'Ул. Уличная д.1',
                info: ['ООО «Компания»', 'ТО-12/01/2023', 'Обследование', 'Д. Тарасевич'],
                price: '1 200 000 / 1 200 000',
                date: '11.11.24'
            },
            {
                address: 'Пр-кт. Проспекта д.10 к.3',
                info: ['ООО «Компания»', 'ТО-12/01/2023', 'Обследование', 'Д. Тарасевич'],
                price: '1 200 000 / 1 200 000',
                date: '8.11.24'
            },
            {
                address: 'Ул. Уличная д.2',
                info: ['ООО «Компания»', 'ТО-12/01/2023', 'Обследование', 'Д. Тарасевич'],
                price: '1 200 000 / 1 200 000',
                date: '12.11.24'
            },
            {
                address: 'Пр-кт. Проспекта д.10 к.8',
                info: ['ООО «Компания»', 'ТО-12/01/2023', 'Обследование', 'Д. Тарасевич'],
                price: '1 200 000 / 1 200 000',
                date: '7.11.24'
            },
            {
                address: 'Ул. Уличная д.12',
                info: ['ООО «Компания»', 'ТО-12/01/2023', 'Обследование', 'Д. Тарасевич'],
                price: '1 200 000 / 1 200 000',
                date: '20.11.24'
            },
            {
                address: 'Пр-кт. Проспекта д.10 к.23',
                info: ['ООО «Компания»', 'ТО-12/01/2023', 'Обследование', 'Д. Тарасевич'],
                price: '1 200 000 / 1 200 000',
                date: '18.11.24'
            }
        ]
    },
    {
        title: 'Устюжанин Николай',
        price: '2 250 600 ₽',
        data: [
            {
                address: 'Ул. Уличная д.1',
                info: ['ООО «Компания»', 'ТО-12/01/2023', 'Обследование', 'Д. Тарасевич'],
                price: '1 200 000 / 1 200 000',
                date: '7.11.24'
            },
            {
                address: 'Пр-кт. Проспекта д.10 к.3',
                info: ['ООО «Компания»', 'ТО-12/01/2023', 'Обследование', 'Д. Тарасевич'],
                price: '1 200 000 / 1 200 000',
                date: '18.11.24'
            }
        ]
    },
    {
        title: 'Кискин Станислав',
        price: '980 000 ₽',
        data: [
            {
                address: 'Ул. Уличная д.1',
                info: ['ООО «Компания»', 'ТО-12/01/2023', 'Обследование', 'Д. Тарасевич'],
                price: '1 200 000 / 1 200 000',
                date: '7.11.24'
            },
            {
                address: 'Пр-кт. Проспекта д.10 к.3',
                info: ['ООО «Компания»', 'ТО-12/01/2023', 'Обследование', 'Д. Тарасевич'],
                price: '1 200 000 / 1 200 000',
                date: '8.11.24'
            },
            {
                address: 'Ул. Уличная д.1',
                info: ['ООО «Компания»', 'ТО-12/01/2023', 'Обследование', 'Д. Тарасевич'],
                price: '1 200 000 / 1 200 000',
                date: '17.11.24'
            },
            {
                address: 'Пр-кт. Проспекта д.10 к.3',
                info: ['ООО «Компания»', 'ТО-12/01/2023', 'Обследование', 'Д. Тарасевич'],
                price: '1 200 000 / 1 200 000',
                date: '28.11.24'
            }
        ]
    }
];

export default function ProjectManagersPage() {
    return (
        <section className="section__project-managers section">
            <div className="kanban">
                <div className="kanban__wrapper">
                    {tasks.map((task, indexTask) => (
                        <div key={indexTask} className="kanban__column">
                            <div className="kanban__column-header">
                                <div className="kanban__column-header-inner">
                                    <h2 className="kanban__column-header-title">{task?.title}</h2>
                                    <p className="kanban__column-header-subtitle">{task?.price}&emsp;</p>
                                </div>
                            </div>
                            <div className="kanban__column-content">
                                <ul className="kanban__column-cards">
                                    {task?.data && task?.data.length !== 0
                                        ? task?.data
                                              .sort(function (a, b) {
                                                  return getDateFromString(a?.date) - getDateFromString(b?.date);
                                              })
                                              .map(item => <Card cardData={item}/>)
                                        : null}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
