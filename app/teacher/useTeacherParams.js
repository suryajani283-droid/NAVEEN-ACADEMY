import { useSearchParams } from 'next/navigation'

export function useTeacherParams() {
  const params = useSearchParams()
  return {
    teacherClass: params.get('class') || '',
    subject: params.get('subject') || '',
  }
}