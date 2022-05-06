import React from "react"
import { RollListStudent } from "../roll-list-student/roll-list-student.component"
import { Activity } from "shared/models/activity"

interface Props {
  roll: any
  date: Date
  id: string
}

export const RollList: React.FC<Props> = ({ roll, date, id }) => {
  // const dateFormater = (date: Date) => {
  //   console.log(date)
  //   let text = date.toLocaleDateString()
  //   return text
  // }

  return (
    <div className="rollList__wrap">
      <div className="rollDetails">
        <h2 className="roll-id">{id}</h2>
        <h3 className="roll-time">{date}</h3>
      </div>
      <table className="table">
        <thead className="thead-dark">
          <tr>
            <th scope="col">Student Id</th>
            <th scope="col">Name</th>
            <th scope="col">Status</th>
          </tr>
        </thead>
        <tbody>
          {roll.map((a: any) => (
            <RollListStudent key={a.student_id} id={a.student_id} state={a.roll_state}></RollListStudent>
          ))}
        </tbody>
      </table>
    </div>
  )
}
