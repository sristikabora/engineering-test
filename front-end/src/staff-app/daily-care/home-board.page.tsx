import React, { useState, useEffect } from "react"
import styled from "styled-components"
import Button from "@material-ui/core/ButtonBase"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Spacing, BorderRadius, FontWeight } from "shared/styles/styles"
import { Colors } from "shared/styles/colors"
import { CenteredContainer } from "shared/components/centered-container/centered-container.component"
import { Person } from "shared/models/person"
import { useApi } from "shared/hooks/use-api"
import { StudentListTile } from "staff-app/components/student-list-tile/student-list-tile.component"
import { ActiveRollOverlay, ActiveRollAction } from "staff-app/components/active-roll-overlay/active-roll-overlay.component"
import { RollInput } from "shared/models/roll"
import { RolllStateType } from "shared/models/roll"

export const HomeBoardPage: React.FC = () => {
  const [getStudents, data, loadState] = useApi<{ students: Person[] }>({ url: "get-homeboard-students" })
  const [setRole] = useApi<{ student: RollInput }>({ url: "save-roll" })

  const [isRollMode, setIsRollMode] = useState(false)
  const [sortOrder, setSortOrder] = useState("initial")
  const [sortBy, setSortBy] = useState("first_name")
  const [currentList, setCurrentList] = useState([{ id: 0, first_name: "", last_name: "" }])
  const [currentStr, setCurrentStr] = useState("")
  const [rollStateListWithIds, setrollStateListWithIds] = useState([{ student_id: 0, roll_state: "initial" }])
  const [rollTotals, setRollTotals] = useState({ present: 0, absent: 0, late: 0 })

  useEffect(() => {
    void getStudents()
  }, [getStudents])

  //sets currentlist when data is loaded
  useEffect(() => {
    if (data != undefined) {
      let a = data.students
      setCurrentList(a)
    }
  }, [data])

  //componentWillUnmount
  useEffect(() => {
    return () => {
      setIsRollMode(false)
    }
  }, [])

  //updates total of each roll state every time user updates a roll
  useEffect(() => {
    let present: number, absent: number, late: number
    present = absent = late = 0

    rollStateListWithIds.forEach(function (s) {
      if (s.roll_state === "present") {
        present++
      } else if (s.roll_state === "absent") {
        absent++
      } else if (s.roll_state === "late") {
        late++
      }
    })
    setRollTotals({ present: present, absent: absent, late: late })
  }, [rollStateListWithIds])

  //sorts in Ascending by firstname or lastname indicated through parameter 'by'
  const sortAsc = function (list: any, by: string) {
    list.sort((a: any, b: any) => (a[by] > b[by] ? 1 : -1))
    return list
  }

  //sorts in Descending by firstname or lastname indicated through parameter 'by'
  const sortDsc = function (list: any, by: string) {
    list.sort((a: any, b: any) => (a[by] < b[by] ? 1 : -1))
    return list
  }

  //finds student by id
  const search = (what: number, array: Array<{ student_id: number; roll_state: string }>) => array.find((element) => element.student_id === what)

  //performs actions according to togglebar clicks and updates the currentList(the list from where the rendering takes place)
  const onToolbarAction = (action: ToolbarAction) => {
    if (action === "roll") {
      setIsRollMode(true)
    } else if (action === "sortToggle") {
      let a = currentList
      if (sortOrder === "initial" || sortOrder === "asc") {
        a = sortAsc(a, sortBy)
        setSortOrder("dsc")
      } else {
        a = sortDsc(a, sortBy)
        setSortOrder("asc")
      }
      setCurrentList(a)
    } else if (action === "sortBy") {
      let a = currentList
      if (sortOrder === "initial" || sortOrder === "asc") {
        a = sortAsc(a, sortBy)
      } else if (sortOrder === "dsc") {
        a = sortDsc(a, sortBy)
      }
      setSortBy(sortBy === "first_name" ? "last_name" : "first_name")
      setCurrentList(a)
    }
  }

  //exits from roll-mode or completes a roll and saves the copy according to user action on roll overlay
  const onActiveRollAction = (action: ActiveRollAction) => {
    if (action === "exit") {
      setIsRollMode(false)
      if (data?.students) {
        setCurrentList(data.students)
      }
      setRollTotals({ present: 0, absent: 0, late: 0 })
      setrollStateListWithIds([{ student_id: 0, roll_state: "initial" }])
    } else if (action === "complete") {
      setRole({ student_roll_states: rollStateListWithIds })
    }
  }

  //updates the rollstate of a student during an active roll session or adds new student with rollstate in rollStateListWithIds
  const rollLister = (roll: string, id: number) => {
    let list = rollStateListWithIds
    let listFiltered: Array<{ student_id: number; roll_state: string }> = list.filter(function (obj) {
      return obj.student_id !== 0
    })
    const found = search(id, listFiltered)
    if (found) {
      found.roll_state = roll
    } else {
      listFiltered.push({ student_id: id, roll_state: roll })
    }
    setrollStateListWithIds(listFiltered)
  }

  //performs search by student name
  const handleSubmit = function (e: Event) {
    e.preventDefault()
    let newArr: Array<{ id: number; first_name: string; last_name: string }> = []
    data?.students.map(function (s) {
      const fullname = s.first_name + " " + s.last_name
      if (fullname.toLowerCase().includes(currentStr.toLowerCase())) {
        newArr.push(s)
      }
    })
    setCurrentList(newArr)
  }

  //filters students by click on different roll-state icons on overall
  const filterByOverlayBtn = (state: string) => {
    let a = data?.students
    if (state !== "all") {
      let listOfStudents: Array<{ id: number; first_name: string; last_name: string }> = []
      let idsWithState = rollStateListWithIds.filter((s) => s.roll_state === state)
      if (a && idsWithState && idsWithState.length > 0) {
        a?.forEach((s) => {
          idsWithState.forEach((x) => {
            if (s.id === x.student_id) {
              listOfStudents.push(s)
            }
          })
        })
      }
      setCurrentList(listOfStudents)
    } else {
      if (a) {
        setCurrentList(a)
      }
    }
  }

  //allows to keep the roll state icon color even after rerendering(which happens when we click on different state icons)
  const currentState = (id: number) => {
    const found = rollStateListWithIds.filter((r) => {
      return r.student_id === id
    })
    if (found && found.length === 1) {
      return found[0].roll_state as RolllStateType
    } else return "unmark" as RolllStateType
  }

  //resets on clicking reset button
  const resetToInitialList = () => {
    if (data?.students) {
      setCurrentList(data.students)
    }
  }

  return (
    <>
      <S.PageContainer>
        <Toolbar
          onItemClick={onToolbarAction}
          sortorder={sortOrder}
          sortby={sortBy}
          handleSubmit={handleSubmit}
          currentStr={currentStr}
          setCurrentStr={setCurrentStr}
          resetToInitialList={resetToInitialList}
        />

        {loadState === "loading" && (
          <CenteredContainer>
            <FontAwesomeIcon icon="spinner" size="2x" spin />
          </CenteredContainer>
        )}

        {loadState === "loaded" && data?.students && currentList.length > 0 && Object.keys(currentList[0]) && (
          <>
            {currentList.map((s) => (
              <StudentListTile key={s.id} isRollMode={isRollMode} student={s} rollLister={rollLister} currentState={currentState(s.id)} />
            ))}
          </>
        )}

        {loadState === "error" && (
          <CenteredContainer>
            <div>Failed to load</div>
          </CenteredContainer>
        )}
      </S.PageContainer>
      {loadState === "loaded" && data?.students && (
        <ActiveRollOverlay
          isActive={isRollMode}
          onItemClick={onActiveRollAction}
          rollTotals={rollTotals}
          totalStudents={data.students.length}
          filterByOverlayBtn={filterByOverlayBtn}
        />
      )}
    </>
  )
}

