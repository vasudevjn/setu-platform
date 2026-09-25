import { mockCourses } from '../data/mockCourses'
import type { Student, Course } from '../types'

export const findCourse = (id: string) => mockCourses.find((c) => c.id === id)

export const isLessonDone = (student: Student, lessonId: string) =>
  student.completedLessons.includes(lessonId)

export const courseProgress = (student: Student, course: Course) =>
  course.lessons.filter((l) => isLessonDone(student, l.id)).length

export const isCourseComplete = (student: Student, course: Course) =>
  courseProgress(student, course) === course.lessons.length

export const certifiedCourses = (student: Student) =>
  mockCourses.filter((c) => isCourseComplete(student, c))
