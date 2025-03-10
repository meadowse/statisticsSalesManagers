import { useState, useEffect } from 'react';
import classNames from 'classnames';

// Импорт компонентов
import CalendarWindow from '@components/CalendarWindow';

// Импорт доп.функционала
import { MONTHS } from '@helpers/calendar';
import { numberWithSpaces, between, dataLoader } from '@helpers/helper';
import { getDateFromString, getDateDiff } from '@helpers/calendar';
import SalesService from '@services/sales.service';

// Импорт данных
import TASKS_DATA from '@data/managers-projects.json';
import rating from '@data/rating.json';

// Импорт стилей
import './sales_plan_page.css';
import 'react-calendar/dist/Calendar.css';

function AwardImage(props) {
    const { indRating, currSalesAsPerc, totalPayments, monthlyRate } = props;

    console.log(`indRating: ${indRating}\ntotalPayments: ${totalPayments}\nmonthlyRate: ${monthlyRate}`);

    let arrIcons = rating[indRating]?.data
        .map(elem =>
            rating[indRating]?.data.length > 1
                ? between(currSalesAsPerc, elem.range[0], elem.range[1])
                    ? elem.imgIcon
                    : null
                : rating[indRating]?.data[0].imgIcon
        )
        .filter(elem => elem !== null);

    return (
        <div className="image_wrapper">
            {totalPayments > monthlyRate ? <img className="img_icon" src={arrIcons[0]} alt="" /> : null}
        </div>
    );

    // return <div></div>;
}

function Multiplier(props) {
    const { indRating, totalPayments, monthlyRate, styleColor } = props;
    return totalPayments > monthlyRate ? (
        <span style={{ color: styleColor.color }} className="multiplier">
            {rating[indRating]?.multiplier}
        </span>
    ) : (
        String.fromCharCode('&shy;')
    );
}

function Header({ date, setDate }) {
    const [calendar, setCalendar] = useState(false);

    function onOpenCalendar() {
        setCalendar(true);
    }

    function onChangeDate(dateVal) {
        localStorage.setItem('date', new Date(dateVal).toString());

        setDate(dateVal);
        setCalendar(!calendar);
    }

    return (
        <header className="section__sales-plan-header">
            <a className="section__sales-plan-logo" href="#">
                <img src="/img/logo1.svg" alt="Logo" />
                <h2 className="section__sales-plan-logo-title">
                    <span>моспроект</span>
                    <span>комплекс</span>
                </h2>
            </a>
            <h1 className="section__sales-plan-title">{`Продажи (БЕЗ НДС)`}</h1>
            <div className="section__sales-plan-date">
                <button className="btn__select-date" onClick={onOpenCalendar}>
                    <p>
                        {MONTHS[date?.getMonth()]}&ensp;{date?.getFullYear()}
                    </p>
                    <img src="/img/arrow_down.svg" alt="" />
                </button>
                <CalendarWindow
                    stateCalendar={calendar}
                    setStateCalendar={setCalendar}
                    date={date}
                    setDate={onChangeDate}
                />
            </div>
        </header>
    );
}

function SidePanel({ data }) {
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
        <div className="side-panel">
            <h2 className="side-panel__title">Входящие</h2>
            <div className="side-panel__list-wrapper">
                <ul className="side-panel__list">
                    {data &&
                        data.length !== 0 &&
                        data.map(item => (
                            <li
                                className="side-panel__list-item"
                                style={{
                                    border: `1px solid ${getPriorityTask(
                                        getDateDiff(new Date(), getDateFromString(item?.date))
                                    )}`
                                }}
                            >
                                <span>
                                    {item?.direction} по адресу {item?.adress}
                                </span>
                            </li>
                        ))}
                </ul>
            </div>
        </div>
    );
}

