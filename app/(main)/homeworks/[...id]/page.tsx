/* eslint-disable @next/next/no-img-element */
'use client';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable, DataTableFilterMeta } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { FileUpload } from 'primereact/fileupload';
import { InputNumber, InputNumberValueChangeEvent } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { RadioButton, RadioButtonChangeEvent } from 'primereact/radiobutton';
import { Rating } from 'primereact/rating';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import React, { useEffect, useRef, useState } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { ProductService } from '@/demo/service/ProductService';
import { Demo } from '@/types';
import { useRouter, useSearchParams } from 'next/navigation';
import BackButton from '@/demo/components/BackButton';
import { HomeworksService } from '@/demo/service/HomeworkServices';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { HomeworkDetail } from '@/models/homework-detail';
import { Homework } from '@/models/homework';

/* @todo Used 'as any' for types here. Will fix in next version due to onSelectionChange event type issue. */
const Crud = () => {
    let emptyProduct: Demo.Product = {
        id: '',
        name: '',
        image: '',
        description: '',
        category: '',
        price: 0,
        quantity: 0,
        rating: 0,
        inventoryStatus: 'INSTOCK'
    };

    const [products, setProducts] = useState<HomeworkDetail[]>([]);
    const [taskDetail, setTaskDetail] = useState<Homework>();
    const [productDialog, setProductDialog] = useState(false);
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
    const [product, setProduct] = useState<Demo.Product>(emptyProduct);
    const [selectedProducts, setSelectedProducts] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);
    const [dropdownValue, setdropdownValue] = useState(null);
    const router = useRouter();
    const [filters1, setFilters1] = useState<DataTableFilterMeta>({});
    const [globalFilterValue1, setGlobalFilterValue1] = useState('');
    const searchParams = useSearchParams();
    const taskId = searchParams.get("taskId");
    const classId = searchParams.get("classId");

    useEffect(() => {
        async function fetchHomeworks() {
            if (classId && taskId) {
                try {
                    const data = await HomeworksService.getHomeWorkDetail({ classId, taskId });
                    setProducts(data);
                } catch (error) {
                    console.error('Error fetching homework details:', error);

                }
            } else {
                console.error('classId or taskId is null');
                // Handle the case where classId or taskId is null
            }
        }
        fetchHomeworks();
    }, []);

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

                setTaskDetail(sortedData.find(x => x._id === taskId));
                console.log("data", sortedData.find(x => x._id === taskId));

            } catch (error) {
                console.error("Failed to fetch homeworks:", error);
            }
        };

        fetchHomeworks();
        initFilters1();
    }, []);


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


    const nameBodyTemplate = (rowData: Demo.Product) => {
        return (
            <>
                <span className="p-column-title">Name</span>
                {rowData.name} {rowData.surname}
            </>
        );
    };




    const statusBodyTemplate = (rowData: any) => {
        return (
            <>
                <span className="p-column-title">Durum</span>
                <span className={`product-badge status-${rowData.tasks[0].state === 2 ? "instock" : rowData.tasks[0].state === 1 ? "lowstock" : "outofstock"}`}>{rowData.tasks[0].state === 1 ? "Devam Ediyor" : rowData.tasks[0].state === 2 ? "Tamamlandı" : "Tamamlanmadı"}</span>
            </>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Ödev Kontrolü</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.currentTarget.value)} placeholder="Ara..." />
            </span>
        </div>
    );


    const handleSearchClick = (rowData: any) => {
        router.push(`/students/${rowData._id}`);
    };

    const searchTemplate = (rowData: Demo.Student) => {
        return <Button icon="pi pi-search" text onClick={() => handleSearchClick(rowData)} />
    };
    return (
        <div className="grid crud-demo">
            <BackButton />
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <div className="grid mb-5">
                        <div className="col-12 mb-2 lg:col-6 lg:mb-0">
                            <div className="w-full">
                                <p>Ödev Adı: </p>

                                <Dropdown
                                    disabled
                                    optionLabel="name"
                                    placeholder={taskDetail?.title}
                                    className="w-full" />
                            </div>
                        </div>
                        <div className="col-12 mb-2 lg:col-6 lg:mb-0">
                            <p> Sınıf: </p>

                            <Dropdown
                                disabled
                                optionLabel="name"
                                placeholder={taskDetail?.classes[0].level + "/" + taskDetail?.classes[0].name}
                                className="w-full" />
                        </div>
                    </div>
                    {products&&
                    <DataTable
                        ref={dt}
                        value={products.length > 0 ? products : null}
                        showGridlines
                        selection={selectedProducts}
                        onSelectionChange={(e) => setSelectedProducts(e.value as any)}
                        dataKey="id"
                        paginator
                        filters={filters1}
                        filterDisplay="menu"
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
                        globalFilter={globalFilter}
                        emptyMessage="Veri bulunamadı"
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column field="name" body={nameBodyTemplate} header="İsim"></Column>
                        <Column field="status" header="Ödev Durumu" body={statusBodyTemplate} sortable></Column>
                        <Column field="verified" header="Görüntüle" body={searchTemplate} dataType="boolean" bodyClassName="text-center" style={{ width: '1%' }} />
                    </DataTable>
                }
                </div>
            </div>
        </div>
    );
};

export default Crud;
