import type { Application } from '../types'

const daysAgo = (n: number) => new Date(Date.now() - n * 86400000).toISOString()

export const mockApplications: Application[] = [
  // Sharma Traders · Accounts Intern (five students waiting)
  { id: 'app_1', internshipId: 'int_accounts', studentId: 'stu_aman', status: 'waiting', appliedAt: daysAgo(2), distanceKm: 4, source: 'student' },
  { id: 'app_2', internshipId: 'int_accounts', studentId: 'stu_neha', status: 'waiting', appliedAt: daysAgo(2), distanceKm: 3, source: 'student' },
  { id: 'app_3', internshipId: 'int_accounts', studentId: 'stu_rahul', status: 'waiting', appliedAt: daysAgo(1), distanceKm: 6, source: 'student' },
  { id: 'app_4', internshipId: 'int_accounts', studentId: 'stu_sneha', status: 'waiting', appliedAt: daysAgo(1), distanceKm: 2, source: 'student' },
  { id: 'app_5', internshipId: 'int_accounts', studentId: 'stu_karan', status: 'waiting', appliedAt: daysAgo(0), distanceKm: 5, source: 'student' },

  // Maharashtra Components · Operations Intern
  { id: 'app_6', internshipId: 'int_operations', studentId: 'stu_priya', status: 'waiting', appliedAt: daysAgo(1), distanceKm: 5, source: 'student' },
  { id: 'app_7', internshipId: 'int_operations', studentId: 'stu_rahul', status: 'waiting', appliedAt: daysAgo(3), distanceKm: 4, source: 'student' },

  // Patel Auto Parts · Inventory Assistant
  { id: 'app_8', internshipId: 'int_inventory', studentId: 'stu_priya', status: 'not_selected', appliedAt: daysAgo(5), decidedAt: daysAgo(2), distanceKm: 6, source: 'student' },
  { id: 'app_9', internshipId: 'int_inventory', studentId: 'stu_aman', status: 'accepted', appliedAt: daysAgo(5), decidedAt: daysAgo(3), startsOn: daysAgo(-2), distanceKm: 3, source: 'student' },

  // Deshmukh General Store · Digital Transformation Intern
  { id: 'app_10', internshipId: 'int_digital', studentId: 'stu_karan', status: 'waiting', appliedAt: daysAgo(0), distanceKm: 4, source: 'student' },
  { id: 'app_11', internshipId: 'int_digital', studentId: 'stu_neha', status: 'waiting', appliedAt: daysAgo(1), distanceKm: 5, source: 'student' },
]
