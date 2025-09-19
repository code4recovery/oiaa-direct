import {
  useEffect,
  useState,
} from "react"

import {
  COMMUNITIES,
  FEATURES,
  FORMATS,
  LANGUAGES,
  TYPE,
} from "@/meetingTypes"
import { fetchData } from "@/utils/meetings-utils"

export interface FacetOptions {
  types: Record<string, string>
  formats: Record<string, string>
  features: Record<string, string>
  communities: Record<string, string>
  languages: Record<string, string>
}

interface FacetCodeDesc {
  code: string
  desc: string
}

interface FacetsResponse {
  categories?: {
    communities?: FacetCodeDesc[]
    features?: FacetCodeDesc[]
    formats?: FacetCodeDesc[]
    type?: FacetCodeDesc[]
  }
  languages?: {
    English: string
    alpha2: string
  }[]
}

const fallbackFacetOptions: FacetOptions = {
  types: TYPE,
  formats: FORMATS,
  features: FEATURES,
  communities: COMMUNITIES,
  languages: LANGUAGES,
}

const facetsToRecord = (facets?: FacetCodeDesc[]) =>
  (facets ?? []).reduce<Record<string, string>>((acc, { code, desc }) => {
    if (code) acc[code] = desc
    return acc
  }, {})

const normalizeLanguage = (englishName: string) =>
  englishName.split(";")[0]?.trim() || englishName

function sortFacetRecord(
  unsorted: Record<string, string>,
  fallback: Record<string, string>
): Record<string, string> {
  const sorted: Record<string, string> = {}
  // Add keys from fallback in order if present in unsorted
  for (const key of Object.keys(fallback)) {
    if (key in unsorted) {
      sorted[key] = unsorted[key]
    }
  }
  // Add any extra keys from unsorted not in fallback
  for (const key of Object.keys(unsorted)) {
    if (!(key in sorted)) {
      sorted[key] = unsorted[key]
    }
  }
  return sorted
}

const mapFacets = (raw: FacetsResponse): FacetOptions => {
  const cats = raw.categories ?? {}
  const fetchedLanguages = Object.fromEntries(
    (raw.languages ?? [])
      .filter((lang) => lang.alpha2)
      .map((lang) => [lang.alpha2, normalizeLanguage(lang.English)])
  ) as Record<string, string>

  return {
    types: sortFacetRecord(facetsToRecord(cats.type), TYPE),
    formats: sortFacetRecord(facetsToRecord(cats.formats), FORMATS),
    features: sortFacetRecord(facetsToRecord(cats.features), FEATURES),
    communities: sortFacetRecord(facetsToRecord(cats.communities), COMMUNITIES),
    languages: sortFacetRecord(fetchedLanguages, LANGUAGES),
  }
}

export function useFacets(): {
  facetOptions: FacetOptions
  loading: boolean
  error?: Error
} {
  const [facetOptions, setFacetOptions] =
    useState<FacetOptions>(fallbackFacetOptions)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | undefined>(undefined)

  useEffect(() => {
    let cancelled = false
    async function fetchFacets() {
      try {
        const baseUrl = import.meta.env.VITE_CQ_URL as string
        if (!baseUrl) {
          throw new Error("App not configured correctly")
        }
        const url = `${baseUrl}/facets`
        const raw = await fetchData<FacetsResponse>(url)
        // Treat empty array (from fetchData error) as an error
        if (Array.isArray(raw) && raw.length === 0) {
          throw new Error("Facet response is empty (fetchData error)")
        }

        if (!cancelled) {
          setFacetOptions(mapFacets(raw))
          setLoading(false)
        }
      } catch (e) {
        console.error("Facet fetch error:", e)
        if (!cancelled) {
          setError(e instanceof Error ? e : new Error(String(e)))
          setFacetOptions(fallbackFacetOptions)
          setLoading(false)
        }
      }
    }
    void fetchFacets()
    return () => {
      cancelled = true
    }
  }, [])

  return { facetOptions, loading, error }
}
