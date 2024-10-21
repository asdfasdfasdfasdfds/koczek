import { Demo } from '@/types';

export const ExamClasseservice = {
    getExamClasses() {
        return fetch('/demo/data/exam-classes.json', { headers: { 'Cache-Control': 'no-cache' } })
            .then((res) => res.json())
            .then((d) => d.data as Demo.Exam[]);
    },
    getExamResultClasses() {
        return fetch('/demo/data/exam-result-add.json', { headers: { 'Cache-Control': 'no-cache' } })
            .then((res) => res.json())
            .then((d) => d.data as Demo.Exam[]);
    },
    getSubjects() {
        return fetch('/demo/data/subjects-success-ratio.json', { headers: { 'Cache-Control': 'no-cache' } })
            .then((res) => res.json())
            .then((d) => d.data as Demo.SubjectSuccessRaito[]);
    },
    getLessonsRatio() {
        return fetch('/demo/data/lessons-success-ratio.json', { headers: { 'Cache-Control': 'no-cache' } })
            .then((res) => res.json())
            .then((d) => d.data as Demo.LessonsSuccessRatio[]);
    },
    getSelectedSubjectRatio() {
        return fetch('/demo/data/selected-subjects-ratio.json', { headers: { 'Cache-Control': 'no-cache' } })
            .then((res) => res.json())
            .then((d) => d.data as Demo.LessonsSuccessRatio[]);
    },
    getStudents() {
        return fetch('/demo/data/students.json', { headers: { 'Cache-Control': 'no-cache' } })
            .then((res) => res.json())
            .then((d) => d.data as Demo.Student[]);
    },
    getAdminControls() {
        return fetch('/demo/data/admin-control.json', { headers: { 'Cache-Control': 'no-cache' } })
            .then((res) => res.json())
            .then((d) => d.data as  any[]);
    },
};
