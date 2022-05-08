import React, { useEffect } from "react"
import { RollListStudent } from "./roll-list-student.component"
import { RolllStateType } from "shared/models/roll"
import { Person } from "shared/models/person"
import { useApi } from "shared/hooks/use-api"

interface Props {
  roll: any
  date: Date
  id: string
}

export const RollList: React.FC<Props> = ({ roll, date, id }) => {
  const [getStudents, data, loadState] = useApi<{ students: Person[] }>({ url: "get-homeboard-students" })

  useEffect(() => {
    void getStudents()
  }, [getStudents])

  //formats date to human readable
  const dateFormater = (date: Date) => {
    let formattedDate = new Date(date)
    return formattedDate.toDateString()
  }

  //calculates total of each state to display on top of each table
  const calculate = (state: RolllStateType) => {
    let total: number = 0
    if (state === "unmark") {
      if (data) {
        return data.students.length - roll.length
      }
    }
    roll.map((r: any) => {
      if (r.roll_state === state) total++
    })
    return total
  }

  return (
    <div className="rollList__wrap">
      <div className="rollDetails">
        <h2 className="roll-id">#{id}</h2>
        <h3 className="roll-time">{dateFormater(date)}</h3>
        <ul className="rollDetails__right">
          <li className="rollDetails__total">
            Present:<span className="present-total">{calculate("present")}</span>
          </li>
          <li className="rollDetails__total">
            Late:<span className="late-total">{calculate("late")}</span>
          </li>
          <li className="rollDetails__total">
            Absent:<span className="absent-total">{calculate("absent")}</span>
          </li>
          <li className="rollDetails__total">
            Unmarked:<span className="unmarked-total">{calculate("unmark")}</span>
          </li>
        </ul>
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
