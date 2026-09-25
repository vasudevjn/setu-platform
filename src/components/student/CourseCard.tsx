import { Link } from 'react-router-dom'
import { Award, BookOpen } from 'lucide-react'
import type { Course, Student } from '../../types'
import { Tag } from '../ui/Tag'
import { SegmentBar } from '../ui/Progress'
import { courseProgress, isCourseComplete } from '../../lib/courses'
import { plural } from '../../lib/format'
import { t } from '../../lib/i18n'

export function CourseCard({ course, student }: { course: Course; student: Student }) {
  const done = courseProgress(student, course)
  const complete = isCourseComplete(student, course)
  return (
    <article className="relative flex flex-col gap-3 rounded-card bg-white p-4 shadow-card transition-shadow duration-200 focus-within:shadow-lift hover:shadow-lift">
      <div className="flex items-start gap-3">
        <span className="grid size-11 shrink-0 place-items-center rounded-full bg-teal-mist text-teal">
          <BookOpen className="size-5" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="text-heading font-semibold leading-snug">
            <Link to={`/student/courses/${course.id}`} className="after:absolute after:inset-0 after:rounded-card after:content-['']">
              {t(course.title)}
            </Link>
          </h2>
          <p className="mt-0.5 text-detail text-muted">{t(course.summary)}</p>
        </div>
      </div>

      {complete ? (
        <Tag tone="trust" icon={<Award className="size-3.5" aria-hidden="true" />}>{t('Setu Certified')}</Tag>
      ) : (
        <div className="flex flex-col gap-1.5">
          <SegmentBar step={done} total={course.lessons.length} />
          <p className="text-detail text-muted">
            {done === 0 ? t('{count} to finish', { count: plural(course.lessons.length, 'lesson') }) : t('{done} of {total} lessons done', { done, total: course.lessons.length })}
          </p>
        </div>
      )}
    </article>
  )
}
