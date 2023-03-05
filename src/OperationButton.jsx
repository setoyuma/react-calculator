import { ACTIONS } from "./App"


export default function OperationButton({ dispatch, operation }) {
    return <button onClick={() => dispatch({ type: ACTIONS.CHOP, payload: { operation }})}>{operation}</button>
}