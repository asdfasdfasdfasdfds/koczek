/* eslint-disable @next/next/no-img-element */
'use client';
import { Button } from 'primereact/button';
import { Chart } from 'primereact/chart';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Menu } from 'primereact/menu';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { LayoutContext } from '../../layout/context/layoutcontext';
import Link from 'next/link';
import { ChartData, ChartOptions } from 'chart.js';
import { useRouter } from 'next/navigation';
import { LastExam } from '@/models/last-exam';
import { Notification } from '@/models/home';
import { GeneralInformations } from '@/models/home';
import { HomeService } from '@/demo/service/HomeService';
import { format, isToday, isYesterday } from "date-fns"; // Use date-fns to format and compare dates
const lineData: ChartData = {
    labels: ['Eylül', 'Ekim', 'Kasım', 'Aralık', 'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran'],
    datasets: [
        {
            label: '8-A Sınıfı',
            data: [65, 59, 80, 81, 56, 55, 40],
            fill: false,
            backgroundColor: '#2f4860',
            borderColor: '#2f4860',
            tension: 0.4
        },
        {
            label: '8-B Sınıfı',
            data: [28, 48, 40, 19, 86, 27, 90],
            fill: false,
            backgroundColor: '#00bb7e',
            borderColor: '#00bb7e',
            tension: 0.4
        }
    ]
};

