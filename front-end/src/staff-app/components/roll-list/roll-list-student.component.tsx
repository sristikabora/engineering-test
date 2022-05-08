import React, { useEffect } from "react"
import { Person } from "shared/models/person"
import { useApi } from "shared/hooks/use-api"
import { RollStateIcon } from "staff-app/components/roll-state/roll-state-icon.component"
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

  //gets fullname according to id
  const getName = () => {
    const x = data?.students.find((s) => s.id === id)
    if (x) {
      return x.first_name + " " + x.last_name
    }
  }

  return (
    <>
      <tr>
        {loadState === "loaded" && data?.students && (
          <>
            <th scope="row">{id}</th>
            <td>{getName()}</td>
            <td>
              <RollStateIcon type={state} size={20} />
            </td>
          </>
        )}
      </tr>
    </>
  )
}
