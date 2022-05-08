import React, { useState } from "react"
import { RolllStateType } from "shared/models/roll"
import { RollStateIcon } from "staff-app/components/roll-state/roll-state-icon.component"

interface Props {
  currentState: RolllStateType
  size?: number
  onStateChange?: (newState: RolllStateType) => void
  rollLister: any
  personId: number
}
export const RollStateSwitcher: React.FC<Props> = ({ size = 40, onStateChange, rollLister, personId, currentState }) => {
  const [rollState, setRollState] = useState(currentState)

  const nextState = () => {
    const states: RolllStateType[] = ["present", "late", "absent"]
    if (rollState === "unmark" || rollState === "absent") return states[0]
    const matchingIndex = states.findIndex((s) => s === rollState)
    return matchingIndex > -1 ? states[matchingIndex + 1] : states[0]
  }

  const onClick = () => {
    const next = nextState()
    setRollState(next)
    rollLister(next, personId)
    if (onStateChange) {
      onStateChange(next)
    }
  }

  return <RollStateIcon type={rollState} size={size} onClick={onClick} />
}
