/* eslint-disable @next/next/no-img-element */
'use client';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { InputNumberValueChangeEvent } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { RadioButtonChangeEvent } from 'primereact/radiobutton';
import { Rating } from 'primereact/rating';
import { Toast } from 'primereact/toast';
import React, { useEffect, useRef, useState } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { ProductService } from '@/demo/service/ProductService';
import { ChartDataState, ChartOptionsState, Demo } from '@/types';
import { Steps } from 'primereact/steps';
import { ChartData, ChartOptions } from 'chart.js';
import { Chart } from 'primereact/chart';
import { useContext } from 'react';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { MultiSelect } from 'primereact/multiselect';
import { ProgressBar } from 'primereact/progressbar';
import { ExamClasseservice } from '@/demo/service/ExamClassesService';
import BackButton from '@/demo/components/BackButton';
import mockdata from './mockdata.json'

interface InputValue {
    name: string;
    code: string;
}
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
    const [lessons, setLessons] = useState(null);
    const [products, setProducts] = useState(null);
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
    const [examDropdownValue, setExamDropdownValue] = useState(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const wizardItems = [{ label: 'Sınıf' }, { label: 'Branş' }, { label: 'Konu' }, { label: "Öğrenci" }];
    const [lineOptions, setLineOptions] = useState<ChartOptions>({});
    const documentStyle = getComputedStyle(document.documentElement);

    useEffect(() => {
        console.log(mockdata);
    }, [])

    const lineData: ChartData = {
        labels: ['İlk Adım - 1', 'Siha - 1'],
        datasets: [
            {
                label: '8-A Sınıfı',
                data: [363.9, 320, 212, 400],
                fill: false,
                backgroundColor: '#2f4860',
                borderColor: '#2f4860',
                tension: 0.4
            },
            {
                label: '8-B Sınıfı',
                data: [100.9, 321, 212, 400],
                fill: false,
                backgroundColor: '#00bb7e',
                borderColor: '#00bb7e',
                tension: 0.4
            }
        ]
    };

    const dropdownValues: InputValue[] = [
        { name: "Genel", code: "NY" },
        { name: "8/A", code: "RM" },
        { name: "8/B", code: "LDN" },
        { name: "8/C", code: "IST" },
        { name: "8/D", code: "PRS" },
    ];

    const examDropdownValues: InputValue[] = [
        { name: "Genel", code: "NY" },
        { name: "Deneme 1", code: "NY" },
        { name: "Deneme 2", code: "NY" },
        { name: "Deneme 3", code: "NY" },
        { name: "Deneme 4", code: "NY" },
        { name: "Deneme 5", code: "NY" },

    ];

    const [options, setOptions] = useState<ChartOptionsState>({});
    const [data, setChartData] = useState<ChartDataState>({});
    const { layoutConfig } = useContext(LayoutContext);

    useEffect(() => {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color') || '#495057';
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary') || '#6c757d';
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border') || '#dfe7ef';
        const barData: ChartData = {
            labels: ['Matematik', 'Türkçe', 'Fen', 'İnkilap'],
            datasets: [
                {
                    label: '8/A',
                    backgroundColor: documentStyle.getPropertyValue('--primary-500') || '#6366f1',
                    borderColor: documentStyle.getPropertyValue('--primary-500') || '#6366f1',
                    data: [65, 59, 80, 81, 56, 55, 40]
                },
                {
                    label: '8/B',
                    backgroundColor: documentStyle.getPropertyValue('--primary-200') || '#bcbdf9',
                    borderColor: documentStyle.getPropertyValue('--primary-200') || '#bcbdf9',
                    data: [28, 48, 40, 19, 86, 27, 90]
                }
            ]
        };

        const barOptions: ChartOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary,
                        font: {
                            weight: '500'
                        }
                    },
                    grid: {
                        display: false
                    },
                    border: {
                        display: false
                    }
                },
                y: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder
                    },
                    border: {
                        display: false
                    }
                }
            }
        };

        const pieData: ChartData = {
            labels: ['A', 'B', 'C'],
            datasets: [
                {
                    data: [540, 325, 702],
                    backgroundColor: [documentStyle.getPropertyValue('--indigo-500') || '#6366f1', documentStyle.getPropertyValue('--purple-500') || '#a855f7', documentStyle.getPropertyValue('--teal-500') || '#14b8a6'],
                    hoverBackgroundColor: [documentStyle.getPropertyValue('--indigo-400') || '#8183f4', documentStyle.getPropertyValue('--purple-400') || '#b975f9', documentStyle.getPropertyValue('--teal-400') || '#41c5b7']
                }
            ]
        };



        const pieOptions: ChartOptions = {
            plugins: {
                legend: {
                    labels: {
                        usePointStyle: true,
                        color: textColor
                    }
                }
            }
        };

        const lineData: ChartData = {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [
                {
                    label: 'First Dataset',
                    data: [65, 59, 80, 81, 56, 55, 40],
                    fill: false,
                    backgroundColor: documentStyle.getPropertyValue('--primary-500') || '#6366f1',
                    borderColor: documentStyle.getPropertyValue('--primary-500') || '#6366f1',
                    tension: 0.4
                }
            ]
        };

        const lineOptions: ChartOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder
                    },
                    border: {
                        display: false
                    }
                },
                y: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder
                    },
                    border: {
                        display: false
                    }
                }
            }
        };

        const polarData: ChartData = {
            datasets: [
                {
                    data: [11, 16, 7, 3],
                    backgroundColor: [
                        documentStyle.getPropertyValue('--indigo-500') || '#6366f1',
                        documentStyle.getPropertyValue('--purple-500') || '#a855f7',
                        documentStyle.getPropertyValue('--teal-500') || '#14b8a6',
                        documentStyle.getPropertyValue('--orange-500') || '#f97316'
                    ],
                    label: 'My dataset'
                }
            ],
            labels: ['Indigo', 'Purple', 'Teal', 'Orange']
        };

        const polarOptions: ChartOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
                r: {
                    grid: {
                        color: surfaceBorder
                    }
                }
            }
        };

        const radarData: ChartData = {
            labels: ['Eating', 'Drinking', 'Sleeping', 'Designing', 'Coding', 'Cycling', 'Running'],
            datasets: [
                {
                    label: 'My First dataset',
                    borderColor: documentStyle.getPropertyValue('--indigo-400') || '#8183f4',
                    pointBackgroundColor: documentStyle.getPropertyValue('--indigo-400') || '#8183f4',
                    pointBorderColor: documentStyle.getPropertyValue('--indigo-400') || '#8183f4',
                    pointHoverBackgroundColor: textColor,
                    pointHoverBorderColor: documentStyle.getPropertyValue('--indigo-400') || '#8183f4',
                    data: [65, 59, 90, 81, 56, 55, 40]
                },
                {
                    label: 'My Second dataset',
                    borderColor: documentStyle.getPropertyValue('--purple-400') || '#b975f9',
                    pointBackgroundColor: documentStyle.getPropertyValue('--purple-400') || '#b975f9',
                    pointBorderColor: documentStyle.getPropertyValue('--purple-400') || '#b975f9',
                    pointHoverBackgroundColor: textColor,
                    pointHoverBorderColor: documentStyle.getPropertyValue('--purple-400') || '#b975f9',
                    data: [28, 48, 40, 19, 96, 27, 100]
                }
            ]
        };

        const radarOptions: ChartOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
                r: {
                    grid: {
                        color: textColorSecondary
                    }
                }
            }
        };

        setOptions({
            barOptions,
            pieOptions,
            lineOptions,
            polarOptions,
            radarOptions
        });
        setChartData({
            barData,
            pieData,
            lineData,
            polarData,
            radarData
        });
    }, [layoutConfig]);

    const onUpload = () => {
        toast.current?.show({
            severity: 'info',
            summary: 'Başarılı',
            detail: 'File Uploaded',
            life: 3000
        });
    };

    useEffect(() => {
        ProductService.getProducts().then((data) => setProducts(data as any));
        ExamClasseservice.getLessonsRatio().then((data) => setLessons(data as any));

    }, []);

    const formatCurrency = (value: number) => {
        return value.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD'
        });
    };

    const openNew = () => {
        setProduct(emptyProduct);
        setSubmitted(false);
        setProductDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setProductDialog(false);
    };

    const hideDeleteProductDialog = () => {
        setDeleteProductDialog(false);
    };

    const hideDeleteProductsDialog = () => {
        setDeleteProductsDialog(false);
    };

    const saveProduct = () => {
        setSubmitted(true);

        if (product.name.trim()) {
            let _products = [...(products as any)];
            let _product = { ...product };
            if (product.id) {
                const index = findIndexById(product.id);

                _products[index] = _product;
                toast.current?.show({
                    severity: 'success',
                    summary: 'Başarılı',
                    detail: 'Güncellendi',
                    life: 3000
                });
            } else {
                _product.id = createId();
                _product.image = 'product-placeholder.svg';
                _products.push(_product);
                toast.current?.show({
                    severity: 'success',
                    summary: 'Başarılı',
                    detail: 'Eklendi',
                    life: 3000
                });
            }

            setProducts(_products as any);
            setProductDialog(false);
            setProduct(emptyProduct);
        }
    };

    const editProduct = (product: Demo.Product) => {
        setProduct({ ...product });
        setProductDialog(true);
    };

    const confirmDeleteProduct = (product: Demo.Product) => {
        setProduct(product);
        setDeleteProductDialog(true);
    };

    const deleteProduct = () => {
        let _products = (products as any)?.filter((val: any) => val.id !== product.id);
        setProducts(_products);
        setDeleteProductDialog(false);
        setProduct(emptyProduct);
        toast.current?.show({
            severity: 'success',
            summary: 'Başarılı',
            detail: 'Kaldırıldı',
            life: 3000
        });
    };

    const findIndexById = (id: string) => {
        let index = -1;
        for (let i = 0; i < (products as any)?.length; i++) {
            if ((products as any)[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    };
    const activityBodyTemplate = (rowData: Demo.Customer) => {
        return <ProgressBar value={50} showValue={false} style={{ height: '.5rem' }}></ProgressBar>;
    };
    const createId = () => {
        let id = '';
        let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    };

    const exportCSV = () => {
        dt.current?.exportCSV();
    };

    const confirmDeleteSelected = () => {
        setDeleteProductsDialog(true);
    };

    const deleteSelectedProducts = () => {
        let _products = (products as any)?.filter((val: any) => !(selectedProducts as any)?.includes(val));
        setProducts(_products);
        setDeleteProductsDialog(false);
        setSelectedProducts(null);
        toast.current?.show({
            severity: 'success',
            summary: 'Başarılı',
            detail: 'Başarıyla Silindi',
            life: 3000
        });
    };

    const onCategoryChange = (e: RadioButtonChangeEvent) => {
        let _product = { ...product };
        _product['category'] = e.value;
        setProduct(_product);
    };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, name: string) => {
        const val = (e.target && e.target.value) || '';
        let _product = { ...product };
        _product[`${name}`] = val;

        setProduct(_product);
    };

    const onInputNumberChange = (e: InputNumberValueChangeEvent, name: string) => {
        const val = e.value || 0;
        let _product = { ...product };
        _product[`${name}`] = val;

        setProduct(_product);
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="grid">

                    <div className="col-12 mb-2 lg:col-6 lg:mb-0">
                        <div className="w-full">
                            <Dropdown
                                value={dropdownValue}
                                onChange={(e) => setdropdownValue(e.value)}
                                options={dropdownValues}
                                optionLabel="name"
                                placeholder="Deneme Seçiniz"
                                className="w-full"
                                filter
                            />
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    };



    const codeBodyTemplate = (rowData: Demo.Product) => {
        return (
            <>
                <span className="p-column-title">Code</span>
                {rowData.code}
            </>
        );
    };

    const nameBodyTemplate = (rowData: Demo.Product) => {
        return (
            <>
                <span className="p-column-title">Name</span>
                {rowData.name}
            </>
        );
    };

    const imageBodyTemplate = (rowData: Demo.Product) => {
        return (
            <>
                <span className="p-column-title">Image</span>
                <img src={`/demo/images/product/${rowData.image}`} alt={rowData.image} className="shadow-2" width="100" />
            </>
        );
    };

    const priceBodyTemplate = (rowData: Demo.Product) => {
        return (
            <>
                <span className="p-column-title">Price</span>
                {formatCurrency(rowData.price as number)}
            </>
        );
    };

    const categoryBodyTemplate = (rowData: Demo.Product) => {
        return (
            <>
                <span className="p-column-title">Category</span>
                {rowData.category}
            </>
        );
    };

    const ratingBodyTemplate = (rowData: Demo.Product) => {
        return (
            <>
                <span className="p-column-title">Reviews</span>
                <Rating value={rowData.rating} readOnly cancel={false} />
            </>
        );
    };

    const statusBodyTemplate = (rowData: Demo.Product) => {
        return (
            <>
                <span className="p-column-title">Status</span>
                <span className={`product-badge status-${rowData.inventoryStatus?.toLowerCase()}`}>{rowData.inventoryStatus}</span>
            </>
        );
    };

    const actionBodyTemplate = (rowData: Demo.Product) => {
        return (
            <>
                <Button icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => editProduct(rowData)} />
                <Button icon="pi pi-trash" rounded severity="warning" onClick={() => confirmDeleteProduct(rowData)} />
            </>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Ödevler</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.currentTarget.value)} placeholder="Ara..." />
            </span>
        </div>
    );

    const productDialogFooter = (
        <>
            <Button label="İptal Et" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Kaydet" icon="pi pi-check" text onClick={saveProduct} />
        </>
    );
    const deleteProductDialogFooter = (
        <>
            <Button label="Hayır" icon="pi pi-times" text onClick={hideDeleteProductDialog} />
            <Button label="Evet" icon="pi pi-check" text onClick={deleteProduct} />
        </>
    );
    const deleteProductsDialogFooter = (
        <>
            <Button label="Hayır" icon="pi pi-times" text onClick={hideDeleteProductsDialog} />
            <Button label="Evet" icon="pi pi-check" text onClick={deleteSelectedProducts} />
        </>
    );
    const clearFilters = () => {
        setdropdownValue(null);
        setExamDropdownValue(null);

        setSelectedProducts(null);
    };

    return (
        <div className="grid crud-demo">
            <BackButton />
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <div className="grid">
                        <div className="col-12 mb-2lg:mb-0 px-8">
                            <div className="w-full mb-0  px-0 md:px-8 py-6">
                                <Steps model={wizardItems} activeIndex={activeIndex} onSelect={(e) => setActiveIndex(e.index)} readOnly={false} />
                            </div>
                        </div>
                        <div className="col-12 mb-2 lg:col-6">
                            <div className="grid">
                                <div className="col-10 sm:col-10  lg:col-11">
                                    <MultiSelect
                                        value={dropdownValue}
                                        onChange={(e) => setdropdownValue(e.value)}
                                        options={dropdownValues}
                                        optionLabel="name"
                                        placeholder="Sınıf Seçiniz"
                                        className="w-full"
                                        filter
                                    />
                                </div>
                                <div className="col-2 sm:col-2 lg:col-1">
                                    <div className="flex justify-content-between">
                                        <Button type="button" icon="pi pi-filter-slash" outlined onClick={clearFilters} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-12  lg:col-6 ">
                            <div className="w-full">
                                <Dropdown
                                    value={examDropdownValue}
                                    onChange={(e) => setExamDropdownValue(e.value)}
                                    options={examDropdownValues}
                                    optionLabel="name"
                                    placeholder="Deneme seçiniz"
                                    className="w-full"
                                    filter
                                />
                            </div>
                        </div>
                    </div>
                    {activeIndex === 0 ? (
                        <>
                            <div className="grid">
                                <div className="col-12 xl:col-6">
                                    <div className="card">
                                        <Chart type="line" data={lineData} options={lineOptions} />
                                    </div>
                                </div>
                                {dropdownValue ? (
                                    <div className="col-12 xl:col-6">
                                        <div className="card">
                                            <Chart type="bar" data={data.barData} options={options.barOptions}></Chart>
                                        </div>
                                    </div>
                                ) : null}
                            </div>
                        </>
                    ) : activeIndex === 1 ? (
                        <div className="col">
                            <div className="card">
                                <div className="grid">
                                    <div className="col-12  mb-2 lg:mb-0 pl-4">
                                        <DataTable
                                            ref={dt}
                                            value={lessons}
                                            selection={selectedProducts}
                                            onSelectionChange={(e) => setSelectedProducts(e.value as any)}
                                            dataKey="id"
                                            paginator
                                            rows={10}
                                            rowsPerPageOptions={[5, 10, 25]}
                                            className="datatable-responsive"
                                            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                                            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
                                            globalFilter={globalFilter}
                                            emptyMessage="Veri bulunamadı"
                                            responsiveLayout="scroll"
                                        >
                                            <Column field="lesson" header="Dersler"  ></Column>
                                            <Column field="progress" header="Doğru" sortable  ></Column>
                                            <Column field="progress" header="Yanlış" sortable  ></Column>
                                            <Column field="progress" header="Boş" sortable  ></Column>
                                            <Column field="progress" header="Net" sortable  ></Column>
                                            <Column field="progress" header="Başarı Oranı" sortable  ></Column>
                                            <Column field="successRatio" header="Başarı Oranı" body={activityBodyTemplate} ></Column>
                                            <Column field="verified" header="Görüntüle" dataType="boolean" bodyClassName="text-center" style={{ width: '1%' }} body={() => (
                                                <>
                                                    <Button icon="pi pi-search" onClick={() => setActiveIndex(2)} text />
                                                </>
                                            )} />
                                        </DataTable>

                                    </div>
                                </div>
                            </div>
                        </div>
                    ) :
                        activeIndex === 2 ? (
                            <div className="col">
                                <div className="card">
                                    <div className="grid">
                                        <div className="col-12 xl:col-12 mb-2 lg:mb-0 pl-4">
                                            <DataTable
                                                ref={dt}
                                                value={lessons}
                                                selection={selectedProducts}
                                                onSelectionChange={(e) => setSelectedProducts(e.value as any)}
                                                dataKey="id"
                                                paginator
                                                rows={10}
                                                rowsPerPageOptions={[5, 10, 25]}
                                                className="datatable-responsive"
                                                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                                                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
                                                globalFilter={globalFilter}
                                                emptyMessage="Veri bulunamadı"
                                                responsiveLayout="scroll"
                                            >
                                                <Column field="subject" header="Konu" sortable  ></Column>
                                                <Column field="progress" header="Doğru" sortable  ></Column>
                                                <Column field="progress" header="Yanlış" sortable  ></Column>
                                                <Column field="progress" header="Boş" sortable  ></Column>
                                                <Column field="progress" header="Başarı Oranı" sortable  ></Column>
                                                <Column field="verified" header="Görüntüle" dataType="boolean" style={{ width: '1%' }} bodyClassName="text-center" body={() => (
                                                    <>
                                                        <Button icon="pi pi-search" text />
                                                    </>
                                                )} />
                                            </DataTable>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : activeIndex === 3 ? (
                            <div className="col">
                                <div className="card">
                                    <div className="grid">
                                        <div className="col-12 xl:col-12 mb-2 lg:mb-0 pl-4">
                                            <DataTable
                                                ref={dt}
                                                value={products}
                                                selection={selectedProducts}
                                                onSelectionChange={(e) => setSelectedProducts(e.value as any)}
                                                dataKey="id"
                                                paginator
                                                rows={10}
                                                rowsPerPageOptions={[5, 10, 25]}
                                                className="datatable-responsive"
                                                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                                                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
                                                globalFilter={globalFilter}
                                                emptyMessage="Veri bulunamadı"
                                                responsiveLayout="scroll"
                                            >
                                                <Column field="code" header="Sınıf" body={codeBodyTemplate} ></Column>
                                                <Column field="name" header="Konu" body={nameBodyTemplate} ></Column>
                                                <Column field="name" header="Başarı Oranı" sortable body={priceBodyTemplate} ></Column>
                                                <Column field="verified" header="Görüntüle" dataType="boolean" style={{ width: '1%' }} bodyClassName="text-center" body={() => (
                                                    <>
                                                        <Button icon="pi pi-search" text />
                                                    </>
                                                )} />
                                            </DataTable>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (<></>)}

                </div>
            </div>
        </div>
    );
};

export default Crud;
