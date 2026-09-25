import { useParams } from 'react-router-dom'
import { Award } from 'lucide-react'
import { useApp } from '../../hooks/useApp'
import { BackButton } from '../../components/ui/PageHeader'
import { Card, SectionLabel } from '../../components/ui/Card'
import { Chip } from '../../components/ui/Chip'
import { Tag } from '../../components/ui/Tag'
import { LinkButton } from '../../components/ui/Button'
import { EmptyState } from '../../components/ui/EmptyState'
import { CheckBurst } from '../../components/brand/Spot'
import { SegmentBar } from '../../components/ui/Progress'
import { findCourse, courseProgress, isCourseComplete, isLessonDone } from '../../lib/courses'
import { t } from '../../lib/i18n'

export default function CourseDetail() {
  const { id } = useParams()
  const { currentStudent, updateStudent } = useApp()
  const course = id ? findCourse(id) : undefined

  if (!course) {
    return (
      <div className="pt-2">
        <BackButton to="/student/courses" />
        <EmptyState
          title={t("We couldn't find that course")}
          body={t('Here are the courses you can start.')}
          action={<LinkButton to="/student/courses" full>{t('See all courses')}</LinkButton>}
        />
      </div>
    )
  }

  const done = courseProgress(currentStudent, course)
  const complete = isCourseComplete(currentStudent, course)

  const toggleLesson = (lessonId: string) => {
    const has = currentStudent.completedLessons.includes(lessonId)
    updateStudent(currentStudent.id, {
      completedLessons: has ? currentStudent.completedLessons.filter((l) => l !== lessonId) : [...currentStudent.completedLessons, lessonId],
    })
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-5">
      <BackButton to="/student/courses" label={t('Back to courses')} />

      {complete ? (
        <div className="flex flex-col items-center pt-2 text-center">
          <CheckBurst size={112} />
          <h1 className="mt-4 text-title font-bold">{t("You're Setu Certified in {title}", { title: t(course.title) })}</h1>
          <p className="mt-2 max-w-sm text-body text-muted">
            {t('This now shows on your profile and to businesses when you apply.')}
          </p>
        </div>
      ) : (
        <header>
          <h1 className="text-title font-bold">{t(course.title)}</h1>
          <p className="mt-1 text-body text-muted">{t(course.summary)}</p>
          <div className="mt-4 flex flex-col gap-1.5">
            <SegmentBar step={done} total={course.lessons.length} />
            <p className="text-detail text-muted">{t('{done} of {total} lessons done', { done, total: course.lessons.length })}</p>
          </div>
        </header>
      )}

      {complete && (
        <div>
          <Tag tone="trust" icon={<Award className="size-3.5" aria-hidden="true" />}>{t('Setu Certified · {skill}', { skill: t(course.skill) })}</Tag>
        </div>
      )}

      <div className="flex flex-col gap-3">
        <SectionLabel>{t('Lessons')}</SectionLabel>
        {course.lessons.map((lesson, i) => {
          const lessonDone = isLessonDone(currentStudent, lesson.id)
          return (
            <Card key={lesson.id} className="flex flex-col gap-2 p-4">
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-body font-semibold">{t('{n}. {title}', { n: i + 1, title: t(lesson.title) })}</h2>
              </div>
              <p className="text-button text-ink/90">{t(lesson.body)}</p>
              <div className="mt-1">
                <Chip kind="pick" selected={lessonDone} onClick={() => toggleLesson(lesson.id)}>
                  {lessonDone ? t('Done') : t('Mark as done')}
                </Chip>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
