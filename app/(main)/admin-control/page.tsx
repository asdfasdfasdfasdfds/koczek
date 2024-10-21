/* eslint-disable @next/next/no-img-element */
'use client';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable, DataTableFilterMeta } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import React, { useEffect, useRef, useState } from 'react';
import { Dropdown } from 'primereact/dropdown';
import BackButton from '@/demo/components/BackButton';
import { Class } from '@/models/homework';
import { ClassService } from '@/demo/service/ClassServices';
import { WaitingStudent } from '@/models/student';
import { AdminControlService } from '@/demo/service/AdminControlService';
import { Dialog } from 'primereact/dialog';
import { FilterMatchMode, FilterOperator } from 'primereact/api';

/* @todo Used 'as any' for types here. Will fix in next version due to onSelectionChange event type issue. */
const Crud = () => {
    const [admins, setAdmins] = useState<WaitingStudent[] | null>(null);
    const [inviteCode, setInviteCode] = useState<any>();
    const [inviteCodeDialog, setInviteCodeDialog] = useState<boolean>(false);
    const [selectedAdmins, setSelectedAdmins] = useState<WaitingStudent[]>([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [classes, setClasses] = useState<Class[]>([]);
    const [selectedClass, setSelectedClass] = useState<Class | null>(null);
    const [clicked, setClicked] = useState<boolean>(false);
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);
    const [filters1, setFilters1] = useState<DataTableFilterMeta>({});
    const [globalFilterValue1, setGlobalFilterValue1] = useState('');
    const [selectedClasses, setSelectedClasses] = useState<{ [studentId: string]: Class | null }>({});


    const clearFilter1 = () => {
        initFilters1();
    };
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
    const onGlobalFilterChange1 = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        let _filters1 = { ...filters1 };
        (_filters1['global'] as any).value = value;

        setFilters1(_filters1);
        setGlobalFilterValue1(value);
    };
    useEffect(() => {
        AdminControlService.getWaitingStudents().then((data) => setAdmins(data as WaitingStudent[]));
        initFilters1();
    }, [clicked]);

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const data = await ClassService.getClasses();
                setClasses(data.map((item) => ({
                    ...item,
                    label: `${item.level}/${item.name}`
                })));
            } catch (error) {
                console.error("Failed to fetch classes:", error);
            }
        };

        fetchClasses();
    }, []);

    const handleDropdownChange = (studentId: string, selectedClass: Class | null) => {
        setSelectedClasses((prevSelectedClasses) => ({
            ...prevSelectedClasses,
            [studentId]: selectedClass,
        }));
    };


    function handleCodeGeneration() {
        // Function to generate a date one week from now
        // Function to generate a date one week from now in the correct format
        const getExpirationDateOneWeekFromNow = (): string => {
            const currentDate = new Date();
            const expirationDate = new Date(currentDate.setDate(currentDate.getDate() + 7));
            return expirationDate.toISOString(); // Ensure the date is in ISO format
        };

        // Call the generateCode function and pass the correctly formatted expiration date
        AdminControlService.generateCode(getExpirationDateOneWeekFromNow()).then((data) => setInviteCode(data));
        console.log("Kod üretildi", inviteCode);

        setInviteCodeDialog(true);


    }
    const handleOnaylaClick = async () => {
        if (selectedAdmins.length > 0) {
            try {
                const data = selectedAdmins.map((student) => {
                    const classId = selectedClasses[student._id]?._id; // Get the class ID for each selected student
                    if (!classId) {
                        throw new Error("Lütfen tüm öğrenciler için bir sınıf seçiniz.");
                    }
                    return {
                        studentId: student._id,
                        classId: classId,
                    };
                });

                await AdminControlService.assignClassToStudents(data);
                toast.current?.show({
                    severity: 'success',
                    summary: 'Başarılı',
                    detail: 'İşlem başarılı',
                    life: 3000,
                });
                setClicked(true);
            } catch (error) {
                toast.current?.show({
                    severity: 'error',
                    summary: 'Hata',
                    detail: (error as Error).message || 'Öğrenci sınıf atama işlemi sırasında bir hata oluştu',
                    life: 3000,
                });
            }
        } else {
            toast.current?.show({
                severity: 'warn',
                summary: 'Dikkat',
                detail: 'Lütfen öğrenci seçiniz',
                life: 3000,
            });
        }
    };


    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="Onayla" icon="pi pi-check" severity="success" className="mr-2" onClick={handleOnaylaClick} />
                </div>
            </React.Fragment>
        );
    };
    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="Kod Üret" icon="pi pi-check" severity="success" className="mr-2" onClick={handleCodeGeneration} />
                </div>
            </React.Fragment>
        );
    };
    const dialogFooter = (
        <>
            <Button label="Kapat" icon="pi pi-times" text onClick={() => setInviteCodeDialog(false)} />
        </>
    );

    const nameBodyTemplate = (student: WaitingStudent) => {
        return <p>{student.name + " " + student.surname}</p>;
    };
    const classTemplate = (student: WaitingStudent) => {
        const handleDropdownClick = (event: React.MouseEvent) => {
            event.stopPropagation();
        };

        return (
            <>
                <div onClick={handleDropdownClick}>
                    <Dropdown
                        options={classes}
                        optionLabel="label"
                        placeholder="Sınıf Seç"
                        value={selectedClasses[student._id] || null}  // Get the selected class for this student
                        onChange={(e) => handleDropdownChange(student._id, e.value)}
                    />
                </div>
            </>
        );
    };


    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Adminler</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText
                    value={globalFilterValue1}
                    onChange={onGlobalFilterChange1}
                    placeholder="Ara"
                    className="w-full"
                />
            </span>
        </div>
    );


    return (<>
        <div className="grid crud-demo">
            <BackButton />

            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>
                    <DataTable
                        showGridlines
                        ref={dt}
                        value={admins}
                        selection={selectedAdmins}
                        onSelectionChange={(e) => setSelectedAdmins(e.value as any)}
                        dataKey="_id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} admins"
                        globalFilter={globalFilter}
                        emptyMessage="Bekleyen öğrenci bulunamadı"
                        header={header}

                        responsiveLayout="scroll"
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: '4rem' }} > </Column>
                        <Column field="student.name " header="İsim" body={nameBodyTemplate}  sortable ></Column>
                        <Column field="class" header="Sınıf" body={(student) => classTemplate(student)} headerClassName='text-center' ></Column>          
                                      <Column field="schoolNumber" header="Numara" sortable ></Column>
                        <Column field="school" header="Okul" sortable></Column>
                    </DataTable>
                </div>
            </div>



        </div>
        <Dialog
            visible={inviteCodeDialog}
            style={{ width: '450px' }}
            header="Kodlar"
            modal
            footer={dialogFooter}
            onHide={() => setInviteCodeDialog(false)}
        >
            <div className="p-4">
                {inviteCode && inviteCode.codes && inviteCode.codes.length > 0 ? (
                    (() => {
                        // Find the code with the latest expiration date
                        const latestCode = inviteCode.codes.reduce((latest: any, current: any) => {
                            // If current has a later expiration date or if latest is undefined, set current as latest
                            if (!latest || new Date(current.expDate) > new Date(latest.expDate)) {
                                return current;
                            }
                            return latest;
                        }, null);

                        return (
                            <table className="min-w-full bg-white border border-gray-300">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="border-b border-gray-300 px-4 py-2 text-left">Kod</th>
                                        <th className="border-b border-gray-300 px-4 py-2 text-left">Son Kullanma Tarihi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {latestCode && (
                                        <tr className="hover:bg-gray-50">
                                            <td className="border-b border-gray-300 px-4 py-2">
                                                <strong>{latestCode.code}</strong>
                                            </td>
                                            <td className="border-b border-gray-300 px-4 py-2">
                                                <strong>
                                                    {latestCode.expDate
                                                        ? new Date(latestCode.expDate).toLocaleDateString()
                                                        : 'Belirtilmemiş'}
                                                </strong>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        );
                    })()
                ) : (
                    <p className="text-center text-gray-600">Kod bulunamadı.</p>
                )}

            </div>
        </Dialog>

    </>
    );
};

export default Crud;
