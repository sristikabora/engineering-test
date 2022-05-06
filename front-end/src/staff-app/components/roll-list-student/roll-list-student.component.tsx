import React, { useState, useEffect } from "react"
import { Person } from "shared/models/person"
import { useApi } from "shared/hooks/use-api"
import { RollStateIcon } from "staff-app/components/roll-state/roll-state-icon.component"
import { getToPathname } from "react-router/lib/router"
import { RolllStateType } from "shared/models/roll"

interface Props {
  state: RolllStateType
  id: number
}
export const RollListStudent: React.FC<Props> = ({ state, id }) => {
  const [getStudents, data, loadState] = useApi<{ students: Person[] }>({ url: "get-homeboard-students" })

  useEffect(() => {
    void getStudents()
  }, [getStudents])

  const getName = () => {
    const x = data?.students.find((s) => s.id === id)
    if (x) {
      return x.first_name + " " + x.last_name
    }
  }

  return (
    <>
      <tr>
        <th scope="row">{id}</th>
        {data?.students && (
          <>
            <td>{getName()}</td>
          </>
        )}

        <td>
          <RollStateIcon type={state} size={20} />
        </td>
      </tr>
    </>
  )
}
