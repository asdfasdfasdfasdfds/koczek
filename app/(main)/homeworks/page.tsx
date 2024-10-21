/* eslint-disable @next/next/no-img-element */
'use client';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable, DataTableFilterMeta } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { FileUpload } from 'primereact/fileupload';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import React, { useEffect, useRef, useState } from 'react';
import BackButton from '@/demo/components/BackButton';
import { HomeworksService } from '@/demo/service/HomeworkServices';
import { Class, Homework } from '@/models/homework';
import { MultiSelect } from 'primereact/multiselect';
import { getAuthToken } from '@/utils/util';
import { ClassService } from '@/demo/service/ClassServices';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { useRouter } from 'next/navigation';
import { InputNumber, InputNumberChangeEvent } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';

/* @todo Used 'as any' for types here. Will fix in next version due to onSelectionChange event type issue. */
const Crud = () => {
    let emptyHomework: Homework = {
        _id: '',
        title: '',
        content: '',
        effort: '',
        startDate: new Date().toISOString(),
        endDate: '',
        classes: [],
        date: '',
        files: []
    };

    const [homeworks, setHomeworks] = useState<Homework[]>();
    const [selectedHomeworks, setSelectedHomeworks] = useState<Homework[] | null>(null);
    const [originalHomeworks, setOriginalHomeworks] = useState<Homework[]>([]);
    const [homeworkDialog, setHomeworkDialog] = useState(false);
    const [homeworkAddDialog, setHomeworkAddDialog] = useState(false);
    const [deleteHomeworkDialog, setDeleteHomeworkDialog] = useState(false);
    const [deleteHomeworksDialog, setDeleteHomeworksDialog] = useState(false);
    const [homework, setHomework] = useState<Homework>(emptyHomework);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);
    const [dropdownValueClasses, setDropdownValueClasses] = useState<Class[]>([]);
    const [isReadOnly, setIsReadOnly] = useState<boolean>(true);
    const [dropdownValuesSchools, setDropdownValuesSchools] = useState<Class[]>();
    const [filters1, setFilters1] = useState<DataTableFilterMeta>({});
    const [globalFilterValue1, setGlobalFilterValue1] = useState('');
    const [selectedFile, setSelectedFile] = useState<any>();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [dropdownValue, setdropdownValue] = useState<{ name: string; label: string }>({ name: '', label: '' });

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            const file = files[0];
            console.log('file', file);
            setSelectedFile(file);
        }
    };

    const clearFilter1 = () => {
        initFilters1();
        setdropdownValue({ label: '', name: '' });
    };

    const initFilters1 = () => {
        setFilters1({
            global: { value: null, matchMode: FilterMatchMode.CONTAINS },
            name: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
            },
            title: {
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
    const onUpload = () => {
        toast.current?.show({
            severity: 'info',
            summary: 'Başarılı',
            detail: 'Dosya Yüklendi',
            life: 3000
        });
    };

    useEffect(() => {
        const fetchHomeworks = async () => {
            try {
                const data = await HomeworksService.getHomeworks();

                // Sort the fetched data by startDate
                const sortedData = data.sort((a, b) => {
                    // Ensure startDate is parsed correctly
                    const dateA = new Date(a.startDate);
                    const dateB = new Date(b.startDate);
                    return dateB.getTime() - dateA.getTime();
                });

                setHomeworks(sortedData);
                setOriginalHomeworks(sortedData);
            } catch (error) {
                console.error('Failed to fetch homeworks:', error);
            }
        };

        fetchHomeworks();
        initFilters1();
    }, [submitted]);

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const data = await ClassService.getClasses();
                setDropdownValuesSchools(
                    data.map((item) => ({
                        ...item,
                        label: `${item.level}/${item.name}`
                    }))
                );
            } catch (error) {
                console.error('Failed to fetch homeworks:', error);
            }
        };

        fetchClasses();
        initFilters1();
    }, []);

    const handDownload = (link: string, fileNameOriginal: string) => {
        const fetchDownload = async () => {
            try {
                const response = await fetch(`${process.env.API_URL}/${link}`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${getAuthToken()}`, // Add your authorization token here
                        Accept: 'application/octet-stream' // Adjust as needed based on the file type you are expecting
                    }
                });

                // Check if the response is successful
                if (!response.ok) {
                    toast.current?.show({
                        severity: 'error',
                        summary: 'Hata',
                        detail: 'Dosya bulunamadı',
                        life: 3000
                    });
                    throw new Error('Failed to fetch file');
                }

                // Convert the response into a blob
                const blob = await response.blob();
                console.log('Blob:', blob);

                // Create a temporary URL for the blob
                const downloadUrl = window.URL.createObjectURL(blob);
                console.log('Download URL:', downloadUrl);

                // Create a temporary anchor element to trigger the download
                const a = document.createElement('a');
                a.href = downloadUrl;

                // Optionally set the download attribute to suggest a filename
                const contentDisposition = response.headers.get('Content-Disposition');
                const fileName = contentDisposition?.split('filename=')[1]?.replace(/['"]/g, '') || fileNameOriginal;
                a.download = fileName;

                // Append the anchor element to the document body and trigger the download
                document.body.appendChild(a);
                a.click();

                // Clean up by removing the temporary URL and the anchor element
                window.URL.revokeObjectURL(downloadUrl);
                document.body.removeChild(a);
            } catch (error) {
                console.error('Failed to fetch and download homeworks:', error);
            }
        };

        fetchDownload();
    };

    const hideDialog = () => {
        setSubmitted(false);
        setHomeworkDialog(false);
    };

    const openNewAddDialog = () => {
        setHomework(emptyHomework);
        setHomeworkAddDialog(true);
    };

    const hideDialogAddDialog = () => {
        setSelectedFile(null);
        setDropdownValueClasses([]);
        setHomeworkAddDialog(false);
    };

    const hideDeleteHomeworkDialog = () => {
        setDeleteHomeworkDialog(false);
    };

    const hideDeleteHomeworksDialog = () => {
        setDeleteHomeworksDialog(false);
    };

    const saveHomework = async () => {
        setSubmitted(true);

        // Check if we are updating either startDate or endDate
        if (homework.endDate) {
            // Ensure startDate is not after endDate
            if (new Date(homework.startDate) > new Date(homework.endDate)) {
                toast.current?.show({
                    severity: 'error',
                    summary: 'Hata',
                    detail: 'Başlangıç tarihi bitiş tarihinden önce olmalıdır',
                    life: 3000
                });
                return; // Prevent updating the state
            }
        }

        if (homework.startDate) {
            // Ensure endDate is not before startDate
            if (new Date(homework.startDate) > new Date(homework.endDate)) {
                toast.current?.show({
                    severity: 'error',
                    summary: 'Hata',
                    detail: 'Bitiş tarihi başlangıç tarihinden sonra olmalıdır',
                    life: 3000
                });
                return; // Prevent updating the state
            }
        }

        // Basic validations for required fields
        if (!homework.title.trim()) {
            toast.current?.show({
                severity: 'error',
                summary: 'Hata',
                detail: 'Ödev ismi zorunludur',
                life: 3000
            });
            return;
        }

        if (!homework.startDate) {
            toast.current?.show({
                severity: 'error',
                summary: 'Hata',
                detail: 'Başlangıç tarihi zorunludur',
                life: 3000
            });
            return;
        }

        if (!homework.content.trim()) {
            toast.current?.show({
                severity: 'error',
                summary: 'Hata',
                detail: 'Açıklama zorunludur',
                life: 3000
            });
            return;
        }

        if (!homework.endDate) {
            toast.current?.show({
                severity: 'error',
                summary: 'Hata',
                detail: 'Bitiş tarihi zorunludur',
                life: 3000
            });
            return;
        }

        if (dropdownValueClasses.length === 0) {
            toast.current?.show({
                severity: 'error',
                summary: 'Hata',
                detail: 'En az bir sınıf seçmelisiniz',
                life: 3000
            });
            return;
        }

        // Proceed with saving the homework
        const { classes, ...homeworkWithoutClasses } = homework; // Remove classes to handle them separately

        // Create an array of promises for creating or updating the homework
        const createHomeworkPromises = dropdownValueClasses.map(async (item) => {
            const formData = new FormData();

            // Append fields to FormData
            formData.append('title', homeworkWithoutClasses.title);
            formData.append('content', homeworkWithoutClasses.content);
            formData.append('startDate', homeworkWithoutClasses.startDate);
            formData.append('endDate', homeworkWithoutClasses.endDate);
            formData.append('effort', homeworkWithoutClasses.effort);
            formData.append('classes[]', item._id ?? '');

            // Attach file if selected
            if (selectedFile) {
                formData.append('files', selectedFile);
            }

            try {
                let response;
                if (homework._id) {
                    /*
                     formData.append('_id', homework._id);  // Append ID for update
                     response = await fetch(`${process.env.API_URL}/task/update`, {
                         method: 'PUT',
                         headers: {
                             'Authorization': `Bearer ${getAuthToken()}`,  // Use FormData, so no need for 'Content-Type'
                         },
                         body: formData,
                     });*/
                    toast.current?.show({
                        severity: 'error',
                        summary: 'Hata',
                        detail: 'Şu an bu işlev kullanılamıyor',
                        life: 3000
                    });
                } else {
                    response = await fetch(`${process.env.API_URL}/task/create`, {
                        method: 'POST',
                        headers: {
                            Authorization: `Bearer ${getAuthToken()}` // Same for POST
                        },
                        body: formData
                    });
                    if (!response.ok) {
                        throw new Error('Request failed');
                    }

                    return response.json();
                }
            } catch (error) {
                console.error('Error:', error);
                toast.current?.show({
                    severity: 'error',
                    summary: 'Hata',
                    detail: 'Şu an bu işlev kullanılamıyor',
                    life: 3000
                });
                return null;
            }
        });

        try {
            const results = await Promise.all(createHomeworkPromises);
            const successfulHomeworks = results.filter((result) => result !== null);

            // Update the homework list in the local state
            let _homeworks = [...(homeworks ?? [])];
            if (homework._id) {
                // Update homework in local state
                successfulHomeworks.forEach((updatedHomework) => {
                    const index = findIndexById(updatedHomework._id);
                    if (index !== -1) {
                        _homeworks[index] = updatedHomework;
                    }
                });
            } else {
                // Add new homework to local state
                _homeworks = [..._homeworks, ...successfulHomeworks];
            }

            // Successfully saved, update the state and notify the user
            setHomeworks(_homeworks);
            setHomework(emptyHomework); // Reset homework form
            hideDialog(); // Hide dialog
            hideDialogAddDialog(); // Additional dialog hide if necessary
            setHomeworkDialog(false); // Close the dialog
            toast.current?.show({
                severity: 'success',
                summary: 'Başarılı',
                detail: homework._id ? 'Ödev güncellendi' : 'Ödev oluşturuldu',
                life: 3000
            });
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const editHomework = (homework: Homework) => {
        setHomework({ ...homework });

        const matchedClasses = homework.classes
            .map((item) => {
                return dropdownValuesSchools?.find((option) => option.name === item.name && option.level === item.level);
            })
            .filter(Boolean);

        setDropdownValueClasses(matchedClasses as Class[]);
        setHomeworkDialog(true);
        initFilters1();
    };

    const deleteHomework = async () => {
        try {
            // Make DELETE request to the API
            const response = await fetch(`${process.env.API_URL}/task/delete`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                let _homeworks = (homeworks as Homework[]).filter((val) => val._id !== homework._id);
                setHomeworks(_homeworks);

                setDeleteHomeworkDialog(false);
                setHomework(emptyHomework);
                hideDialog();

                toast.current?.show({
                    severity: 'success',
                    summary: 'Başarılı',
                    detail: 'Ödev silindi',
                    life: 3000
                });
            } else {
                const errorMessage = await response.text();
                throw new Error(errorMessage);
            }
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: 'Hata',
                detail: 'Ödevler kayıt edilemedi',
                life: 3000
            });
            console.error('Error:', error);
        }
    };

    const findIndexById = (_id: string) => {
        let index = -1;
        for (let i = 0; i < (homeworks as any)?.length; i++) {
            if ((homeworks as any)[i]._id === _id) {
                index = i;
                break;
            }
        }

        return index;
    };

    const confirmDeleteSelected = () => {
        setDeleteHomeworksDialog(true);
    };

    const deleteSelectedHomeworks = async () => {
        try {
            // Prepare the request body by mapping selected homeworks to taskId and each classId
            const requestBody = {
                data: selectedHomeworks?.flatMap((homework: Homework) =>
                    homework.classes.map((classItem) => ({
                        taskId: homework._id,
                        classId: classItem._id // Assuming classItem has an _id field
                    }))
                )
            };

            // Make DELETE request to the API
            const response = await fetch(`${process.env.API_URL}/task/delete`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${getAuthToken()}`
                },
                body: JSON.stringify(requestBody)
            });

            if (response.ok) {
                // Filter out the deleted homeworks from the state
                let _homeworks = (homeworks as any[]).filter((val) => !(selectedHomeworks as any)?.some((selected: any) => selected._id === val._id));
                setHomeworks(_homeworks);
                hideDialog();
                setDeleteHomeworksDialog(false);
                setSelectedHomeworks(null);

                toast.current?.show({
                    severity: 'success',
                    summary: 'Başarılı',
                    detail: 'Başarıyla Silindi',
                    life: 3000
                });
            } else {
                const errorMessage = await response.text();
                throw new Error(errorMessage);
            }
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: 'Hata',
                detail: 'Kayıt edilemedi',
                life: 3000
            });
            console.error('Error:', error);
        }
    };
    const onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | InputNumberChangeEvent, name: keyof Homework) => {
        let val: any;

        // Check if the event is from InputNumber or a regular input
        if ('value' in e) {
            // InputNumberChangeEvent - Handle `null` correctly
            val = e.value !== null ? e.value : null;
        } else {
            // React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
            val = e.target && e.target.value;
        }

        // Create a copy of the current homework state
        let _homework = { ...homework };

        // Set the new value based on the field being updated
        _homework[name] = val;

        // Finally, update the state
        setHomework(_homework);
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="Yeni Ödev" icon="pi pi-plus" severity="success" className=" mr-2" onClick={openNewAddDialog} />
                    <Button label="Sil" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedHomeworks || !(selectedHomeworks as any).length} />
                </div>
            </React.Fragment>
        );
    };

    const detailBodyTemplate = (rowData: Homework) => {
        return (
            <>
                <Button icon="pi pi-search" text onClick={() => handleHomeworkDetailClick(rowData)} />
            </>
        );
    };
    function handleHomeworkDetailClick(rowData: Homework) {
        router.push(`/homeworks/detail?classId=${rowData.classes[0]._id}&taskId=${rowData._id}`);
    }
    const actionBodyTemplate = (rowData: Homework) => {
        return (
            <>
                <Button icon="pi pi-search" text onClick={() => editHomework(rowData)} />
            </>
        );
    };
    const formatDate = (dateString: any) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0'); // Get day and pad with 0 if needed
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Get month and pad with 0 if needed
        const year = date.getFullYear(); // Get year
        return `${day}.${month}.${year}`; // Return formatted date
    };

    const classBodyTemplate = (rowData: Homework) => {
        return (
            <>
                {rowData.classes.length > 0 ? (
                    rowData.classes.map((classItem, index) => (
                        <span key={classItem._id}>
                            {classItem.level}/{classItem.name}
                            {index < rowData.classes.length - 1 ? ', ' : ''}
                        </span>
                    ))
                ) : (
                    <span>Sınıf Yok</span>
                )}
            </>
        );
    };

    const dateStartBodyTemplate = (rowData: Homework) => {
        return (
            <>
                <span>{formatDate(rowData.startDate)}</span>
            </>
        );
    };
    const descBodyTemplate = (rowData: Homework) => {
        return (
            <>
                <span>{rowData.content.length > 50 ? rowData.content.slice(0, 150) + '...' : rowData.content}</span>
            </>
        );
    };
    const dateEndBodyTemplate = (rowData: Homework) => {
        return (
            <>
                <span>{formatDate(rowData.endDate)}</span>
            </>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Ödevler</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText value={globalFilterValue1} onChange={onGlobalFilterChange1} placeholder="Ara" className="w-full" />
            </span>
        </div>
    );

    const homeworkDialogFooter = (
        <>
            {isReadOnly ? (
                <>
                    <Button label="Düzenle" icon="pi pi-pencil" text onClick={() => setIsReadOnly(false)} />
                </>
            ) : (
                <>
                    <Button label="İptal Et" icon="pi pi-times" text onClick={() => setIsReadOnly(true)} />
                    <Button label="Kaydet" icon="pi pi-check" text onClick={saveHomework} />
                </>
            )}
        </>
    );
    const homeworkAddDialogFooter = (
        <>
            <Button label="İptal Et" icon="pi pi-times" text onClick={() => hideDialogAddDialog()} />
            <Button label="Kaydet" icon="pi pi-check" text onClick={saveHomework} />
        </>
    );
    const deleteHomeworkDialogFooter = (
        <>
            <Button label="Hayır" icon="pi pi-times" text onClick={hideDeleteHomeworkDialog} />
            <Button label="Evet" icon="pi pi-check" text onClick={deleteHomework} />
        </>
    );
    const deleteHomeworksDialogFooter = (
        <>
            <Button label="Hayır" icon="pi pi-times" text onClick={hideDeleteHomeworksDialog} />
            <Button label="Evet" icon="pi pi-check" text onClick={deleteSelectedHomeworks} />
        </>
    );

    //sinif filtreme start
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
        console.log('Dropdown value:', dropdownValue);
        console.log('Original table values:', originalHomeworks);

        if (dropdownValue && dropdownValue.name === 'Genel') {
            setHomeworks(originalHomeworks);
        } else if (!dropdownValue) {
            setHomeworks(originalHomeworks);
        } else {
            const filteredStudents = originalHomeworks.filter((homew) => dropdownValue.name == homew.classes[0].name);
            console.log('Filtered students:', filteredStudents);
            setHomeworks(filteredStudents);
        }
    };

    useEffect(() => {
        handleClassFilter();
    }, [dropdownValue]);

    const sortedHomeworks = homeworks?.sort((a, b) => {
        const aDate = a.startDate ? new Date(a.startDate) : new Date(0);
        const bDate = b.startDate ? new Date(b.startDate) : new Date(0);

        return bDate.getTime() - aDate.getTime();
    });

    //sinif filtreme end
    return (
        <div className="grid crud-demo">
            <BackButton />
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>
                    <DataTable
                        ref={dt}
                        value={sortedHomeworks}
                        selection={selectedHomeworks}
                        onSelectionChange={(e) => setSelectedHomeworks(e.value as any)}
                        dataKey="_id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        showGridlines
                        filters={filters1}
                        filterDisplay="menu"
                        className="datatable-responsive "
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} homeworks"
                        globalFilter={globalFilter}
                        emptyMessage="Ev ödevi bulunamadı."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
                        <Column field="title" header="Ödev İsmi" sortable></Column>
                        <Column
                            field="classes"
                            style={{ textAlign: 'center' }}
                            body={classBodyTemplate}
                            header={() => (
                                <Dropdown
                                    value={dropdownValue}
                                    onChange={(e) => {
                                        setdropdownValue(e.value);
                                    }}
                                    options={dropdownValues}
                                    optionLabel="label"
                                    placeholder="Sınıf Seçiniz"
                                    className="w-full"
                                    filter
                                />
                            )}
                        />
                        <Column field="content" body={descBodyTemplate} header="Açıklama"></Column>
                        <Column field="startDate" body={dateStartBodyTemplate} header="Başlangıç Tarihi" sortable></Column>
                        <Column field="endDate" body={dateEndBodyTemplate} header="Bitiş Tarihi" sortable></Column>
                        <Column field="effort" header="Efor" sortable></Column>
                        <Column body={actionBodyTemplate} dataType="boolean" bodyClassName="text-center" style={{ width: '1%' }} header="Görüntüle"></Column>
                        <Column body={detailBodyTemplate} dataType="boolean" bodyClassName="text-center" style={{ width: '1%' }} header="Kontrol"></Column>
                    </DataTable>
                    <Dialog visible={homeworkAddDialog} style={{ width: '450px' }} header="Ödev Detayları" modal className="p-fluid" footer={homeworkAddDialogFooter} onHide={hideDialogAddDialog}>
                        {/* Homework Title */}
                        <div className="field">
                            <label htmlFor="title" className="font-bold">
                                Ödev İsmi
                            </label>
                            <InputText id="title" value={homework.title} onChange={(e) => onInputChange(e, 'title')} required autoFocus className={classNames({ 'p-invalid': submitted && !homework.title })} />
                            {submitted && !homework.title && <small className="p-invalid">İsim Zorunludur</small>}
                        </div>

                        {/* Start Date */}
                        <div className="field">
                            <label htmlFor="startDate" className="font-bold">
                                Ödev Başlangıç Tarihi
                            </label>
                            <InputText
                                id="startDate"
                                value={homework.startDate ? new Date(homework.startDate).toISOString().split('T')[0] : ''} // Default to empty if invalid
                                onChange={(e) => onInputChange(e, 'startDate')}
                                required
                                type="date"
                                className={classNames({ 'p-invalid': submitted && !homework.startDate })}
                            />
                            {submitted && !homework.startDate && <small className="p-invalid">Başlangıç Tarihi Zorunludur</small>}
                        </div>

                        {/* End Date */}
                        <div className="field">
                            <label htmlFor="endDate" className="font-bold">
                                Ödev Bitiş Tarihi
                            </label>
                            <InputText
                                id="endDate"
                                value={homework.endDate} // Default to empty if invalid
                                onChange={(e) => onInputChange(e, 'endDate')}
                                required
                                type="date"
                                className={classNames({ 'p-invalid': submitted && !homework.endDate })}
                            />
                            {submitted && !homework.endDate && <small className="p-invalid">Bitiş Tarihi Zorunludur</small>}
                        </div>

                        {/* Description */}
                        <div className="field">
                            <label htmlFor="description" className="font-bold">
                                Açıklama
                            </label>
                            <InputTextarea id="description" value={homework.content} onChange={(e) => onInputChange(e, 'content')} required rows={3} className={classNames({ 'p-invalid': submitted && !homework.content })} cols={20} />
                            {submitted && !homework.content && <small className="p-invalid">Açıklama zorunludur</small>}
                        </div>

                        {/* Effort */}
                        <div className="field">
                            <label htmlFor="effort" className="font-bold">
                                Efor (saat)
                            </label>
                            <InputNumber
                                id="effort"
                                value={homework.effort ? Number(homework.effort) : null} // Convert effort to number or set to null
                                onChange={(e: InputNumberChangeEvent) => onInputChange(e, 'effort')}
                                required
                            />
                        </div>

                        {/* Class Selection */}
                        <div className="field">
                            <MultiSelect
                                multiple
                                value={dropdownValueClasses}
                                onChange={(e) => setDropdownValueClasses(e.value)}
                                options={dropdownValuesSchools}
                                optionLabel="label"
                                placeholder="Sınıf Seçiniz"
                                readOnly={isReadOnly}
                                className={classNames({ 'p-invalid': submitted && dropdownValueClasses.length === 0 })}
                            />
                            {submitted && dropdownValueClasses.length === 0 && <small className="p-invalid">Sınıf zorunludur</small>}
                        </div>

                        {/* File Upload */}
                        <div className="field">
                            <input type="file" id="fileUpload" accept=".txt" className="hidden" onChange={(e) => handleImageUpload(e)} />

                            {!selectedFile && (
                                <label
                                    htmlFor="fileUpload"
                                    style={{ borderRadius: '10px' }}
                                    className="rounded-full text-lg inline-block px-6 py-4 bg-indigo-500 text-white font-bold text-sm leading-tight rounded-full shadow-md hover:bg-indigo-600 hover:shadow-lg focus:bg-indigo-600 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-indigo-700 active:shadow-lg transition duration-150 ease-in-out cursor-pointer"
                                >
                                    Dosya Yükle
                                </label>
                            )}

                            <div className="mt-3">
                                {selectedFile && <label className="text-green-600">Dosya yüklendi: {selectedFile.name}</label>}
                                {selectedFile && (
                                    <label className="text-red-600 cursor-pointer" onClick={() => setSelectedFile(null)}>
                                        <br />
                                        Dosya Sil
                                    </label>
                                )}
                            </div>
                        </div>
                    </Dialog>

                    <Dialog visible={homeworkDialog} style={{ width: '450px' }} header="Ödev Detayları" modal className="p-fluid" footer={homeworkDialogFooter} onHide={hideDialog}>
                        {isReadOnly ? (
                            <>
                                <div className="field">
                                    <label htmlFor="name" className="font-bold">
                                        Ödev İsmi
                                    </label>
                                    <p>{homework.title}</p>
                                </div>
                                <div className="field">
                                    <label htmlFor="name" className="font-bold">
                                        Ödev Başlangıç Tarihi
                                    </label>
                                    <p>{formatDate(homework.startDate)}</p>
                                </div>
                                <div className="field">
                                    <label htmlFor="name" className="font-bold">
                                        Ödev Bitiş Tarihi
                                    </label>
                                    <p>{formatDate(homework.endDate)}</p>
                                </div>
                                {/*}  <div className="field">
                                <label htmlFor="branch">Branş</label>
                                <p>{homework.branch}</p>
                            </div>{*/}
                                <div className="field">
                                    <label htmlFor="description" className="font-bold">
                                        Açıklama
                                    </label>
                                    <p>{homework.content}</p>
                                </div>
                                <div className="field">
                                    <label htmlFor="description" className="font-bold">
                                        Sınıf
                                    </label>
                                    {homework.classes.map((classItem, index) => (
                                        <p key={classItem._id}>
                                            {classItem.level}/{classItem.name}
                                            {index < homework.classes.length - 1 ? ', ' : ''}
                                        </p>
                                    ))}
                                </div>
                                <div className="field">
                                    <label htmlFor="name" className="font-bold">
                                        Efor (saat)
                                    </label>
                                    <p>{homework.effort}</p>
                                </div>
                                <div className="field">
                                    {homework.files && Array.isArray(homework.files) && (
                                        <label htmlFor="name" className="font-bold">
                                            Dosya İndir
                                        </label>
                                    )}
                                    <p>
                                        {homework.files &&
                                            Array.isArray(homework.files) &&
                                            homework.files.map((file) => {
                                                return (
                                                    <div key={file.id}>
                                                        <a href="#" onClick={() => handDownload(`download/task/${file.id}-${file.name}`, file.name)} rel="noopener noreferrer">
                                                            {file.name}
                                                        </a>{' '}
                                                        {/* Assuming file has a 'url' property */}
                                                    </div>
                                                );
                                            })}
                                    </p>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="field">
                                    <label htmlFor="name" className="font-bold">
                                        Ödev İsmi
                                    </label>
                                    <InputText
                                        id="title"
                                        value={homework.title}
                                        onChange={(e) => onInputChange(e, 'title')}
                                        required
                                        autoFocus
                                        readOnly={isReadOnly}
                                        className={classNames({
                                            'p-invalid': submitted && !homework.title
                                        })}
                                    />
                                    {submitted && !homework.title && <small className="p-invalid">İsim Zorunludur</small>}
                                </div>
                                <div className="field">
                                    <label htmlFor="name" className="font-bold">
                                        Ödev Başlangıç Tarihi
                                    </label>
                                    <InputText
                                        id="startDate"
                                        value={homework.startDate ? new Date(homework.startDate).toISOString().split('T')[0] : new Date().toISOString()}
                                        onChange={(e) => onInputChange(e, 'startDate')}
                                        readOnly={isReadOnly}
                                        required
                                        type="date"
                                        className={classNames({
                                            'p-invalid': submitted && !homework.startDate
                                        })}
                                    />

                                    {submitted && !homework.startDate && <small className="p-invalid">Başlangıç Tarihi Zorunludur</small>}
                                </div>
                                <div className="field">
                                    <label htmlFor="name" className="font-bold">
                                        Ödev Bitiş Tarihi
                                    </label>
                                    <InputText
                                        id="endDate"
                                        value={new Date(homework.endDate).toISOString().split('T')[0]}
                                        onChange={(e) => onInputChange(e, 'endDate')}
                                        required
                                        type="date"
                                        readOnly={isReadOnly}
                                        className={classNames({
                                            'p-invalid': submitted && !homework.endDate
                                        })}
                                    />
                                    {submitted && !homework.endDate && <small className="p-invalid">Bitiş tarihi Zorunludur</small>}
                                </div>
                                <div className="field">
                                    <label htmlFor="description" className="font-bold">
                                        Açıklama
                                    </label>
                                    <InputTextarea id="description" value={homework.content} onChange={(e) => onInputChange(e, 'content')} required rows={3} cols={20} readOnly={isReadOnly} />
                                </div>
                                <div className="field">
                                    <MultiSelect
                                        multiple
                                        value={dropdownValueClasses}
                                        onChange={(e) => setDropdownValueClasses(e.value)}
                                        options={dropdownValuesSchools}
                                        optionLabel="label"
                                        required
                                        placeholder="Sınıf Seçiniz"
                                        className="w-full"
                                        readOnly={isReadOnly}
                                    />
                                </div>
                                <div className="field">
                                    <label className="mb-3">Dosya Yükle</label>
                                    <FileUpload className={isReadOnly ? 'hidden' : ''} mode="basic" name="demo[]" url="/api/upload" accept="image/*" maxFileSize={1000000} onUpload={onUpload} chooseLabel="Dosya Seç" />
                                </div>
                            </>
                        )}
                    </Dialog>
                    <Dialog visible={deleteHomeworkDialog} style={{ width: '450px' }} header="Onayla" modal footer={deleteHomeworkDialogFooter} onHide={hideDeleteHomeworkDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {homework && (
                                <span>
                                    Silmek istediğinize emin misiniz? <b>{homework.title}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>
                    <Dialog visible={deleteHomeworksDialog} style={{ width: '450px' }} header="Onayla" modal footer={deleteHomeworksDialogFooter} onHide={hideDeleteHomeworksDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {homework && <span>Silmek istediğinize emin misiniz?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default Crud;
