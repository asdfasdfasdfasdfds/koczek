'use client';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Button } from 'primereact/button';
import { Column, ColumnFilterElementTemplateOptions } from 'primereact/column';
import { DataTable, DataTableFilterMeta } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import { ProgressBar } from 'primereact/progressbar';
import { Slider } from 'primereact/slider';
import React, { useEffect, useState } from 'react';
import type { Demo } from '@/types';
import { useRouter } from 'next/navigation';
import { ExamClasseservice } from '@/demo/service/ExamClassesService';
import BackButton from '@/demo/components/BackButton';
import { Student } from '@/models/student';
import { StudentService } from '@/demo/service/StudentService';
import { Dropdown } from 'primereact/dropdown';
import { ClassService } from '@/demo/service/ClassServices';
import { Class } from '@/models/homework';

const TableDemo = () => {
    const [filters1, setFilters1] = useState<DataTableFilterMeta>({});
    const [loading1, setLoading1] = useState(true);
    const [students, setStudents] = useState<Student[]>([]);
    const [originalStudents, setOriginalStudents] = useState<Student[]>([]);
    const [globalFilterValue1, setGlobalFilterValue1] = useState('');
    const [selectedStudents, setSelectedStudents] = useState<any>(null);
    const [dropdownValue, setdropdownValue] = useState<{ name: string; label: string }>({ name: '', label: '' });

    const router = useRouter();

    const clearFilter1 = () => {
        initFilters1();
        setdropdownValue({ label: '', name: '' });
    };

    const onGlobalFilterChange1 = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        let _filters1 = { ...filters1 };
        (_filters1['global'] as any).value = value;

        setFilters1(_filters1);
        setGlobalFilterValue1(value);
    };

    const renderHeader1 = () => {
        return (
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 p-2">
                <div className="p-input-icon-left w-full md:w-auto flex-1">
                    <Button type="button" icon="pi pi-filter-slash" label="Temizle" outlined onClick={clearFilter1} className="w-full md:w-auto" />
                </div>

                <div className="flex flex-col md:flex-row justify-end items-stretch md:items-center gap-2 w-full md:w-auto">
                    <div className="p-input-icon-left w-full md:w-auto flex-1">
                        <i className="pi pi-search" />
                        <InputText value={globalFilterValue1} onChange={onGlobalFilterChange1} placeholder="Ara" className="w-full" />
                    </div>
                </div>
            </div>
        );
    };

    useEffect(() => {
        StudentService.getStudents()
            .then((data) => {
                setStudents(data);
                setOriginalStudents(data);
            })
            .finally(() => setLoading1(false));
        initFilters1();
    }, []);

    const initFilters1 = () => {
        setFilters1({
            global: { value: null, matchMode: FilterMatchMode.CONTAINS },
            name: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
            },
            'country.name': {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
            },
            representative: { value: null, matchMode: FilterMatchMode.IN },
            date: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }]
            },
            balance: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }]
            },
            status: {
                operator: FilterOperator.OR,
                constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }]
            },
            successRatio: { value: null, matchMode: FilterMatchMode.BETWEEN },
            verified: { value: null, matchMode: FilterMatchMode.EQUALS }
        });
        setGlobalFilterValue1('');
    };

    const valueTemplate = (option: any) => {
        return <span>{option} saat</span>;
    };

    const successRatioBodyTemplate = (rowData: Student) => {
        return (
            <div style={{ position: 'relative', width: '100%' }}>
                <ProgressBar
                    value={(rowData.workTime / 1800) * 100} // Scale workTime to fit within 0-100 range
                    showValue={false}
                />
                <span
                    className="hidden md:block"
                    style={{
                        width: '100%',
                        textAlign: 'center',
                        position: 'absolute',
                        left: '50%',
                        top: '0%',
                        transform: 'translateX(-50%)',
                        fontSize: '15px' // Ensure the font size matches your ProgressBar
                    }}
                >
                    {(() => {
                        const workTime = rowData.workTime;
                        // Check if time is less than 60 minutes
                        if (workTime < 60) {
                            return `${Math.floor(workTime)} dk`;
                        } else {
                            const hours = Math.floor(workTime / 60); // Calculate full hours
                            const minutes = Math.floor(workTime % 60).toString().padStart(2, '0'); // Calculate remaining minutes
                            return `${hours} saat ${minutes} dk`; // If no remaining minutes, just show hours
                        }
                    })()}
                </span>
            </div>
        );
    };
    const successRateBodyTemplate = (rowData: Student) => {
        // Scale the value to fit within the new max (10)

        return <span>%{Math.floor(rowData.successRate)}</span>;
    };

    const handleSearchClick = (rowData: Student) => {
        router.push(`/students/${rowData.id}`);
    };

    const searchTemplate = (rowData: Student) => {
        return <Button icon="pi pi-search" text onClick={() => handleSearchClick(rowData)} />;
    };

    const successRatioFilterTemplate = (options: ColumnFilterElementTemplateOptions) => {
        return (
            <React.Fragment>
                <Slider value={options.value} onChange={(e) => options.filterCallback(e.value)} range className="m-3"></Slider>
                <div className="flex align-items-center justify-content-between px-2">
                    <span>{options.value ? options.value[0] : 0}</span>
                    <span>{options.value ? options.value[1] : 100}</span>
                </div>
            </React.Fragment>
        );
    };

    const header1 = renderHeader1();

    //Sinif filtreme start
    const [dropdownValues, setClasses] = useState<Class[]>([]);

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const data = await ClassService.getClasses();
                const formattedClasses = data.map((item) => ({
                    ...item,
                    label: `${item.level}/${item.name}`
                }));

                const genelOption = { name: 'Genel', _id: 'NY', level: 1, label: 'Genel' };
                setClasses([genelOption, ...formattedClasses]);
            } catch (error) {
                console.error('Failed to fetch classes:', error);
            }
        };

        fetchClasses();
    }, []);

    const handleClassFilter = () => {
        console.log('Dropdown value:', dropdownValue.label);
        console.log('Original table values:', originalStudents);

        if (dropdownValue && dropdownValue.name === 'Genel') {
            setStudents(originalStudents);
        } else if (!dropdownValue) {
            setStudents(originalStudents);
        } else {
            const filteredStudents = originalStudents.filter((student) => dropdownValue.label === student.class);
            console.log('Filtered students:', filteredStudents);
            setStudents(filteredStudents);
        }
    };

    useEffect(() => {
        handleClassFilter();
    }, [dropdownValue]);

    const sortedStudents = students?.sort((a, b) => {
        const aSchoolNumber = a.schoolNumber ? a.schoolNumber : Number.MAX_SAFE_INTEGER;
        const bSchoolNumber = b.schoolNumber ? b.schoolNumber : Number.MAX_SAFE_INTEGER;

        return aSchoolNumber - bSchoolNumber;
    });

    //Sinif filtreme end

    return (
        <div className="grid">
            <BackButton />
            <div className="col-12">
                <div className="card">
                    <h5>Öğrenci Listesi</h5>
                    <DataTable
                        value={sortedStudents}
                        selection={selectedStudents}
                        onSelectionChange={(e) => setSelectedStudents(e.value as Student)}
                        paginator
                        className="p-datatable-gridlines"
                        showGridlines
                        rows={10}
                        dataKey="id"
                        filters={filters1}
                        filterDisplay="menu"
                        loading={loading1}
                        responsiveLayout="scroll"
                        emptyMessage="Öğrenci bulunamadı."
                        header={header1}
                    >
                        <Column field="schoolNumber" header="Numara" sortable />
                        <Column
                            field="class"
                            style={{ textAlign: 'center' }}
                            header={() => (
                                <Dropdown
                                    value={dropdownValue}
                                    onChange={(e) => {
                                        setdropdownValue(e.value);
                                    }}
                                    options={dropdownValues || []}
                                    optionLabel="label"
                                    placeholder="Sınıf Seçiniz"
                                    className="w-full"
                                    filter
                                />
                            )}
                        />
                        <Column field="name" header="İsim" sortable filterPlaceholder="İsime göre ara" />
                        <Column field="successRate" body={successRateBodyTemplate} header="Başarı Oranı" sortable />
                        <Column field="workTime" header="Haftalık Çalışma Süresi" body={successRatioBodyTemplate} sortable />
                        <Column header="Görüntüle" body={searchTemplate} dataType="boolean" bodyClassName="text-center" style={{ width: '1%' }} />
                    </DataTable>
                </div>
            </div>
        </div>
    );
};

export default TableDemo;