function SalesRowData({ item, indItem }) {
    const currSalesAsPercentage = SalesService.getCurrSalesAsPercentage(item.total_payments, item.monthly_rate);
    const monthlyRate = SalesService.getMonthlyRate(item.total_payments, item.monthly_rate);
    const indRating = rating.map(elem => elem.monthlyRate).indexOf(monthlyRate >= 8000000 ? 8000000 : monthlyRate);

    const styleColor = SalesService.getColorStyle(
        rating,
        SalesService.getMonthlyRate(item.total_payments, item.monthly_rate),
        currSalesAsPercentage
    );
    const styleSales = {
        background: styleColor.bcColor,
        gridColumn: `1/${currSalesAsPercentage === 0 ? 2 : currSalesAsPercentage} span`
    };

    return (
        <tr key={indItem} className="row_sales">
            <td className="manager_cell">
                {item.manager_name}
                <AwardImage
                    indRating={indRating}
                    currSalesAsPerc={currSalesAsPercentage}
                    totalPayments={item.total_payments}
                    monthlyRate={item.monthly_rate}
                />
            </td>
            <td className="curr_amount_cell">
                <td className="curr_amount_sale">{numberWithSpaces(item.total_payments)}&nbsp;&#8381;</td>
                <td className="curr_amount_progress">
                    <td style={styleSales}>&shy;</td>
                    <td className={classNames('separator', '_50')}></td>
                    <td className={classNames('separator', '_90')}></td>
                </td>
            </td>
            <td className="monthly_rate_cell">
                <Multiplier
                    indRating={indRating}
                    totalPayments={item.total_payments}
                    monthlyRate={item.monthly_rate}
                    styleColor={styleColor}
                />
                <p className="monthly_rate_text">
                    {numberWithSpaces(SalesService.getMonthlyRate(item.total_payments, item.monthly_rate))}
                    &nbsp;&#8381;
                </p>
            </td>
        </tr>
    );
}

