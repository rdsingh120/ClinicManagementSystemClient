import { useEffect, useState } from 'react'
import { searchDoctors } from '../api/doctor.api'
import DoctorCard from '../components/DoctorCard'

const PAGE_SIZE = 3

const FindADoctorPage = () => {
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [searchTerm, setSearchTerm] = useState('')
  const [specialty, setSpecialty] = useState('')
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [total, setTotal] = useState(0)

  const [activeFilters, setActiveFilters] = useState({
    search: '',
    specialty: ''
  })

  useEffect(() => {
    let mounted = true
      ; (async () => {
        setLoading(true)
        setError('')
        const {
          success,
          doctors: list,
          message,
          hasMore: more,
          total: totalCount
        } = await searchDoctors({
          search: activeFilters.search,
          specialty: activeFilters.specialty,
          page,
          limit: PAGE_SIZE
        })

        if (!mounted) return

        if (success && Array.isArray(list)) {
          setDoctors(list)
          setHasMore(!!more)
          setTotal(typeof totalCount === 'number' ? totalCount : list.length)
        } else {
          setDoctors([])
          setHasMore(false)
          setTotal(0)
          setError(message || 'Failed to load doctors')
        }
        setLoading(false)
      })()
    return () => {
      mounted = false
    }
  }, [activeFilters, page])

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    setPage(1)
    setActiveFilters({
      search: searchTerm.trim(),
      specialty
    })
  }

  const handleClearFilters = () => {
    setSearchTerm('')
    setSpecialty('')
    setPage(1)
    setActiveFilters({
      search: '',
      specialty: ''
    })
  }

  const totalPages = total ? Math.ceil(total / PAGE_SIZE) : 1

  return (
    <div className="bg-gray-50 flex-1 p-6 rounded-tl-2xl">
      <div className="mx-auto flex max-w-6xl flex-col rounded-2xl bg-white p-6 pb-24 overflow-y-auto max-h-[calc(100vh-7rem)]">
        <section className="mb-6 rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50 via-sky-50 to-white p-4 shadow-sm">
          <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Find a doctor</h1>
              <p className="text-sm text-gray-600">
                Search by doctor name and filter by specialization to book your
                next appointment.
              </p>
            </div>
            {!loading && (
              <p className="text-sm text-gray-500">
                Showing <span className="font-medium">{doctors.length}</span> of{' '}
                <span className="font-medium">{total}</span> doctors
              </p>
            )}
          </div>

          <form
            onSubmit={handleSearchSubmit}
            className="flex flex-wrap items-center gap-3 border-t border-indigo-100 pt-4"
          >
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by doctor name"
              className="w-full max-w-xs rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <select
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              className="w-full max-w-xs rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All specializations</option>
              <option value="General Practitioner">General Practitioner</option>
              <option value="Internal Medicine">Internal Medicine</option>
              <option value="Neurologist">Neurologist</option>
              <option value="Cardiologist">Cardiologist</option>
              <option value="Dermatologist">Dermatologist</option>
              <option value="Pediatrician">Pediatrician</option>
              <option value="Oncologist">Oncologist</option>
              <option value="Psychiatrist">Psychiatrist</option>
              <option value="Radiologist">Radiologist</option>
              <option value="Surgeon">Surgeon</option>
            </select>

            <button
              type="submit"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
              disabled={loading}
            >
              Search
            </button>

            <button
              type="button"
              onClick={handleClearFilters}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-60"
              disabled={loading && !searchTerm && !specialty}
            >
              Clear
            </button>
          </form>
        </section>

        {/* Main content area */}
        <div className="flex-1">
          {loading && (
            <section className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="flex flex-col rounded-2xl border bg-white p-4 shadow-sm animate-pulse"
                >
                  <div className="w-full overflow-hidden rounded-2xl bg-gray-100">
                    <div className="relative w-full aspect-[3/4]" />
                  </div>
                  <div className="mt-4 h-4 w-2/3 rounded bg-gray-200" />
                  <div className="mt-3 h-6 w-24 rounded-full bg-gray-200" />
                </div>
              ))}
            </section>
          )}

          {!loading && error && (
            <p className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
              {error}
            </p>
          )}

          {!loading && !error && !doctors.length && (
            <div className="rounded-xl border border-dashed p-8 text-center text-gray-500">
              No doctors found. Try a different name or specialization.
            </div>
          )}

          {!loading && !error && doctors.length > 0 && (
            <section className="mt-2 grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-6">
              {doctors.map((d) => (
                <DoctorCard key={d._id} doc={d} />
              ))}
            </section>
          )}
        </div>

        {/* Pagination */}
        {!loading && !error && doctors.length > 0 && (
          <div className="mt-8 flex items-center justify-between border-t border-gray-100 pt-4">
            <button
              type="button"
              className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              disabled={page <= 1 || loading}
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
            >
              Previous
            </button>

            <p className="text-sm text-gray-500">
              Page {page} of {totalPages}
            </p>

            <button
              type="button"
              className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              disabled={!hasMore || loading}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default FindADoctorPage
