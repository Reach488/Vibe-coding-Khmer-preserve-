// Plain words for the status column added in supabase/gate.sql. Shared by
// /my-entries and by the entry page, which marks an unpublished entry for the
// owner or reviewer looking at it.
export const STATUS_LABELS = {
  pending: { en: "Waiting for review", km: "កំពុងរង់ចាំការត្រួតពិនិត្យ" },
  published: { en: "Published", km: "បានផ្សាយ" },
  returned: { en: "Returned — needs changes", km: "ត្រូវបានបញ្ជូនមកវិញ — ត្រូវការកែប្រែ" },
};
