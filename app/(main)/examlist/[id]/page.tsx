'use client';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable, DataTableFilterMeta } from 'primereact/datatable';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import React, { useEffect, useRef, useState } from 'react';
import type { Demo } from '@/types';
import { CustomerService } from '@/demo/service/CustomerService';
import { useRouter } from 'next/navigation';
import BackButton from '@/demo/components/BackButton';
import { ExamList, GeneralExam, Type } from '@/models/exam';
import { ExamListService } from '@/demo/service/ExamListService';
import { LastExam } from '@/models/last-exam';
import { set } from 'date-fns';
import { Toast } from 'primereact/toast';
import { ToastContainer } from 'react-toastify';
import { Class } from '@/models/homework';

const TableDemo = ({ params }: { params: { id: string } }) => {
    const [tableValues, setTableValues] = useState<any>([]);
    const [lessons, setLessons] = useState<any>([]);
    const [selectedLesson, setSelectedLesson] = useState<any>([]);
    const [originalTableValues, setOriginalTableValues] = useState<any[]>([]);
    const [filters1, setFilters1] = useState<DataTableFilterMeta>({});
    const [loading1, setLoading1] = useState(true);
    const [globalFilterValue1, setGlobalFilterValue1] = useState('');
    const [selectedDropdownPublisher, setSelectedDropdownPublisher] = useState<ExamList>();
    const [dropdownPublishers, setDropdownPublishers] = useState<ExamList[]>([]); // Ensure empty array
    const [generalExams, setGeneralExams] = useState<Type[]>([]);
    const [selectedGeneralExam, setSelectedGeneralExam] = useState<Type>();
    const [mergedResults, setMergedResults] = useState<LastExam[]>([]);
    const [typeValues, setTypeValues] = useState<any>([]);
    const [dropdownValue, setdropdownValue] = useState<{ name: string; label: string; _id: any }>({ name: '', label: '', _id: '' });

    const router = useRouter();
    const toast = useRef<Toast>(null);

    const handleSearchClick = (rowData: any) => {
        if (!rowData.userId) {
            toast.current?.show({
                severity: 'error',
                summary: 'Hata',
                detail: 'Kullanıcı kayıtlı değil',
                life: 3000
            });
        } else {
            router.push(`/students/${rowData.userId._id}`);
        }
    };
    
    const searchTemplate = (rowData: any) => {
        return <Button icon="pi pi-search" text onClick={() => handleSearchClick(rowData)} />;
    };

    const examRankTemplate = (rowData: any) => {
        console.log(rowData);

        return (
            <>
                {rowData.examRank && (
                    <>
                        {dropdownValue.name === 'Genel' || dropdownValue.name === '' ? (
                            rowData.examRank.schoolRank ? (
                                <span>{rowData.examRank.schoolRank}</span>
                            ) : (
                                rowData.examRank
                            )
                        ) : rowData.examRank.classRank ? (
                            <span>{rowData.examRank.classRank}</span>
                        ) : typeof rowData.examRank === 'number' ? (
                            <span>{rowData.examRank}</span>
                        ) : null}
                    </>
                )}
            </>
        );
    };

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

    const renderHeader1 = () => {
        return (
            <>
                <Toast ref={toast} />
                <div className="block md:hidden p-input-icon-left w-full md:w-auto flex-1">
                    <i className="pi pi-search" />
                    <InputText
                        value={globalFilterValue1}
                        onChange={onGlobalFilterChange1}
                        placeholder="Ara"
                        className="w-full"
                    />
                </div>
                <div className="flex flex-col md:flex-row justify-between items-center gap-2 p-2">
                    <div className="hidden md:block p-input-icon-left w-full md:w-auto flex-1">
                        <i className="pi pi-search" />
                        <InputText
                            value={globalFilterValue1}
                            onChange={onGlobalFilterChange1}
                            placeholder="Ara"
                            className="w-full"
                        />
                    </div>
                    <div className="flex flex-col md:flex-row justify-end items-center gap-2 w-full md:w-auto">
                        <Button
                            label="Yazdır"
                            icon="pi pi-print"
                            iconPos="right"
                            className="p-button-outlined w-full md:w-auto"
                        />
                    </div>
                </div>
            </>
        );
    };

    const classBodyTemplate = (rowData: any) => {
        return (
            <>
                {rowData.classes.length > 0 ? (
                    rowData.classes.map((classItem: any, index: any) => (
                        <span key={classItem._id}>
                            {classItem.level}/{classItem.name}{index < rowData.classes.length - 1 ? ', ' : ''}
                        </span>
                    ))
                ) : (
                    <span>Sınıf Yok</span>
                )}
            </>
        );
    };

    useEffect(() => {


        ExamListService.getGeneralExamList()
            .then((data) => {
                if (Array.isArray(data)) {
                    setDropdownPublishers(data); // Ensure data is an array
                } else {
                    console.error("Expected an array but received:", data);
                    setDropdownPublishers([]);
                }
            })
            .catch((error) => {
                console.error("Error fetching exam list:", error);
                setDropdownPublishers([]); // Ensure dropdown is empty if error occurs
            });
        initFilters1();

    }, []);

    useEffect(() => {
        ExamListService.getGeneralExamList()
            .then((data) => {
                console.log("Fetched General Exam List:", data);
                if (Array.isArray(data)) {
                    setDropdownPublishers(data);
                } else {
                    console.error("Expected an array but received:", data);
                    setDropdownPublishers([]); // Handle non-array data
                }
            })
            .catch((error) => {
                console.error("Error fetching exam list:", error);
                setDropdownPublishers([]); // Handle errors gracefully
            });
        initFilters1();

    }, []);
    useEffect(() => {
        setTableValues(null);
        if (selectedDropdownPublisher || params.id) {
            const selectedDropdown = dropdownPublishers.find((item) => item.id == params.id);
            const genelOption = { _id: 'genel', name: 'Genel', lessons: [] }; // Define a "Genel" option
            if (!selectedDropdownPublisher) setSelectedDropdownPublisher(selectedDropdown);


            ExamListService.getGeneralExamDetail(selectedDropdownPublisher?.id ? selectedDropdownPublisher?.id : params.id)
                .then((data) => {

                    // Handle the fetched exam details
                    const updatedPublishers = [genelOption, ...(data.details?.type || [])]; // Ensure data.details.type is an array
                    setGeneralExams(updatedPublishers); // Update general exams with array

                  // Update general exams with array

                    setMergedResults(data.details?.mergedResults || []);


                    if (!selectedDropdownPublisher)   {
                        setSelectedGeneralExam(genelOption);
                    } 
                    // Check if selectedGeneralExam exists before proceeding
                    if (selectedGeneralExam && selectedLesson.length === 0) {
                        const selectedExam = data.details?.[selectedGeneralExam.name]; // Access the selected exam array
                        setTypeValues(selectedExam); // Set the matched lessons array to state

                    }
                    if (selectedGeneralExam && selectedLesson) {
                        const selectedExam = data.details?.[selectedGeneralExam.name]; // Access the selected exam array

                        if (selectedExam?.length > 0) {
                            const matchedLessons: any[] = []; // Create an array to store all matched lessons

                            // Iterate through the exam array to find lesson results
                            selectedExam.forEach((examObj: any) => {
                                if (examObj.lessonResults) {
                                    // Find all lessons where lessonId._id matches selectedLesson
                                    const matchedLesson = examObj.lessonResults.filter(
                                        (lesson: any) => lesson.lessonId._id === selectedLesson
                                    );

                                    if (matchedLesson.length > 0) {
                                        // If matchedLesson is found, add student name to each lesson result
                                        const lessonsWithNames = matchedLesson.map((lesson: any) => ({
                                            ...lesson,
                                            examRank: examObj.examRank, // Add student name from the exam object
                                            name: examObj.name, // Add student name from the exam object
                                            schoolNumber: examObj.schoolNumber, // Include other details if necessary
                                            class: examObj.class,
                                        }));
                                        matchedLessons.push(...lessonsWithNames);
                                    }
                                }
                            });

                            if (matchedLessons.length > 0) {
                                console.log("Matched Lessons Data with Names:", matchedLessons);
                                setTypeValues(matchedLessons); // Set the matched lessons array to state
                            } else {
                                console.log("No matching lessons found");
                            }

                            // Optionally, generate lesson options for dropdown
                            const lessonOptions = selectedExam.flatMap((examObj: any) =>
                                examObj.lessonResults?.map((lesson: { lessonId: { name: any; _id: any; }; }) => ({
                                    label: lesson.lessonId.name,  // Label shown in the dropdown
                                    value: lesson.lessonId._id    // The unique value for each lesson
                                })) || []
                            );

                            // Use a Set to keep track of unique lesson IDs and filter out duplicates
                            const uniqueLessonOptions = lessonOptions.filter((lesson: { value: any; }, index: any, self: any[]) =>
                                index === self.findIndex((l) => l.value === lesson.value)  // Ensure the lesson ID is unique
                            );

                            setLessons(uniqueLessonOptions); // Set unique lesson options in the correct format

                        } else {
                            console.log("No selected exam or lesson results found");
                        }

                    }
                    
                    
                }).
                finally(() => {handleSearch();})
                .catch((error) => {
                    console.error("Error fetching general exam detail:", error);
                    setGeneralExams([]); // Handle errors by resetting general exams
                });
        }
    }, [selectedDropdownPublisher, selectedGeneralExam, selectedLesson]);



    const getCustomers = (data: Demo.Exam[]) => {
        return [...(data || [])].map((d) => {
            d.date = new Date(d.date);
            return d;
        });
    };

    const header1 = renderHeader1();
    function handleSelectGeneralExam(e: any) {
        setSelectedGeneralExam(e);
        setSelectedLesson([]); // Reset selected lesson when a new general exam is selected
    }

    function handleSearch() {
        // Log to verify the current values of the variables

        // First condition: When selectedGeneralExam is "Genel"
        if (selectedGeneralExam?.name === "Genel") {
            setTableValues(mergedResults);
        }
        // Second condition: When typeValues is available and selectedLesson is not empty
        else if (typeValues && typeValues.length > 0) {
            if (selectedLesson.length > 0) {
                const sortedTypeValues = [...typeValues].sort((a, b) => b.net - a.net); // Descending order
                setTableValues(sortedTypeValues);
            }
            // Third condition: When selectedLesson is empty
            else if (selectedLesson.length === 0) {
                const sortedTypeValues = [...typeValues].sort((b, a) => b.examRank.schoolRank - a.examRank.schoolRank); // Descending order
                setTableValues(sortedTypeValues);
            }
        }
    }
    //Sinif filtreme start
    const [dropdownValues, setClasses] = useState<any[]>([]);

    interface TableValue {
        class: string;
    }

    interface ClassOption {
        name: string;
        _id: string;
    }

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                if (!Array.isArray(tableValues)) {
                    console.error('tableValues is not an array:', tableValues);
                    return;
                }

                const formattedClasses = tableValues
                    .reduce((uniqueItems: TableValue[], item: TableValue) => {
                        const exists = uniqueItems.some((uniqueItem) => uniqueItem.class === item.class);
                        return exists ? uniqueItems : [...uniqueItems, item];
                    }, [])
                    .filter((item: TableValue) => item.class !== 'BOŞ');

                const classOptions: ClassOption[] = formattedClasses
                    .map((item: TableValue) => ({
                        name: item.class,
                        _id: item.class // Используйте уникальное значение
                    }))
                    .sort((a: ClassOption, b: ClassOption) => a.name.localeCompare(b.name));

                const genelOption = { name: 'Genel', _id: 'NY' };

                setClasses([genelOption, ...classOptions]);
            } catch (error) {
                console.error('Failed to fetch classes:', error);
            }
        };

        fetchClasses();
    }, [originalTableValues]);

    const handleClassFilter = () => {
        console.log('Dropdown value:', dropdownValue);
        const originalStudents = originalTableValues || [];

        let filteredStudents = [];

        if (!dropdownValue || dropdownValue.name === 'Genel') {
            filteredStudents = originalStudents;
        } else {
            filteredStudents = originalStudents.filter((student) => {
                return student.class === dropdownValue.name;
            });
        }

        console.log('Filtered students:', filteredStudents);
        setTableValues(filteredStudents);
    };

    useEffect(() => {
        handleClassFilter();
    }, [dropdownValue]);
    
    return (
        <div className="grid">
            <BackButton />
            <div className="col-12">
                <div className="card">
                    <div className="grid">
                        <div className={`col-12 mb-2 lg:col-${selectedGeneralExam?.name === "Genel" ? '5' : '4'} lg:mb-0`}>
                            <h5>Deneme Seçiniz</h5>
                            <div className="w-full">
                                <Dropdown
                                    value={selectedDropdownPublisher}
                                    onChange={(e) => setSelectedDropdownPublisher(e.value)}
                                    options={dropdownPublishers || []} // Ensure dropdown is always an array
                                    optionLabel="name"
                                    placeholder="Deneme Seçiniz *"
                                    className="w-full"
                                    filter
                                />
                            </div>
                        </div>
                        {generalExams.length > 0 && (
                            <>
                                <div className={`col-12 mb-2 lg:col-${selectedGeneralExam?.name === "Genel" ? '6' : '4'} lg:mb-0`}>
                                    <h5>Seçiniz</h5>
                                    <div className="w-full">
                                        <Dropdown
                                            value={selectedGeneralExam}
                                            onChange={(e) => handleSelectGeneralExam(e.value)}
                                            options={generalExams || []}
                                            optionLabel="name"
                                            placeholder="Deneme Seçiniz *"
                                            className="w-full"
                                            filter
                                        />
                                    </div>
                                </div>
                            </>
                        )}
                        {generalExams.length > 0 && selectedGeneralExam?.name == "Genel" && (
                            <>
                                <div className="col-12 mb-1  lg:col-1 lg:mb-0">
                                    <div className="w-full">
                                        <Button
                                            label="Ara"
                                            icon="pi pi-search"
                                            iconPos="right"
                                            className="p-button-outlined w-full"
                                            style={{ marginTop: '2.4rem' }}
                                            onClick={handleSearch}
                                        />
                                    </div>
                                </div>
                            </>
                        )}
                        {lessons.length > 0 && selectedGeneralExam?.name !== "Genel" && (
                            <>
                                <div className="col-12 mb-2 lg:col-3 lg:mb-0">
                                    <h5>Seçiniz</h5>
                                    <div className="w-full">
                                        <Dropdown
                                            value={selectedLesson}
                                            onChange={(e) => setSelectedLesson(e.value)}
                                            options={lessons || []}
                                            optionLabel="label"
                                            placeholder="Deneme Seçiniz"
                                            className="w-full"
                                            filter
                                        />
                                    </div>
                                </div>
                                <div className="col-12 mb-1  lg:col-1 lg:mb-0">
                                    <div className="w-full">
                                        <Button
                                            label="Ara"
                                            icon="pi pi-search"
                                            iconPos="right"
                                            className="p-button-outlined w-full"
                                            style={{ marginTop: '2.4rem' }}
                                            onClick={handleSearch}
                                        />
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                    <>
                        <h5>Deneme Sıralaması</h5>
                        {(selectedGeneralExam?.name == "Genel" || selectedLesson.length === 0) ? (
                            <>
                                <DataTable
                                    value={tableValues}
                                    paginator
                                    className="p-datatable-gridlines"
                                    showGridlines
                                    rows={10}
                                    dataKey="examRank"
                                    filters={filters1}
                                    filterDisplay="menu"
                                    responsiveLayout="scroll"
                                    emptyMessage="Deneme seçiniz."
                                    header={header1}
                                >
                                    <Column field='examRank.schoolRank' body={examRankTemplate} header="Sıra" sortable />
                                    <Column field="name" header="İsim" sortable />
                                    <Column field="schoolNumber" header="Numara" />
                                    <Column
                                        field="class"
                                        style={{ textAlign: 'center' }}
                                        header={() => (
                                            <Dropdown
                                                value={dropdownValue}
                                                onChange={(e) => {
                                                    setdropdownValue(e.value);
                                                    handleClassFilter();
                                                }}
                                                options={dropdownValues || []}
                                                optionLabel="name"
                                                placeholder="Sınıf Seçiniz"
                                                className="w-full"
                                                filter
                                                key={dropdownValue?.name}
                                            />
                                        )}
                                    />
                                    <Column field="generalResult.totalTrue" header="Doğru" sortable />
                                    <Column field="generalResult.totalFalse" header="Yanlış" sortable />
                                    <Column field="generalResult.totalNet" header="Net" sortable />
                                    <Column field="generalResult.totalPoint" header="Puan" sortable />
                                    <Column field="verified" header="Görüntüle" body={searchTemplate} dataType="boolean" bodyClassName="text-center" style={{ width: '1%' }} />
                                </DataTable>
                            </>
                        ) :
                            <>
                                <DataTable
                                    value={tableValues}
                                    paginator
                                    className="p-datatable-gridlines"
                                    showGridlines
                                    rows={10}
                                    dataKey="examRank"
                                    filters={filters1}
                                    filterDisplay="menu"
                                    responsiveLayout="scroll"
                                    emptyMessage="Deneme seçiniz."
                                    header={header1}
                                >
                                    <Column field='examRank.schoolRank' body={examRankTemplate} header="Sıra" sortable />
                                    <Column field="name" header="İsim" sortable />
                                    <Column field="schoolNumber" header="Numara" />
                                    <Column field="class" header="Sınıf" sortable />
                                    <Column field="true" header="Doğru" sortable />
                                    <Column field="false" header="Yanlış" sortable />
                                    <Column field="net" header="Net" sortable />
                                    <Column field="verified" header="Görüntüle" body={searchTemplate} dataType="boolean" bodyClassName="text-center" style={{ width: '1%' }} />
                                </DataTable>
                            </>
                        }
                    </>
                </div>
            </div>
        </div>
    );
};

export default TableDemo;
/*
   {selectedGeneralExam?.name == "Genel" ?  (  
                            <>
                             <Column field='examRank' body={examRankTemplate} header="Sıra" sortable />
                              <Column field="name" header="İsim" />
                              <Column field="schoolNumber" header="Numara" />
                              <Column field="class" header="Sınıf" sortable />
                              <Column field="true" header="Doğru" sortable />
                              <Column field="false" header="Yanlış" sortable />
                              <Column field="net" header="Net" sortable />
                              <Column field="generalResult.totalPoint" header="Puan" sortable filterPlaceholder="Puana göre ara" />
                              <Column field="verified" header="Görüntüle" body={searchTemplate} dataType="boolean" bodyClassName="text-center" style={{ width: '1%' }} />
                              </>
                          ) :
                          <>
                           <Column field='examRank' body={examRankTemplate} header="Sıra" sortable />
                              <Column field="name" header="İsim" />
                              <Column field="schoolNumber" header="Numara" />
                              <Column field="class" header="Sınıf" sortable />
                              <Column field="true" header="Doğru" sortable />
                              <Column field="false" header="Yanlış" sortable />
                              <Column field="net" header="Net" sortable />
                              <Column field="generalResult.totalPoint" header="Puan" sortable filterPlaceholder="Puana göre ara" />
                              <Column field="verified" header="Görüntüle" body={searchTemplate} dataType="boolean" bodyClassName="text-center" style={{ width: '1%' }} />
                          </> }

*/