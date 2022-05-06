import React from "react"
import styled from "styled-components"
import Button from "@material-ui/core/Button"
import { BorderRadius, Spacing } from "shared/styles/styles"
import { RollStateList } from "staff-app/components/roll-state/roll-state-list.component"
import { Link } from "react-router-dom"

export type ActiveRollAction = "filter" | "exit" | "complete"
interface Props {
  isActive: boolean
  onItemClick: (action: ActiveRollAction, value?: string) => void
  rollTotals: { present: number; absent: number; late: number }
  totalStudents: number
  filterByOverlayBtn: (type: string) => void
}

export const ActiveRollOverlay: React.FC<Props> = (props) => {
  const { isActive, onItemClick, rollTotals, totalStudents, filterByOverlayBtn } = props

  return (
    <S.Overlay isActive={isActive}>
      <S.Content>
        <div>Class Attendance</div>
        <div>
          <RollStateList
            filterByOverlayBtn={filterByOverlayBtn}
            stateList={[
              { type: "all", count: totalStudents },
              { type: "present", count: rollTotals.present },
              { type: "late", count: rollTotals.late },
              { type: "absent", count: rollTotals.absent },
            ]}
          />
          <div style={{ marginTop: Spacing.u6, display: "flex" }} className="activeroll-actionwrap">
            <Button color="inherit" onClick={() => onItemClick("exit")}>
              Exit
            </Button>
            <Link to="/staff/activity">
              <p color="inherit" style={{ marginLeft: Spacing.u2, color: "white" }} onClick={() => onItemClick("complete")}>
                Complete
              </p>
            </Link>
          </div>
        </div>
      </S.Content>
    </S.Overlay>
  )
}

const S = {
  Overlay: styled.div<{ isActive: boolean }>`
    position: fixed;
    bottom: 0;
    left: 0;
    height: ${({ isActive }) => (isActive ? "120px" : 0)};
    width: 100%;
    background-color: rgba(34, 43, 74, 0.92);
    backdrop-filter: blur(2px);
    color: #fff;
  `,
  Content: styled.div`
    display: flex;
    justify-content: space-between;
    width: 52%;
    height: 100px;
    margin: ${Spacing.u3} auto 0;
    border: 1px solid #f5f5f536;
    border-radius: ${BorderRadius.default};
    padding: ${Spacing.u4};
  `,
}
