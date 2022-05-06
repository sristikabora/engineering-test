import React from "react"
import { useApi } from "shared/hooks/use-api"
import { Activity } from "shared/models/activity"
import { useEffect } from "react"
import { RollList } from "staff-app/components/roll-list/roll-list.component"

export const ActivityPage: React.FC = () => {
  const [getActivities, data, loadState] = useApi<{ activity: Activity[] }>({ url: "get-activities" })

  useEffect(() => {
    void getActivities()
  }, [getActivities])

  useEffect(() => {
    if (data != undefined) {
      console.log("activities", data.activity)
    }
  }, [data])

  return (
    <div>
      <div className="imgwicons__headlinewrap">
        <h1 className="imgwicons__headline">List Of All Rolls</h1>
        <span className="imgwicons__underline"></span>
      </div>
      {data?.activity && (
        <>{data.activity.map((a) => (a.type === "roll" ? <RollList key={a.entity.id} id={a.entity.name} roll={a.entity.student_roll_states} date={a.date} /> : ""))}</>
      )}
    </div>
  )
}