type ToolbarAction = "roll" | "sortToggle" | "sortBy"
interface ToolbarProps {
  onItemClick: (action: ToolbarAction, value?: string) => void
  sortorder: string
  sortby: string
  handleSubmit: any
  currentStr: string
  setCurrentStr: any
  resetToInitialList: () => void
}

const Toolbar: React.FC<ToolbarProps> = (props) => {
  const { onItemClick, sortorder, sortby, handleSubmit, setCurrentStr, resetToInitialList } = props

  return (
    <S.ToolbarContainer>
      <S.Button onClick={() => onItemClick("sortToggle")}>{sortorder === "initial" || sortorder === "asc" ? "Ascending" : "Descending"}</S.Button>
      <S.Button onClick={() => onItemClick("sortBy")}>{sortby === "initial" || sortby === "first_name" ? "By First Name" : "By Last Name"}</S.Button>
      <div className="toolbar__searchwrap">
        <form onSubmit={handleSubmit} className="toggleBar__search">
          <input type="text" className="toggleBar__search-input" onChange={(event) => setCurrentStr(event.target.value)} id="searchedInput" placeholder="Search.." name="search" />
          <button type="submit" className="toggleBar__search-submit">
            <i className="fa fa-search" style={{ color: "black" }}></i>
          </button>
        </form>
        <S.Button onClick={() => resetToInitialList()}>
          <img className="toolbar__reset-icon" src="http://localhost:3000/src/assets/images/undo-free-icon-font.svg" alt="reset-icon" />
        </S.Button>
      </div>
      <S.Button onClick={() => onItemClick("roll")}>Start Roll</S.Button>
    </S.ToolbarContainer>
  )
}

const S = {
  PageContainer: styled.div`
    display: flex;
    flex-direction: column;
    width: 50%;
    margin: ${Spacing.u4} auto 140px;
  `,
  ToolbarContainer: styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #fff;
    background-color: ${Colors.blue.base};
    padding: 6px 14px;
    font-weight: ${FontWeight.strong};
    border-radius: ${BorderRadius.default};
    flex-wrap: wrap;
  `,
  Button: styled(Button)`
    && {
      padding: ${Spacing.u2};
      font-weight: ${FontWeight.strong};
      border-radius: ${BorderRadius.default};
    }
  `,
}