function SalesPlan({ sales, otherData }) {
    // console.log(`sales: ${JSON.stringify(data, null, 4)}`);
    const generalData = [...sales, ...otherData];

    const CURR_TOTAL_SALES_MAP = {
        getByManagers: data => {
            return SalesService.getCurrTotalSales(data);
        },
        getByOther: data => {
            return SalesService.getCurrTotalSales(data);
        },
        getSum: (managers, other) => {
            return SalesService.getCurrTotalSales(managers) + SalesService.getCurrTotalSales(other);
        }
    };

    const TOTAL_SALES_MAP = {
        getByManagers: data => {
            return SalesService.getTotalSales(data);
        },
        getByOther: data => {
            return SalesService.getTotalSales(data);
        },
        getSum: (managers, other) => {
            return SalesService.getTotalSales(managers) + SalesService.getTotalSales(other);
        }
    };

    const TOTAL_SALES_AS_PER_MAP = {
        getByManagers: data => {
            const currTotalSales = CURR_TOTAL_SALES_MAP.getByManagers(data);
            const totalSales = TOTAL_SALES_MAP.getByManagers(data);
            return SalesService.getCurrTotalSalesAsPercentage(currTotalSales, totalSales);
        },
        getByOther: data => {
            const currTotalSales = CURR_TOTAL_SALES_MAP.getByManagers(data);
            const totalSales = TOTAL_SALES_MAP.getByManagers(data);
            return SalesService.getCurrTotalSalesAsPercentage(currTotalSales, totalSales);
        },
        getSum: (managers, other) => {
            const currSumTotalSales = CURR_TOTAL_SALES_MAP.getSum(managers, other);
            const sumTotalSales = TOTAL_SALES_MAP.getSum(managers, other);
            return SalesService.getCurrTotalSalesAsPercentage(currSumTotalSales, sumTotalSales);
        }
    };

    const STYLES_GENERAL_SALES_MAP = {
        getByManagers: data => {
            const totalSalesAsPer = TOTAL_SALES_AS_PER_MAP.getByManagers(data);
            return { backgroundColor: '#666666', gridColumn: `1/${totalSalesAsPer} span` };
        },
        getByOther: data => {
            const totalSalesAsPer = TOTAL_SALES_AS_PER_MAP.getByManagers(data);
            return { backgroundColor: '#666666', gridColumn: `1/${totalSalesAsPer} span` };
        },
        getSum: (managers, other) => {
            const sumTotalSalesAsPer = TOTAL_SALES_AS_PER_MAP.getSum(managers, other);
            return { backgroundColor: '#666666', gridColumn: `1/${sumTotalSalesAsPer} span` };
        }
    };

    return (
        <div className="section__sales-plan-content">
            {generalData && generalData.length !== 0 ? (
                <table className="sales_table">
                    <thead className="sales_thead">
                        <tr>
                            <th align="left" className="total_title">
                                Общая сумма
                            </th>
                            <th className="curr_total_cell">
                                <th className="curr_total_sales">
                                    {/* {numberWithSpaces(currTotalSales)}&nbsp;&#8381; */}
                                    {/* {numberWithSpaces(CURR_TOTAL_SALES_MAP.getByManagers(sales))}&nbsp;&#8381; */}
                                    {numberWithSpaces(CURR_TOTAL_SALES_MAP.getSum(sales, otherData))}&nbsp;&#8381;
                                </th>
                                <th className="curr_total_progress">
                                    <th style={STYLES_GENERAL_SALES_MAP.getSum(sales, otherData)}>&shy;</th>
                                    <th className={classNames('separator', '_50')}></th>
                                    <th className={classNames('separator', '_90')}></th>
                                </th>
                            </th>
                            <th className="total_sales">
                                {numberWithSpaces(TOTAL_SALES_MAP.getSum(sales, otherData))}&nbsp;&#8381;
                            </th>
                        </tr>
                        <tr>
                            <th align="left" className="total_title">
                                Отдел продаж
                            </th>
                            <th className="curr_total_cell">
                                <th className="curr_total_sales">
                                    {/* {numberWithSpaces(currTotalSales)}&nbsp;&#8381; */}
                                    {numberWithSpaces(CURR_TOTAL_SALES_MAP.getByManagers(sales))}&nbsp;&#8381;
                                </th>
                                <th className="curr_total_progress">
                                    <th style={STYLES_GENERAL_SALES_MAP.getByManagers(sales)}>&shy;</th>
                                    <th className={classNames('separator', '_50')}></th>
                                    <th className={classNames('separator', '_90')}></th>
                                </th>
                            </th>
                            <th className="total_sales">
                                {numberWithSpaces(TOTAL_SALES_MAP.getByManagers(sales))}&nbsp;&#8381;
                            </th>
                        </tr>
                    </thead>
                    <tbody className="sales_tbody">
                        {sales.map((item, indItem) => (
                            <SalesRowData indItem={indItem} item={item} />
                        ))}
                        <tr className="hr_line"></tr>
                        <tr>
                            <th align="left" className="total_title">
                                Руководство и ПрМ
                            </th>
                            <th className="curr_total_cell">
                                <th className="curr_total_sales">
                                    {numberWithSpaces(CURR_TOTAL_SALES_MAP.getByOther(otherData))}&nbsp;&#8381;
                                </th>
                                <th className="curr_total_progress">
                                    <th style={STYLES_GENERAL_SALES_MAP.getByOther(otherData)}>&shy;</th>
                                    <th className={classNames('separator', '_50')}></th>
                                    <th className={classNames('separator', '_90')}></th>
                                </th>
                            </th>
                            <th className="total_sales">
                                {numberWithSpaces(TOTAL_SALES_MAP.getByOther(otherData))}&nbsp;&#8381;
                            </th>
                        </tr>
                        {otherData.map((item, indItem) => (
                            <SalesRowData indItem={indItem} item={item} />
                        ))}
                    </tbody>
                </table>
            ) : (
                <p className="error_msg">Данные отсутствуют!</p>
            )}
        </div>
    );
}

