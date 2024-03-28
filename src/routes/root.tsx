import { useEffect } from "react"
import {
  Form,
  NavLink,
  Outlet,
  useLoaderData,
  useNavigation,
  useRouteLoaderData,
  useSubmit,
} from "react-router-dom"

import { Box, Grid } from "@chakra-ui/react"

import { Meeting } from "../components/Meeting"
import { getMeetings } from "../meetings"

import type { Meeting as MeetingEntry } from "../types"
import type { LoaderFunctionArgs } from "react-router-dom"
export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url)
  const q = url.searchParams.get("q")
  const meetings = await getMeetings(q) // q === null ? "Men" : q)
  return { meetings, q }
}

export function useRootLoaderData() {
  return useRouteLoaderData("root")
}

export default function Root() {
  const { meetings, q } = useLoaderData() as {
    meetings: MeetingEntry[]
    q: string
  }
  const navigation = useNavigation()
  const submit = useSubmit()

  const searching =
    navigation.location &&
    new URLSearchParams(navigation.location.search).has("q")

  useEffect(() => {
    document.getElementById("q").value = q
  }, [q])

  return (
    <>
      <div id="sidebar">
        <h1>Online Intergroup Meetings</h1>
        <Grid
          as="section"
          gap={{ base: 4, md: 6 }}
          templateColumns={{
            md: "auto 300px",
          }}
          w="full"
        >
          <Box as="section" order={{ base: 1, md: 2 }}>
            <div>
              <Form id="search-form" role="search">
                <input
                  id="q"
                  className={searching ? "loading" : ""}
                  aria-label="Search meetings"
                  placeholder="Search"
                  type="search"
                  name="q"
                  defaultValue={q}
                  onChange={(event) => {
                    const isFirstSearch = q == null
                    submit(event.currentTarget.form, {
                      replace: !isFirstSearch,
                    })
                  }}
                />
                <div id="search-spinner" aria-hidden hidden={!searching} />
                <div className="sr-only" aria-live="polite"></div>
              </Form>
            </div>
          </Box>
          <Box order={{ base: 2, md: 1 }}>
            <nav>
              {meetings.length ? (
                <ul>
                  {meetings.map((meeting, index: number) => (
                    <li key={meeting.slug}>
                      <NavLink
                        to={`meetings/${meeting.slug}`}
                        className={({ isActive, isPending }) =>
                          isActive ? "active" : isPending ? "pending" : ""
                        }
                      >
                        {/* {meeting.name ? <>{meeting.name}</> : <i>No Meetings</i>}{" "} */}
                        <Meeting
                          key={index}
                          link={`/${meeting.slug}`}
                          meeting={meeting}
                        />
                      </NavLink>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>
                  <i>No meetings</i>
                </p>
              )}
            </nav>
          </Box>
        </Grid>
      </div>
      <div
        id="detail"
        className={navigation.state === "loading" ? "loading" : ""}
      >
        <Outlet />
      </div>
    </>
  )
}
