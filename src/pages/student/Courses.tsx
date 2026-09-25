import { useApp } from '../../hooks/useApp'
import { PageTitle } from '../../components/ui/PageHeader'
import { HelperNote } from '../../components/ui/HelperNote'
import { CourseCard } from '../../components/student/CourseCard'
import { mockCourses } from '../../data/mockCourses'
import { certifiedCourses } from '../../lib/courses'
import { plural } from '../../lib/format'
import { t } from '../../lib/i18n'

export default function Courses() {
  const { currentStudent } = useApp()
  const certified = certifiedCourses(currentStudent).length

  return (
    <div className="flex flex-col gap-5">
      <PageTitle
        title={t('Courses')}
        sub={certified > 0 ? t('You are Setu Certified in {count}.', { count: plural(certified, 'course') }) : t('Learn a skill and get Setu Certified before you apply.')}
      />

      <HelperNote>
        {t('Free, short courses. Finish one to get a Setu Certified badge that businesses see on your application.')}
      </HelperNote>

      <section aria-label={t('Courses')} className="grid gap-3 sm:grid-cols-2">
        {mockCourses.map((course) => (
          <CourseCard key={course.id} course={course} student={currentStudent} />
        ))}
      </section>
    </div>
  )
}
