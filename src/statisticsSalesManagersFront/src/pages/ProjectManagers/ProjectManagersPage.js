import { useState, useEffect } from 'react';

// Импорт компонентов
import Card from '@components/general/Card';

// Импорт доп.функционала
import { getDateFromString } from '@helpers/calendar';
import { numberWithSpaces } from '@helpers/helper';

// Импорт стилей
import './project_managers_page.css';

// Импорт данных
import TASKS_DATA from '@data/managers-projects.json';

function convertData(data) {
    const tasks = [],
        managers = Array.from(new Set(TASKS_DATA.map(item => item?.PRM)));

    managers.map(manager => {
        tasks.push({
            manager: manager ? manager : 'Входящие',
            price: data
                .filter(item => manager === item?.PRM)
                .map(elem => elem?.PRICE)
                .reduce((accumulator, value) => {
                    return accumulator + value;
                }),
            rest: data
                .filter(item => manager === item?.PRM)
                .map(elem => elem?.REST)
                .reduce((accumulator, value) => {
                    return accumulator + value;
                }),
            count: data.filter(item => manager === item?.PRM).length,
            data: data
                .filter(item => manager === item?.PRM)
                .map(task => {
                    return {
                        contract_id: task?.CONTRACT_ID,
                        adress: task?.ADRESS,
                        info: [task?.CUSTOMER, task?.CONTRACT_NUM, task?.DIRECTION, task?.EMPLOYEE_FIO, task?.STADIA],
                        price: task?.PRICE,
                        rest: task?.REST,
                        date: task?.DATE_OF_ENDING,
                        time_val: task?.PRM ? true : false
                    };
                })
        });
    });
    return tasks;
}

export default function ProjectManagersPage() {
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        setTasks(convertData(TASKS_DATA));

        console.log(`tasks: ${JSON.stringify(convertData(TASKS_DATA), null, 4)}`);
    }, []);

    return (
        <section className="section__project-managers section">
            <div className="kanban">
                <div className="kanban__wrapper">
                    {tasks.map((task, indexTask) => (
                        <div key={indexTask} className="kanban__column">
                            <div className="kanban__column-header">
                                <div className="kanban__column-header-inner">
                                    <h2 className="kanban__column-header-title">{task?.manager}</h2>
                                    <p className="kanban__column-header-subtitle">
                                        <span>{numberWithSpaces(task?.price)}&nbsp;&#8381;</span>/
                                        <span>{numberWithSpaces(task?.rest)}&nbsp;&#8381;</span>/
                                        <span>{task?.count}</span>
                                    </p>
                                </div>
                            </div>
                            <div className="kanban__column-content">
                                <ul className="kanban__column-cards">
                                    {task?.data && task?.data.length !== 0
                                        ? task?.data
                                              .sort(function (a, b) {
                                                  return getDateFromString(a?.date) - getDateFromString(b?.date);
                                              })
                                              .map(item => <Card cardData={item} />)
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
