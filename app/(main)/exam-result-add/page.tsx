/* eslint-disable @next/next/no-img-element */
'use client';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable, DataTableFilterMeta } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import React, { useEffect, useRef, useState } from 'react';
import { Dropdown } from 'primereact/dropdown';
import BackButton from '@/demo/components/BackButton';
import { ExamResultAddService } from '@/demo/service/ExamResultAdd';
import { Exam } from '@/models/exam';
import { Publisher, PublisherExam, Type } from '@/models/publishers-and-types';
import { getAuthToken } from '@/utils/util';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import Link from 'next/link';


/* @todo Used 'as any' for types here. Will fix in next version due to onSelectionChange event type issue. */
const Crud = () => {
    let emptyProduct: Exam = {
        _id: "",
        name: "",
        createdAt: "",
        publisher: {
            _id: "",
            name: "",
            examCount: 0,
            types: []
        },
        type: []


    };

    let emptyPublisher = {
        _id: "",
        name: "",
        examCount: 0,
        types: []
    };
    const [products, setProducts] = useState<PublisherExam[]>([]);
    const [productDialog, setProductDialog] = useState(false);
    const [addExamInsideDialog, setExamInsideDialog] = useState(false);
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
    const [product, setProduct] = useState<PublisherExam>(emptyProduct);
    const [selectedProducts, setSelectedProducts] = useState<PublisherExam[]>([]);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);
    const [dropdownValues, setDropdownValues] = useState<Type[]>([]);
    const [dropdownValue, setDropdownValue] = useState<Type | null>(null);
    const [publishersDropdown, setPublishersDropdown] = useState<Publisher[]>([]);
    const [selectedPublisher, setSelectedPublisher] = useState<Publisher>();
    const [selectedFile, setSelectedFile] = useState<any>();

    const [selectedAddExam, setSelectedAddExam] = useState<Exam>();
    const [selectedAddPublisher, setSelectedAddPublisher] = useState<Publisher>();
    const [selectedAddFile, setSelectedAddFile] = useState<any>();
    const [dropdownAddValues, setDropdownAddValues] = useState<Type[]>([]);
    const [dropdownAddValue, setDropdownAddValue] = useState<Type>();
    const [success, setSuccess] = useState<boolean>();
    const [filters1, setFilters1] = useState<DataTableFilterMeta>({});
    const [globalFilterValue1, setGlobalFilterValue1] = useState('');

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

    const onUpload = async (event: any) => {
        const file = event.files[0];
        console.log("file", file);
        const formData = new FormData();
        formData.append('image', file);
    };

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            const file = files[0];
            console.log("file", file);
            setSelectedFile(file);
        }
    };

    const handleFileAddUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            const file = files[0];
            setSelectedAddFile(file);
        }
    };
    useEffect(() => {
        // Fetch exam results
        ExamResultAddService.getExamResultsAdd()
            .then((data) => {
                // Sort data by createdAt in descending order (most recent first)
                const sortedData = data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                setProducts(sortedData);
            })
            .catch((error) => {
                console.error("Error fetching exam results:", error);
            });
    
        // Fetch publishers and types
        ExamResultAddService.getPublishersAndTypes()
            .then((data) => {
                setPublishersDropdown(data);
            })
            .catch((error) => {
                console.error("Error fetching publishers and types:", error);
            });
    
        initFilters1();
    
    }, [success]);
    

    const openNew = () => {
        setProduct(emptyProduct);
        setSubmitted(false);
        setProductDialog(true);
    };

    const onPublisherChange = (e: { value: any; }) => {
        const publisher = e.value;
        setSelectedPublisher(publisher);
        setDropdownValues(publisher.types); // Set types based on selected publisher
        setProduct({ ...product, name: publisher.name }); // Optional: set name from selected publisher
    };

    const hideDialog = () => {
        setProductDialog(false);
        setSubmitted(false);
        setSelectedPublisher(emptyPublisher);
        setProduct(emptyProduct);
        setDropdownValues([]);
        setDropdownValue(null);
        setSelectedFile(null); // Reset the selected file

        
    };
    const hideAddDialog = () => {
        setExamInsideDialog(false);
        setSubmitted(false);
        setSelectedPublisher(emptyPublisher);
        setDropdownAddValues([]);
        setSelectedAddExam(undefined);
        setSelectedAddPublisher(undefined);
        setSelectedAddFile(undefined);
        setDropdownAddValue(undefined);

    };

    function handleAddSelect(selectedPublisher: Exam) {
        console.log("selectedPublisher", selectedPublisher);
        setSelectedAddExam(selectedPublisher);
        setExamInsideDialog(true);
        setSubmitted(false);
        const datas = selectedPublisher.publisher.types.filter(type =>
            !selectedPublisher.type.some(selectedType => selectedType._id === type._id)
        );
        setDropdownAddValues(datas);
        setSelectedAddPublisher(selectedPublisher.publisher);
    }
    const hideDeleteProductDialog = () => {
        setDeleteProductDialog(false);
    };

    const hideDeleteProductsDialog = () => {
        setDeleteProductsDialog(false);
    };

    const saveProduct = async () => {
        console.log("typeId", product.typeId?._id);
        setSubmitted(true);

        if (product.name.trim() && selectedFile) { // Check if a file is selected
            const formData = new FormData();
            if (product.typeId && product.typeId._id) {
                formData.append('typeId', product.typeId._id); // Append the _id of typeId
            }
            formData.append('fileTxt', selectedFile); // Assuming selectedFile holds the uploaded file

            try {

                const response = await fetch(`${process.env.API_URL}/general-exam`, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Cache-Control': 'no-cache',
                        'Authorization': `Bearer ${getAuthToken()}`
                    }
                });
                console.log("response", response);
                if (response.ok) {
                    const data = await response.json();

                    if (product._id) {
                        const index = findIndexById(product._id);
                        toast.current?.show({
                            severity: 'success',
                            summary: 'Başarılı',
                            detail: 'Güncellendi',
                            life: 3000,
                        });
                    } else {
                        toast.current?.show({
                            severity: 'success',
                            summary: 'Başarılı',
                            detail: 'Oluşturuldu',
                            life: 3000,
                        });
                    }

                    setProductDialog(false);
                    setProduct(emptyProduct);
                    setSuccess(!success);
                    setSelectedFile(null); // Reset the selected file
                } else {
                    throw new Error('Failed to save product');
                }
            } catch (error) {
                console.error('Error saving product:', error);
                toast.current?.show({
                    severity: 'error',
                    summary: 'Hata',
                    detail: 'Kayıt kaydedilemedi',
                    life: 3000,
                });
            }
        }
    };
    const saveExamAdd = async () => {
        console.log("typeId", dropdownAddValue?._id);
        setSubmitted(true);

        if (selectedAddFile) { // Check if a file is selected
            const formData = new FormData();
            if (dropdownAddValue?._id) {
                formData.append('typeId', dropdownAddValue?._id); // Append the _id of typeId
            }
            formData.append('fileTxt', selectedAddFile); // Assuming selectedFile holds the uploaded file
            if (selectedAddExam) {
                formData.append('generalExamId', selectedAddExam?._id); // Assuming selectedFile holds the uploaded file

            }
            try {
                const response = await fetch(`${process.env.API_URL}/general-exam/add`, {
                    method: 'PUT',
                    body: formData,
                    headers: {
                        'Cache-Control': 'no-cache',
                        'Authorization': `Bearer ${getAuthToken()}`
                    }
                });
                console.log("response", response);
                if (response.ok) {
                    const data = await response.json();

                    if (product._id) {
                        const index = findIndexById(product._id);
                        toast.current?.show({
                            severity: 'success',
                            summary: 'Başarılı',
                            detail: 'Güncellendi',
                            life: 3000,
                        });
                    } else {
                        toast.current?.show({
                            severity: 'success',
                            summary: 'Başarılı',
                            detail: 'Oluşturuldu',
                            life: 3000,
                        });
                    }


                    setProductDialog(false);
                    setSelectedFile(null); // Reset the selected file
                    setSuccess(!success);
                    hideAddDialog();
                } else {
                    throw new Error('Failed to save product');
                }
            } catch (error) {
                console.error('Error saving product:', error);
                toast.current?.show({
                    severity: 'error',
                    summary: 'Hata',
                    detail: 'Kayıt kaydedilemedi',
                    life: 3000,
                });
            }
        }
    };

    const editProduct = (product: Exam) => {
        setProduct({ ...product });
        setProductDialog(true);
    };

    const confirmDeleteProduct = (product: Exam) => {
        setProduct(product);
        setDeleteProductDialog(true);
    };

    const deleteProduct = () => {
        let _products = (products as any)?.filter((val: any) => val._id !== product._id);
        setProducts(_products);
        setDeleteProductDialog(false);
        setProduct(emptyProduct);
        toast.current?.show({
            severity: 'success',
            summary: 'Başarılı',
            detail: 'Kayıt Kaldırıldı',
            life: 3000
        });
    };

    const findIndexById = (_id: string) => {
        let index = -1;
        for (let i = 0; i < (products as any)?.length; i++) {
            if ((products as any)[i]._id === _id) {
                index = i;
                break;
            }
        }

        return index;
    };


    const confirmDeleteSelected = () => {
        setDeleteProductsDialog(true);
    };

    const deleteSelectedProducts = async () => {
        if (!selectedProducts) {
            return;
        }
        console.log(selectedProducts)
       try {
        for (const product of selectedProducts){
            const response = await fetch(`${process.env.API_URL}/general-exam/${product._id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getAuthToken()}`
                }
            });

             if (!response.ok) {
                throw new Error(`Failed to delete product`);
            }
        }
    
        const _products = (products as any)?.filter((val: any) => !(selectedProducts as any)?.includes(val));
        setProducts(_products);
        setDeleteProductsDialog(false);
        setSelectedProducts([]);
        toast.current?.show({
            severity: 'success',
            summary: 'Başarılı',
            detail: 'Başarıyla Silindi',
            life: 3000
        });
       } catch (error) {
            console.error('Error deleting product:', error);
            toast.current?.show({
            severity: 'error',
            summary: 'Hata',
            detail: 'Kayıt Silinemedi',
            life: 3000,
            });        
       }
    };

    type ExamKeys = keyof Exam
    const onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, name: ExamKeys) => {
        const val = (e.target && e.target.value) || '';
        let _product = { ...product };
        //  _product[name] = val; // TypeScript now knows that name is a key of Exam

        setProduct(_product);
    };


    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="Yeni Deneme" icon="pi pi-plus" severity="success" className=" mr-2" onClick={openNew} />
                    <Button label="Sil" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedProducts || !(selectedProducts as any).length} />
                </div>
            </React.Fragment>
        );
    };

    const addButtonTemplate = (rowData: Exam) => {
        return (
            <>
                <Button label="Ekle" icon="pi pi-plus" severity="secondary" onClick={(() => handleAddSelect(rowData))} />
            </>
        );
    };

    const categoryBodyTemplate = (rowData: Exam) => {
        return (
            <ul style={{ listStyleType: 'none', padding: 0, margin: 0, display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                {rowData.type.map((examType) => (
                    <React.Fragment key={examType._id}>
                        <li style={{ textAlign: 'center' }}>
                            <strong>{examType.name}</strong> {/* Centered examType name */}
                            <ul style={{ listStyleType: 'none', padding: 0, margin: '1px 0 0' }}>
                                {examType.lessons.map((lesson, index) => (
                                    <li key={index}>
                                        {lesson.name}
                                    </li>
                                ))}
                            </ul>
                        </li>
                    </React.Fragment>
                ))}
            </ul>


        );
    };
    const nameBodyTemplate = (rowData: Exam) => {
        return (
            <ul style={{ listStyleType: 'none', padding: 0, margin: 0, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {rowData.type.map((examType, index) => (
                    <React.Fragment key={examType._id}>
                        {examType.name}
                        {index < rowData.type.length - 1 && ' - '}
                    </React.Fragment>
                ))}
            </ul>
        );
    };
    
    
    const dateBodyTemplate = (rowData: Exam) => {
        return (
            <span>{new Date(rowData.createdAt.split("T")[0]).toLocaleDateString()}</span>
        );
    };
    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Yüklenen Denemeler</h5>
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

    const productDialogFooter = (
        <>
            <Button label="İptal Et" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Kaydet" icon="pi pi-check" text onClick={saveProduct} />
        </>
    );

    const productAddDialogFooter = (
        <>
            <Button label="İptal Et" icon="pi pi-times" text onClick={hideAddDialog} />
            <Button label="Kaydet" icon="pi pi-check" text onClick={saveExamAdd} />
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
    const searchTemplate = (rowData: any) => {
        return <Link href={"examlist/"+rowData._id}><Button icon="pi pi-search" text /></Link>;
    };
    return (
        <div className="grid crud-demo">
            <BackButton />
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>
                    <DataTable
                        showGridlines
                        ref={dt}
                        value={products}
                        selection={selectedProducts}
                        onSelectionChange={(e) => setSelectedProducts(e.value as any)}
                        dataKey="_id"
                        paginator
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
                        <Column
                            selectionMode="multiple"
                            headerStyle={{ width: '4rem', textAlign: 'center' }} // Center the selection header
                        ></Column>

                        <Column
                            field="examNumber"
                            header="Sıra"
                            sortable
                            headerStyle={{ textAlign: 'center' }} // Center the header
                        />

                        <Column
                            field="publisher.name"
                            header="Yayın Evi"
                            sortable

                            headerStyle={{ textAlign: 'center' }} // Center the header
                        />

                        <Column
                            field="name"
                            body={nameBodyTemplate}
                            header="Deneme Türü"
                            style={{ width: '1%' , whiteSpace: 'nowrap', textAlign: 'center' }} // Center the body content
                            />

                        <Column
                            field="createdAt"
                            body={dateBodyTemplate}
                            header="Sonuç Tarihi"
                            sortable
                            style={{ width: '1%' , whiteSpace: 'nowrap', textAlign: 'center' }} // Center the body content
                        />

                        <Column
                            field="category"
                            header="Dersler"
                            body={categoryBodyTemplate}
                            style={{ width: '180px', whiteSpace: 'nowrap' }} // Narrow width for category
                            headerStyle={{ textAlign: 'center' }} // Center the header
                        />

                        <Column
                            header="Ekle"
                            body={addButtonTemplate}
                            style={{ width: '1%' , whiteSpace: 'nowrap' }}
                            headerStyle={{ textAlign: 'center' }} // Center the header
                        />

                        <Column
                            header="Görüntüle"
                            body={searchTemplate}
                            dataType="boolean"
                            bodyClassName="text-center"
                            style={{ width: '1%' }}
                            headerStyle={{ textAlign: 'center' }} // Center the header
                        />
                    </DataTable>

                    <Dialog visible={productDialog} style={{ width: '450px' }} header="Yeni Deneme" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="name">Yayınevi</label>
                            <Dropdown
                            filter
                                id="name"
                                value={selectedPublisher}
                                onChange={onPublisherChange}
                                options={publishersDropdown}
                                optionLabel="name"
                                placeholder="Yayınevi Seç"
                                required
                                autoFocus
                                className={classNames({
                                    'p-invalid': submitted && !selectedPublisher?.name
                                })}
                            />
                            {submitted && !selectedPublisher?.name && <small className="p-invalid">Yayınevi Zorunludur</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="branch">Deneme No</label>
                            <InputText
                                value={selectedPublisher?.name?(selectedPublisher?.examCount! + 1).toLocaleString():''}
                                id='branch'
                                placeholder="Deneme No"
                                className="w-full"
                                disabled
                            />
                        </div>
                        <div className="field">
                            <label htmlFor="branch">Deneme Türü</label>
                            <Dropdown
                                id='branch'
                                value={product.typeId} // Make sure product has typeId now
                                onChange={(e) => setProduct({ ...product, typeId: e.value })}
                                options={dropdownValues}
                                optionLabel="name"
                                placeholder="Deneme Türü"
                                className={classNames({
                                    'p-invalid': submitted && !selectedPublisher?.name
                                })}
                            />
                            {submitted && !product.typeId && <small className="p-invalid">Deneme Türü Zorunludur</small>}
                        </div>

                        <div className="field">
                            <label className="mb-3">Dosya</label>
                        </div>
                        <input
                            type="file"
                            id="fileUpload"
                            accept=".txt"

                            className="hidden" // You can still hide it if necessary
                            onChange={(e) => handleImageUpload(e)}
                        />

                        {!selectedFile &&
                            <label
                                htmlFor="fileUpload"
                                style={{ borderRadius: '10px' }}
                                className="rounded-full text-lg inline-block px-6 py-4 bg-indigo-500 text-white font-bold text-sm leading-tight rounded-full shadow-md hover:bg-indigo-600 hover:shadow-lg focus:bg-indigo-600 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-indigo-700 active:shadow-lg transition duration-150 ease-in-out cursor-pointer"
                            >
                                Dosya Yükle
                            </label>
                        }
                        <div className='mt-3'>
                            {selectedFile && <label className='text-green-600'>Dosya yüklendi : {selectedFile.name}</label>}
                            {selectedFile && <label className='text-red-600 cursor-pointer' onClick={() => setSelectedFile(null)}><br></br>Dosya Sil</label>}

                        </div>
                    </Dialog>

                    <Dialog visible={addExamInsideDialog} style={{ width: '450px' }} header="Yeni Deneme" modal className="p-fluid" footer={productAddDialogFooter} onHide={hideAddDialog}>
                        <div className="field">
                            <label htmlFor="name">Yayınevi</label>
                            <p className='text-lg font-bold'>{selectedAddPublisher?.name}</p>
                        </div>
                        <div className="field">
                            <label htmlFor="branch">Deneme Türü</label>
                            <Dropdown
                                id='branch'
                                value={dropdownAddValue}
                                onChange={(e) => setDropdownAddValue(e.value)}
                                options={dropdownAddValues}
                                optionLabel="name"
                                placeholder="Deneme Türü"
                                className={classNames({
                                    'p-invalid': submitted && !dropdownAddValue?.name
                                })}
                            />
                            {submitted && !dropdownAddValue?.name && <small className="p-invalid">Deneme Türü Zorunludur</small>}
                        </div>
                        <div className="field">
                            <label className="mb-3">Dosya</label>

                        </div>
                        <input
                            type="file"
                            id="fileUpload"
                            accept=".txt"
                            className="hidden" // Hide the input
                            onChange={(e) => handleFileAddUpload(e)}
                        />
                        {!selectedAddFile &&
                            <label
                                htmlFor="fileUpload"
                                style={{ borderRadius: '10px' }}
                                className="rounded-full text-lg inline-block px-6 py-4 bg-indigo-500 text-white font-bold text-sm leading-tight rounded-full shadow-md hover:bg-indigo-600 hover:shadow-lg focus:bg-indigo-600 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-indigo-700 active:shadow-lg transition duration-150 ease-in-out cursor-pointer"
                                                  >

                                Dosya Yükle
                            </label>}
                        <div className='mt-3'>
                            {selectedAddFile && <label className='text-green-600'>Dosya yüklendi : {selectedAddFile.name}</label>}
                            {selectedAddFile && <label className='text-red-600 cursor-pointer' onClick={() => setSelectedAddFile(null)}><br></br>Dosya Sil</label>}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteProductDialog} style={{ width: '450px' }} header="Onayla" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {product && (
                                <span>
                                    Silmek istediğinize emin misiniz? <b>{product.name}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteProductsDialog} style={{ width: '450px' }} header="Onayla" modal footer={deleteProductsDialogFooter} onHide={hideDeleteProductsDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {product && <span>Silmek istediğinize emin misiniz?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default Crud;