export default function SalesPlanPage() {
    const [sales, setSales] = useState([]);
    const [otherData, setOtherData] = useState([]);
    const [incoming, setIncoming] = useState([]);

    const [date, setDate] = useState(
        localStorage.getItem('date') ? new Date(localStorage.getItem('date')) : new Date()
    );

    const REQUESTS_MAP = {
        get_sales_data: async path => {
            await dataLoader(path).then(response => {
                const data = Array.from(response);
                // Дополняем данные
                for (let i = 0; i < data.length; i++) {
                    data[i]['total_payments'] = Math.ceil(data[i]['total_payments']);
                    data[i]['monthly_rate'] = 2000000;
                }
                // Сортируем данные по убыванию
                data.sort(function (a, b) {
                    return b.total_payments - a.total_payments;
                });
                setSales(data);
            });
        },
        get_other_data: async path => {
            await dataLoader(path).then(response => {
                const data = Array.from(response);
                // Дополняем данные
                for (let i = 0; i < data.length; i++) {
                    data[i]['total_payments'] = Math.ceil(data[i]['total_payments']);
                    data[i]['monthly_rate'] = 2000000;
                }
                // Сортируем данные по убыванию
                data.sort(function (a, b) {
                    return b.total_payments - a.total_payments;
                });
                setOtherData(data);
                console.log(`data: ${JSON.stringify(data, null, 4)}`);
            });
        },
        get_incoming_data: async path => {
            await dataLoader(path).then(response => {
                let data = [];
                const managers = Array.from(new Set(response.map(item => item?.PRM)));

                managers.map(manager => {
                    if (!manager) {
                        data = response
                            .filter(item => manager === item?.PRM)
                            .map(task => {
                                return {
                                    contract_id: task?.CONTRACT_ID,
                                    adress: task?.ADRESS,
                                    direction: task?.DIRECTION,
                                    date: task?.DATE_OF_ENDING,
                                    time_val: true
                                };
                            });
                    }
                });

                setIncoming(data);
            });
        }
    };

    useEffect(() => {
        // localStorage.setItem('date', new Date().toString());

        let interval = setInterval(async () => {
            const newDate = localStorage.getItem('date') ? new Date(localStorage.getItem('date')) : Date();
            console.log(`in interval newDate: ${newDate}`);

            const month = newDate.getMonth() + 1;
            const year = newDate.getFullYear();

            const pathSales = `/api/successManagers?month=${month}&year=${year}`;
            const pathOther = `/api/successManagers/other?month=${month}&year=${year}`;

            console.log(`in interval path: ${pathSales}`);

            REQUESTS_MAP.get_sales_data(pathSales);
            REQUESTS_MAP.get_other_data(pathOther);
        }, 5 * 60 * 1000);

        return () => {
            clearInterval(interval);
        };
    }, []);

    useEffect(() => {
        const newDate = localStorage.getItem('date') ? new Date(localStorage.getItem('date')) : new Date();
        console.log(`newDate: ${newDate}`);

        localStorage.setItem('date', newDate.toString());

        const month = newDate.getMonth() + 1;
        const year = newDate.getFullYear();

        const pathSales = `/api/successManagers?month=${month}&year=${year}`;
        const pathOther = `/api/successManagers/other?month=${month}&year=${year}`;

        // console.log(`path: ${path}`);

        REQUESTS_MAP.get_sales_data(pathSales);
        REQUESTS_MAP.get_other_data(pathOther);
    }, [localStorage.getItem('date')]);

    // useEffect(() => {
    //     const pathProjManagers = `http://10.199.2.144:8000/successManagers/projectManagers`;
    //     REQUESTS_MAP.get_incoming_data(pathProjManagers);
    // }, []);

    return (
        <section className="section__sales-plan section">
            <div className="section__sales-plan-inner">
                <Header date={date} setDate={setDate} setSales={setSales} />
                <SalesPlan sales={sales} otherData={otherData} />
            </div>
            {/* <button className="section__sales-plan-btn-show-panel">
                <img src="./img/arrow.svg" alt="" />
            </button> */}
            {/* <SidePanel data={incoming} /> */}
        </section>
    );
}