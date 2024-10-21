'use client';
import { ExamClasseservice } from '@/demo/service/ExamClassesService';
import { Demo } from '@/types';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dropdown } from 'primereact/dropdown';
import { ProgressBar } from 'primereact/progressbar';
import { Steps } from 'primereact/steps';
import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams } from "next/navigation";
import BackButton from '@/demo/components/BackButton';
import { StudentService } from '@/demo/service/StudentService';
import { Student } from '@/models/student';
import { StudentDetailService } from '@/demo/service/StudentDetailService';
import { StudentStatistics, StudentSubjects } from '@/models/student-details';
import { LastExam } from '@/models/last-exam';
import { set } from 'date-fns';

interface InputValue {
    name: string;
    code: string;
}

const StudentDetail = ({ params }: { params: { id: string } }) => {
    const [activeIndex, setActiveIndex] = useState<number>(0);
    const [active, setActive] = useState<boolean>(false);
    const [dropdownValue, setdropdownValue] = useState(null);
    const [student, setStudent] = useState<Student>();
    const [studentExamList, setStudentExamList] = useState();
    const [selectedExam, setSelectedExam] = useState<any>();
    const [examTable, setExamTable] = useState();
    const [studentStatistics, setStudentStatistics] = useState<StudentSubjects>();
    const [studentGeneralInfo, setStudentGeneralInfo] = useState<StudentStatistics>();
    const searchParams = useSearchParams();
    const [progressBar, setProgressBar] = useState<number>(0);
    const examId = searchParams.get("examId");
    const [mergedResults, setMergedResults] = useState<LastExam[]>([]);
    const [tableValues, setTableValues] = useState<any>([]);
    const [examTypeValues, setExamTypeValues] = useState<any>([]);
    const [selectedLesson, setSelectedLesson] = useState<any>([]);
    const [selectedLessonName, setSelectedLessonName] = useState<any>();
    const [selectedExam2, setSelectedExam2] = useState<any>();

    const dropdownValues: InputValue[] = [
        { name: "New York", code: "NY" },
        { name: "Rome", code: "RM" },
        { name: "London", code: "LDN" },
        { name: "Istanbul", code: "IST" },
        { name: "Paris", code: "PRS" },
    ];


    const wizardItems = [{ label: 'Genel' }, { label: 'Deneme' }, { label: 'Dersler' }];
    const [typeValues, setTypeValues] = useState<any>([]);

    const [examClasses, setExamClasses] = useState(null);
    const [subjects, setSubjects] = useState(null);
    const [selectedSubjects, setselectedSubjects] = useState(null);
    const [lessons, setLessons] = useState(null);
    const [selectedExamClasses, setSelectedExamClasses] = useState(null);
    const [globalFilter, setGlobalFilter] = useState('');
    const [selectedType, setSelectedType] = useState<any>();

    const dt = useRef<DataTable<any>>(null);

    useEffect(() => {
        StudentDetailService.getStudentGeneralInformations(params.id).then((data) => setStudentGeneralInfo(data as any));
        StudentDetailService.getStudentStatistics(params.id).then((data) => setStudentStatistics(data as any));
        StudentDetailService.getStudentExamList(params.id).then((data) => setStudentExamList(data as any));


        ExamClasseservice.getExamClasses().then((data) => setExamClasses(data as any));
        ExamClasseservice.getSubjects().then((data) => setSubjects(data as any));
        ExamClasseservice.getLessonsRatio().then((data) => setLessons(data as any));
        // ExamClasseservice.getSelectedSubjectRatio().then((data) => setExamTable(data as any));
    }, []);



    useEffect(() => {
        if (selectedExam != null) {
            const genelOption = { _id: 'genel', name: 'Genel', lessons: [] };

            // Fetch the student exam detail based on the selected exam
            StudentDetailService.getStudentExamDetail(params.id, selectedExam.id)
                .then((data) => {
                    // Handle mergedResults for "Genel"
                    const isGenel = data.details?.type.length > 1 && true

                    setMergedResults(data.details?.mergedResults?.[0]?.lessonResults || []);

                    // Update the available types, including "Genel"
                    const updatedPublishers = [...(isGenel ? [genelOption] : []), ...(data.details?.type || [])];
                    setTypeValues(updatedPublishers);

                    // Automatically select the first available type if none is selected yet
                    if (!selectedType && updatedPublishers.length > 0) {
                        setSelectedType(updatedPublishers[0]); // Automatically select "Genel" or the first available type
                    }

                    // Set exam table data for other types or general
                    if (selectedType && selectedType.name === "Genel") {
                        // For "Genel", use the generalResult data
                        console.log(data.details)
                        setSelectedExam2({
                            examRank: data.details?.mergedResults[0].generalRanks[0], 
                            generalResult: data.details?.mergedResults?.[0]?.generalResult || {}
                        });
                    } else if (selectedType && selectedType.name !== "Genel") {
                        const selectedExamDetail = data.details[selectedType.name]?.[0];
                        setExamTable(selectedExamDetail?.lessonResults || []);
                        setSelectedExam2(selectedExamDetail || []);
                    }
                })
                .catch((error) => {
                    console.error("Error fetching exam details:", error);
                });
        }
    }, [selectedExam, params.id, selectedType]);

    // Watch for `selectedType` changes and update the table accordingly
    useEffect(() => {
        if (selectedType && selectedType.name === "Genel") {
            // Set mergedResults if "Genel" is selected
            setTableValues(mergedResults);
        } else if (selectedType && selectedType.name !== "Genel") {
            // Set specific exam table if another type is selected
            setTableValues(examTable);
        }
    }, [selectedType, mergedResults, examTable]);

    useEffect(() => {
        if (examId != null)
            setActiveIndex(1);
    }, [examId]);

    useEffect(() => {
        const fetchStudent = async () => {
            try {
                const data = await StudentService.getStudents();
                const filteredStudent = data.find((item) => item.id === params.id);
                if (filteredStudent) {
                    setStudent(filteredStudent);
                } else {
                    console.error('Student not found');
                }
            } catch (err) {
                console.error(err);
            }
        };

        fetchStudent();
    }, [params.id]);


    function handleSelectLesson(rowData: any) {
        setSelectedLesson(rowData.subjects)
        setSelectedLessonName(rowData.lessonId.name);

        setActiveIndex(2);
    }


    const ratingBodyTemplate = (rowData: any) => {
        return (
            <>
                <div style={{ position: 'relative', width: '100%' }}>
                    <ProgressBar
                        value={rowData.statisticProgress}
                        showValue={false}
                        style={{
                            fontSize: "10px",
                            width: '100%',
                            position: 'relative'
                        }}
                    />
                    <span
                        style={{
                            position: 'absolute',
                            left: '50%',
                            top: '20%',
                            transform: 'translateX(-50%)',
                            color: '#000', // Change this to your desired text color
                            fontSize: '12px', // Ensure the font size matches your ProgressBar,
                        }}
                    >
                        {"%" + Math.floor(rowData.statisticProgress) }
                    </span>
                </div>
            </>
        );
    };

    const successRateBodyTemplate = (rowData: any) => {
        return (
            <span>
                {"%" + rowData.successRate.rate.toFixed(2)}
            </span>
        );
    };

    function Sidebar() {
        const generalItems = [
            {
                label: "Sınıf sıralamasında",
                value: selectedExam2?.examRank?.classRank ?? '*',
                color: "bg-blue-500"
            },
            {
                label: "Okul sıralamasında",
                value: selectedExam2?.examRank?.schoolRank ?? '*',
                color: "bg-blue-500"
            },
            {
                label: "NET",
                value: selectedExam2?.generalResult?.totalNet ?? '*',
                color: "bg-indigo-400"
            },
            {
                label: "PUAN",
                value: selectedExam2?.generalResult?.totalPoint ?? '*',
                color: "bg-purple-400"
            },
        ];

        const otherItems = [
            { label: "Sınıf sıralamasında", value: selectedExam2 ? selectedExam2.examRank && selectedExam2.examRank.classRank : '*', color: "bg-blue-500" },
            { label: "Okul sıralamasında", value: selectedExam2 ? selectedExam2.examRank && selectedExam2.examRank.schoolRank : '*', color: "bg-blue-500" },
            { label: "NET", value: selectedExam2 ? selectedExam2.generalResult?.totalNet : '*', color: "bg-indigo-400" },
            { label: "PUAN", value: selectedExam2 ? selectedExam2.generalResult?.totalPoint : '*', color: "bg-purple-400" },
        ];

        const itemsToRender = selectedType && selectedType.name === "Genel" ? generalItems : otherItems;

        return (
            <div className="col-12 xl:col-2">
                {itemsToRender.map((item, index) => (
                    <div
                        key={index}
                        className={`card flex justify-content-between items-center ${item.color} rounded-lg shadow-md p-3 my-4`}
                    >
                        <span className="block text-500 font-medium text-white">{item.label}</span>
                        <div className="text-900 font-bold text-xl text-white">{item.value}</div>
                    </div>
                ))}
            </div>
        );
    }

    const renderHeader1 = () => {
        return (
            <>
                <div className="col-12  xl:col-11 mb-2 lg:mb-0">
                    <div className="w-full">
                        <Dropdown
                            value={selectedExam}
                            onChange={(e) => setSelectedExam(e.value)}
                            options={studentExamList}
                            optionLabel="name"
                            placeholder="Deneme Seçiniz"
                            className="w-full"
                            filter
                        />
                    </div>
                </div>
                <div className="col-12 xl:col-1 mb-2 lg:mb-0">
                    <Button label="Yazdır" icon="pi pi-print" iconPos="right" className="p-button- p-button-outlined w-full" />
                </div>
            </>

        );
    };

    return (
        <div className="grid  ">
            <div className="col-12 lg:col-8 xl:col-4" >
                <BackButton />
                <div className="card mb-0" style={{ maxWidth: '100%', overflow: 'hidden' }}>
                    <div className="flex flex-col sm:flex-row justify-content-between gap-4 p-3">
                        <div className="flex align-items-center justify-content-center bg-orange-100 border-round" style={{ width: '4rem', height: '4rem' }}>
                            <i className="pi pi-user text-orange-500 text-2xl" />
                        </div>
                        <div className="flex-1">
                            <span className="block text-500 font-medium mb-1 text-lg">{studentGeneralInfo && studentGeneralInfo?.name}</span>
                            <div className="block text-500 font-medium mb-1 text-lg">{studentGeneralInfo && studentGeneralInfo?.school && studentGeneralInfo?.school.name}</div>
                        </div>
                        <div className="flex-1 text-right">
                            <span className="block text-500 font-medium mb-1 text-lg">{`${studentGeneralInfo && studentGeneralInfo.schoolClass && studentGeneralInfo?.schoolClass.level}/${studentGeneralInfo && studentGeneralInfo.schoolClass && studentGeneralInfo?.schoolClass.name}`}</span>
                            <div className="block text-500 font-medium mb-1 text-lg">{studentGeneralInfo && studentGeneralInfo?.schoolNumber && studentGeneralInfo?.schoolNumber}</div>
                        </div>
                    </div>
                </div>

            </div>
            <div className="col-12 lg:col-4 xl:col-8 mt-6">
                <div className="card pb-7" style={{}}>
                    <Steps
                        model={wizardItems}
                        activeIndex={activeIndex}
                        onSelect={(e) => {
                            // Prevent navigation to the third step if selectedType or selectedLesson is not set
                            if (e.index === 2 && (!selectedType || !selectedLessonName)) {
                                // Optionally show a message or warning here
                                return; // Do not allow navigating to step 3
                            }
                            setActiveIndex(e.index); // Allow normal navigation for other steps
                        }}
                        className="text-base lg:text-sm xl:text-base"
                        readOnly={false}
                    />
                </div>
            </div>


            {activeIndex === 1 && (
                <Sidebar />
            )}
            {activeIndex === 3 && (
                <Sidebar />
            )}
            {activeIndex === 0 ? (
                <>
                    <div className="col-12 xl:col-6 ">
                        <div className="col mb-4">
                            <h5>İlerleme İstatistiği</h5>
                            <div style={{ position: 'relative', width: '100%' }}>
                                <ProgressBar
                                    value={studentGeneralInfo?.generalProgressStatistic}
                                    showValue={false}
                                    style={{
                                        fontSize: "16px",
                                        width: '100%',
                                        position: 'relative'
                                    }}
                                />
                                <span
                                    style={{
                                        position: 'absolute',
                                        left: '50%',
                                        top: '0%',
                                        transform: 'translateX(-50%)',
                                        color: '#000', // Change this to your desired text color
                                        fontSize: '15px', // Ensure the font size matches your ProgressBar
                                    }}
                                >
                                    {"%" + Math.floor(studentGeneralInfo?.generalProgressStatistic!)}
                                </span>
                            </div>
                        </div>
                        <div className="col">
                            <div className='grid'>
                                <div className="col-12 lg:col-6">
                                    <div className="card" style={{ height: '10.5rem' }}>
                                        <div className="flex justify-content-between">
                                            <div >
                                                <span className="block text-500 font-medium mb-3" >Deneme Sayısı</span>
                                                <div className="text-500 font-medium mb-3">{studentGeneralInfo?.examCount}</div>
                                            </div>
                                            <div className="flex align-items-center justify-content-center bg-green-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                                                <i className="pi pi-pencil text-green-500 text-xl" />
                                            </div>
                                        </div>
                                        <span className="text-green-500 font-medium">Yapılan </span>
                                        <span className="text-500">Deneme Sayısı</span>
                                    </div>
                                </div>
                                <div className="col-12 lg:col-6">
                                    <div className="card" style={{ height: '10.5rem' }}>
                                        <div className="flex justify-content-between">
                                            <div>
                                                <span className="block text-500 font-medium mb-3">Genel Başarı Oranı</span>
                                                <div className="text-500 font-medium mb-3">{Math.floor(studentGeneralInfo?.generalSuccessRate!)}%</div>
                                            </div>
                                            <div className="flex align-items-center justify-content-center bg-purple-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                                                <i className="pi pi-hourglass text-purple-500 text-xl" />
                                            </div>
                                        </div>
                                        <span className="text-green-500 font-medium">Toplam </span>
                                        <span className="text-500">Çalışılan Süre</span>
                                    </div>
                                </div>
                                <div className="col-12 lg:col-6">
                                    <div className="card" style={{ height: '10.5rem' }}>
                                        <div className="flex justify-content-between">
                                            <div>
                                                <span className="block text-500 font-medium mb-3">Çözülen Test</span>
                                                <div className="text-500 font-medium mb-3">{studentGeneralInfo?.solvedTestCount}</div>
                                            </div>
                                            <div className="flex align-items-center justify-content-center bg-blue-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                                                <i className="pi pi-book text-blue-500 text-xl" />
                                            </div>
                                        </div>
                                        <span className="text-green-500 font-medium">Toplam </span>
                                        <span className="text-500">Çözülen Test Sayısı</span>
                                    </div>
                                </div>
                                <div className="col-12 lg:col-6">
                                    <div className="card" style={{ height: '10.5rem' }}>
                                        <div className="flex justify-content-between">
                                            <div>
                                                <span className="block text-500 font-medium mb-3">Tamamlanan Konular</span>
                                                <div className="text-500 font-medium mb-3">{studentGeneralInfo?.finishedSubjects}</div>
                                            </div>
                                            <div className="flex align-items-center justify-content-center bg-cyan-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                                                <i className="pi pi-verified text-cyan-500 text-xl" />
                                            </div>
                                        </div>
                                        <span className="text-green-500 font-medium">Toplam </span>
                                        <span className="text-500">Tamamlanan Konular</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 xl:col-6">
                        <div className="card">
                            <DataTable
                                ref={dt}
                                value={studentStatistics}
                                onSelectionChange={(e) => setLessons(e.value as any)}
                                dataKey="id"
                                showGridlines
                                rows={10}
                                rowsPerPageOptions={[5, 10, 25]}
                                className="datatable-responsive"
                                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
                                globalFilter={globalFilter}
                                emptyMessage="Veri bulunamadı"
                                responsiveLayout="scroll"
                            >
                                <Column field="name" header="Ders" ></Column>
                                <Column field="successRate.rate" header="Başarı Oranı" body={successRateBodyTemplate} sortable ></Column>
                                <Column field="statisticProgress" header="İlerleme İstatistiği" body={ratingBodyTemplate} sortable></Column>
                            </DataTable>
                        </div>
                    </div>
                </>
            ) : activeIndex === 1 ? (
                <div className="col  overflow-hidden">
                    <div className="card">
                        <div className="grid ">
                            {active ? (
                                <>
                                    <div className="col-12  xl:col-11 mb-2 lg:mb-0">
                                        <div className="w-full">
                                            <Dropdown
                                                value={dropdownValue}
                                                onChange={(e) => setdropdownValue(e.value)}
                                                options={dropdownValues}
                                                optionLabel="name"
                                                placeholder="Ders Seçiniz"
                                                className="w-full"
                                                filter
                                            />
                                        </div>
                                    </div>
                                    <div className="col-12 xl:col-1 mb-2 lg:mb-0">
                                        <Button label="Yazdır" icon="pi pi-print" iconPos="right" className="p-button- p-button-outlined" />
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className={`col-12  ${typeValues.length > 0 ? 'xl:col-5' : 'xl:col-10'} mb-2 lg:mb-0`}>
                                        <div className="w-full">
                                            <Dropdown
                                                value={selectedExam}
                                                onChange={(e) => setSelectedExam(e.value)
                                                }
                                                options={studentExamList}
                                                optionLabel="name"
                                                placeholder="Deneme Seçiniz"
                                                className="w-full"
                                                filter
                                            />
                                        </div>
                                    </div>
                                    {typeValues.length > 0 && (
                                        <div className="col-12  xl:col-5 mb-2 lg:mb-0">
                                            <div className="w-full">
                                                <Dropdown
                                                    value={selectedType}
                                                    onChange={(e) => setSelectedType(e.value)}
                                                    options={typeValues}
                                                    optionLabel="name"
                                                    placeholder="Tür Seçiniz"
                                                    className="w-full"
                                                    filter
                                                />
                                            </div>
                                        </div>)}
                                    <div className="col-12 xl:col-2 mb-2 lg:mb-0">
                                        <Button label="Yazdır" icon="pi pi-print" iconPos="right" className="p-button- p-button-outlined w-full" />
                                    </div>
                                </>
                            )}

                        </div>
                        <div className="grid ">
                            <div className="col-12  mb-2 lg:mb-0 ">
                                {active ? (
                                    <DataTable
                                        ref={dt}
                                        value={selectedSubjects}
                                        selection={selectedExamClasses}
                                        onSelectionChange={(e) => setSelectedExamClasses(e.value as any)}
                                        dataKey="id"
                                        paginator
                                        showGridlines
                                        rows={10}
                                        rowsPerPageOptions={[5, 10, 25]}
                                        className="datatable-responsive"
                                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
                                        globalFilter={globalFilter}
                                        emptyMessage="Veri bulunamadı"
                                        responsiveLayout="scroll"
                                    >
                                        <Column field="subject" header="Konu" ></Column>
                                        <Column field="totalCount" header="Soru Sayısı" sortable ></Column>
                                        <Column field="correct" header="Doğru" sortable ></Column>
                                        <Column field="false" header="Yanlış" sortable ></Column>
                                        <Column field="empty" header="Boş" sortable ></Column>
                                        <Column field="successRatio" header="Başarı Yüzdesi" body={ratingBodyTemplate}></Column>
                                    </DataTable>

                                ) : (
                                    <>
                                        <DataTable
                                            value={tableValues}
                                            paginator
                                            className="p-datatable-gridlines"
                                            showGridlines
                                            rows={10}
                                            dataKey="id"
                                            filterDisplay="menu"
                                            responsiveLayout="scroll"
                                            emptyMessage="Deneme seçiniz."
                                        >

                                            <Column field="lessonId.name" header="Ders" sortable ></Column>
                                            <Column field="net" header="Net" sortable ></Column>
                                            <Column field="true" header="Doğru" sortable />
                                            <Column field="false" header="Yanlış" sortable />
                                            <Column field="verified" header="Görüntüle" style={{ width: '1%' }} dataType="boolean" bodyClassName="text-center" body={(row) => (
                                                <>
                                                    <Button icon="pi pi-search" text onClick={() => handleSelectLesson(row)} />
                                                </>
                                            )} />
                                        </DataTable>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            ) :
                activeIndex === 2 ? (
                    selectedType &&
                    <div className="col  overflow-hidden">
                        <div className="card">
                            <div className="grid">
                                {active ? (
                                    <>
                                        <div className="col-12  xl:col-11 mb-2 lg:mb-0">
                                            <div className="w-full">
                                                <Dropdown
                                                    value={dropdownValue}
                                                    onChange={(e) => setdropdownValue(e.value)}
                                                    options={dropdownValues}
                                                    optionLabel="name"
                                                    placeholder="Ders Seçiniz"
                                                    className="w-full"
                                                    filter
                                                />
                                            </div>
                                        </div>
                                        <div className="col-12 xl:col-1 mb-2 lg:mb-0">
                                            <Button label="Yazdır" icon="pi pi-print" iconPos="right" className="p-button- p-button-outlined" />
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="col-12  xl:col-11 mb-2 lg:mb-0">
                                            <div className="w-full">
                                                <Dropdown
                                                    value={selectedLessonName}
                                                    optionLabel="name"
                                                    placeholder={
                                                        selectedExam.name + " " +
                                                        (selectedLessonName ? selectedLessonName.charAt(0).toUpperCase() + selectedLessonName.slice(1) : '')
                                                    }
                                                    className="w-full"
                                                    disabled
                                                    filter />
                                            </div>
                                        </div>
                                        <div className="col-12 xl:col-1 mb-2 lg:mb-0">
                                            <Button label="Yazdır" icon="pi pi-print" iconPos="right" className="p-button- p-button-outlined" />
                                        </div>
                                    </>
                                )}

                            </div>
                            <div className="grid">
                                <div className="col-12  mb-2 lg:mb-0 ">

                                    <DataTable
                                        ref={dt}
                                        value={selectedLesson}
                                        selection={selectedExamClasses}
                                        onSelectionChange={(e) => setSelectedExamClasses(e.value as any)}
                                        dataKey="id"
                                        paginator
                                        showGridlines
                                        rows={10}
                                        rowsPerPageOptions={[5, 10, 25]}
                                        className="datatable-responsive"
                                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
                                        globalFilter={globalFilter}
                                        emptyMessage="Veri bulunamadı"
                                        responsiveLayout="scroll"
                                    >
                                        <Column field="subjectId.subject" header="Konu" ></Column>
                                        <Column field="true" header="Doğru" sortable ></Column>
                                        <Column field="false" header="Yanlış" sortable ></Column>
                                        <Column field="pass" header="Boş" sortable ></Column>
                                    </DataTable>


                                </div>
                            </div>
                        </div>
                    </div>
                ) : (<></>)}
        </div>
    );
};

export default StudentDetail;