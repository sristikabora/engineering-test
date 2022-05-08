import React, { useState, useEffect } from "react"
import { Person } from "shared/models/person"
import { useApi } from "shared/hooks/use-api"
import { Activity } from "shared/models/activity"
import { CenteredContainer } from "shared/components/centered-container/centered-container.component"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

export const AttendancePercents: React.FC = () => {
  const [getStudents, data, studentloadState] = useApi<{ students: Person[] }>({ url: "get-homeboard-students" })
  const [getActivities, activities, activityloadState] = useApi<{ activity: Activity[] }>({ url: "get-activities" })

  useEffect(() => {
    void getActivities()
  }, [getActivities])

  useEffect(() => {
    void getStudents()
  }, [getStudents])

  const percentCalc = (id: number, action: string) => {
    let total: number = 0
    let present = 0
    if (activities?.activity && activities.activity.length > 0) {
      activities.activity.forEach((a) => {
        if (a.type === "roll") {
          total++
          let found = a.entity.student_roll_states.find((x) => {
            return x.student_id === id && (x.roll_state === "present" || x.roll_state === "late")
          })
          if (found) {
            present++
          }
        }
      })
    }
    let percent = !isNaN((present / total) * 100) ? (present / total) * 100 : 0
    if (action === "percent") {
      if (!isNaN((present / total) * 100)) return Math.round((present / total) * 100)
      else 0
    } else if (action === "alert") {
      if (percent < 75) return "yes"
      else return ""
    }
  }

  return (
    <>
      <div className="attendancePercents__wrapper">
        <p className="attendancePercents__headline">Overal Attendance</p>
        {(studentloadState === "loading" || activityloadState === "loading") && (
          <CenteredContainer>
            <FontAwesomeIcon icon="spinner" size="2x" spin />
          </CenteredContainer>
        )}
        {studentloadState === "loaded" && activityloadState === "loaded" && data?.students && data.students.length > 0 && (
          <>
            <table className="table table-striped attendancePercents__table">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">First</th>
                  <th scope="col">Handle</th>
                </tr>
              </thead>
              <tbody>
                {data.students.map((s) => (
                  <tr key={s.id}>
                    <th scope="row">{s.id}</th>
                    <td>{s.first_name + " " + s.last_name}</td>
                    <td data-alert={percentCalc(s.id, "alert")}>{percentCalc(s.id, "percent")}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
        {(studentloadState === "error" || activityloadState === "error") && (
          <CenteredContainer>
            <div>Failed to load</div>
          </CenteredContainer>
        )}
      </div>
    </>
  )
}
