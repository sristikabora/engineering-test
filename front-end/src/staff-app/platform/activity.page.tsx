import React from "react"
import { useApi } from "shared/hooks/use-api"
import { Activity } from "shared/models/activity"
import { useEffect } from "react"
import { RollList } from "staff-app/components/roll-list/roll-list.component"
import { CenteredContainer } from "shared/components/centered-container/centered-container.component"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { AttendancePercents } from "staff-app/components/attendance-percents/atendance-percents.component"

export const ActivityPage: React.FC = () => {
  const [getActivities, data, loadState] = useApi<{ activity: Activity[] }>({ url: "get-activities" })

  useEffect(() => {
    void getActivities()
  }, [getActivities])

  return (
    <div className="rollpage__wrapper">
      <div>
        <div className="rollpage__headline-wrap">
          <h1 className="rollpage__headline">List Of All Rolls</h1>
          <span className="rollpage__underline"></span>
        </div>
        {loadState === "loading" && (
          <CenteredContainer>
            <FontAwesomeIcon icon="spinner" size="2x" spin />
          </CenteredContainer>
        )}
        {loadState === "loaded" && data?.activity && data.activity.length > 0 && (
          <>{data.activity.map((a) => (a.type === "roll" ? <RollList key={a.entity.id} id={a.entity.name} roll={a.entity.student_roll_states} date={a.date} /> : ""))}</>
        )}

        {loadState === "loaded" && (data?.activity === undefined || data.activity.length === 0) ? <p className="rollPage__nodata">No data to display</p> : null}
      </div>
      <AttendancePercents />
    </div>
  )
}