const Dashboard = () => {
    const [students, setStudents] = useState<LastExam[]>([]);
    const [generalInfo, setGeneralInfo] = useState<GeneralInformations>();
    const [notifications, setNotifications] = useState<Notification[]>();
    const menu1 = useRef<Menu>(null);
    const menu2 = useRef<Menu>(null);
    const [lineOptions, setLineOptions] = useState<ChartOptions>({});
    const { layoutConfig } = useContext(LayoutContext);
    const router = useRouter();

    const applyLightTheme = () => {
        const lineOptions: ChartOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: '#495057'
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#495057'
                    },
                    grid: {
                        color: '#ebedef'
                    }
                },
                y: {
                    ticks: {
                        color: '#495057'
                    },
                    grid: {
                        color: '#ebedef'
                    }
                }
            }
        };

        setLineOptions(lineOptions);
    };

    const applyDarkTheme = () => {
        const lineOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: '#ebedef'
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#ebedef'
                    },
                    grid: {
                        color: 'rgba(160, 167, 181, .3)'
                    }
                },
                y: {
                    ticks: {
                        color: '#ebedef'
                    },
                    grid: {
                        color: 'rgba(160, 167, 181, .3)'
                    }
                }
            }
        };

        setLineOptions(lineOptions);
    };

    useEffect(() => {
        HomeService.getLastExams().then((data) => {
            const sortedStudents = data.sort((a, b) => a.examRank.schoolRank - b.examRank.schoolRank);
            setStudents(sortedStudents);
        });
        HomeService.getGeneralInformations().then((data) => setGeneralInfo(data));
        HomeService.getNotifications().then((data) => setNotifications(data));

        ;
    }, []);

    useEffect(() => {
        if (layoutConfig.colorScheme === 'light') {
            applyLightTheme();
        } else {
            applyDarkTheme();
        }
    }, [layoutConfig.colorScheme]);
  
    const handleSearchClick = (rowData: any) => {
        router.push(`/students/${rowData.studentId	}`); 
    };

    const searchTemplate = (rowData: any) => {
        return <Button icon="pi pi-search" text onClick={() => handleSearchClick(rowData)} />
    };
    const pointTemplate = (rowData:any) => {
        return (rowData.generalResult.totalPoint.toFixed(2));
    };
    const getDateLabel = (date: string | number | Date) => {
        if (isToday(new Date(date))) {
            return "Bugün"; // Today
        } else if (isYesterday(new Date(date))) {
            return "Dün"; // Yesterday
        } else {
            return format(new Date(date), "dd MMM yyyy"); // Older dates
        }
    };
    return (
        <div className="grid">
            <div className="col-12 lg:col-6 xl:col-3">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">Öğrenci Sayısı</span>
                            <div className="text-900 font-medium text-xl">{generalInfo?.totalStudentCount}</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-blue-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-book text-blue-500 text-xl" />
                        </div>
                    </div>
                    <span className="text-green-500 font-medium">Sisteme kayıtlı </span>
                    <span className="text-500">toplam öğrenci sayısı</span>
                </div>
            </div>
            <div className="col-12 lg:col-6 xl:col-3">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">Öğrenci Sayısı</span>
                            <div className="text-900 font-medium text-xl">{generalInfo?.activeStudentCount}</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-orange-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-user text-orange-500 text-xl" />
                        </div>
                    </div>
                    <span className="text-green-500 font-medium">Sisteme kayıtlı </span>
                    <span className="text-500">aktif öğrenci sayısı</span>
                </div>
            </div>
            <div className="col-12 lg:col-6 xl:col-3">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">Deneme Sayısı</span>
                            <div className="text-900 font-medium text-xl">{generalInfo?.generalExamCount}</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-cyan-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-pencil text-cyan-500 text-xl" />
                        </div>
                    </div>
                    <span className="text-green-500 font-medium">Yapılan</span>
                    <span className="text-500"> deneme sayısı</span>
                </div>
            </div>
            <div className="col-12 lg:col-6 xl:col-3">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">Onay Bekleyenler</span>
                            <div className="text-900 font-medium text-xl">{generalInfo?.waitingRoomCount}</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-purple-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-user-plus text-purple-500 text-xl" />
                        </div>
                    </div>
                    <span className="text-green-500 font-medium">{generalInfo?.waitingRoomCount} öğrenci </span>
                    <span className="text-500">onay bekliyor.</span>
                </div>
            </div>

            <div className="col-12 xl:col-6">
                <div className="card">
                    <h5>Öğrenci Deneme Sıralaması </h5>
                {students && students.length > 0 &&
                    <DataTable  showGridlines value={students}  rows={5} paginator responsiveLayout="scroll">
                    {/*<Column header="Image" body={(data) => <img className="shadow-2" src={`/demo/images/product/${data.image}`} alt={data.image} width="50" />} />*/}
                    <Column 
                        header="Sıra" 
                        sortable 
                        style={{ width: '1%' }} 
                        body={(rowData) => rowData.generalRanks?.[0]?.schoolRank ?? rowData.examRank?.schoolRank ?? '-'}
                        //sortField={rowData => rowData.generalRanks?.[0]?.schoolRank || rowData.examRank?.schoolRank}
                        />
                    <Column field="name" header="İsim" sortable style={{ width: '35%' }} />
                    <Column field="class" header="Sınıf" sortable style={{ width: '35%' }} />
                    <Column field="generalResult.totalPoint" body={pointTemplate} header="Puan" sortable style={{ width: '35%' }} />
                </DataTable>}
                </div>
                {/*Buraya bir if gelecek admin panel için olacak bu kısım*/}
                <div
                    className="px-4 py-5 shadow-2 flex flex-column md:flex-row md:align-items-center justify-content-between mb-3"
                    style={{
                        borderRadius: '1rem',
                        background: 'linear-gradient(0deg, rgba(0, 123, 255, 0.5), rgba(0, 123, 255, 0.5)), linear-gradient(92.54deg, #1C80CF 47.88%, #FFFFFF 100.01%)'
                    }}
                >
                    <div>
                        <div className="text-blue-100 font-medium text-xl mt-2 mb-3">Sisteme Giriş Yap</div>
                        <div className="text-white font-medium text-5xl">Koç Zek-Ai</div>
                    </div>
                    <div className="mt-4 mr-auto md:mt-0 md:mr-0">
                        <Link href="https://www.koczekai.pro/main" className="p-button font-bold px-5 py-3 p-button-warning p-button-rounded p-button-raised">
                            Giriş Yap
                        </Link>
                    </div>
                </div>
            </div>
            <div className="col-12 xl:col-6">
                <div className="card">
                    <h5>Sınıf İlerleme Grafiği</h5>
                    <Chart type="line" data={lineData} options={lineOptions} />
                </div>

                <div className="card">
            <div className="flex align-items-center justify-content-between mb-4">
                <h5>Bildirimler</h5>
                <div>
                    <Button
                        type="button"
                        icon="pi pi-ellipsis-v"
                        rounded
                        text
                        className="p-button-plain"
                        onClick={(event) => menu2.current?.toggle(event)}
                    />
                    <Menu
                        ref={menu2}
                        popup
                        model={[
                            { label: 'Add New', icon: 'pi pi-fw pi-plus' },
                            { label: 'Remove', icon: 'pi pi-fw pi-minus' },
                        ]}
                    />
                </div>
            </div>

            {notifications&&notifications.length > 0 ? (
                // Group by date and render dynamically
                notifications
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) // Sort notifications by date (newest first)
                    .map((notification, index) => {
                        const dateLabel = index === 0 || getDateLabel(notification.createdAt) !== getDateLabel(notifications[index - 1].createdAt)
                            ? getDateLabel(notification.createdAt)
                            : null;

                        return (
                            <React.Fragment key={notification._id}>
                                {dateLabel && (
                                    <span className="block text-600 font-medium mb-3">{dateLabel}</span>
                                )}
                                <ul className="p-0 mx-0 mt-0 mb-4 list-none">
                                    <li className={`flex align-items-center py-2 ${index !== notifications.length - 1 ? 'border-bottom-1 surface-border' : ''}`}>
                                        <div className="w-3rem h-3rem flex align-items-center justify-content-center bg-blue-100 border-circle mr-3 flex-shrink-0">
                                            <i className="pi pi-info text-xl text-blue-500" />
                                        </div>
                                        <span className="text-900 line-height-3">
                                            <span className="text-700">
                                                {notification.message}
                                            </span>
                                        </span>
                                    </li>
                                </ul>
                            </React.Fragment>
                        );
                    })
            ) : (
                <span className="text-700">No notifications available.</span>
            )}
        </div>
            </div>
        </div>
    );
};

export default Dashboard;
