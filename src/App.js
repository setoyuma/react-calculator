import { useReducer } from 'react';
import './styles.css'
import DigitButton from './DigitButton';
import OperationButton from './OperationButton';

export const ACTIONS = {
  ADD: "add-digit",
  CHOP: "choose-operation",
  CLS: "clear",
  DEL: "delete-digit",
  EVAL: "evaluate"
}

function reducer(state, {type, payload}) {
  switch (type) {
    case ACTIONS.ADD:
      if (state.overwrite) {
        return {
          ...state,
          currentOp: payload.digit,
          overwrite: false
        }
      }
      if (payload.digit === "0" && state.currentOp === "0") {
        return state
      }
      if (payload.digit === "." && state.currentOp.includes(".")) {
        return state
      }
      return {
        ...state,
        currentOp: `${state.currentOp || ""}${payload.digit}`
      }
      
    case ACTIONS.CHOP:
      if (state.currentOp == null && state.prevOp ==  null) {
        return state
      }

      if (state.currentOp === null) {
        return {
          ...state,
          operation: payload.operation
        }
      }

      if (state.prevOp == null) {
        return {
          ...state,
          operation: payload.operation,
          prevOp: state.currentOp,
          currentOp: null,
        }
      }

      return {
        ...state,
        prevOp: evaluate(state),
        operation: payload.operation,
        currentOp: null,
      }
    case ACTIONS.CLS:
      return {}
    
    case ACTIONS.DEL:
      if (state.overwrite) {
        return {
          ...state,
          overwrite: false,
          currentOp: null
        }
      }
      if (state.currentOp === null) return {}
      if (state.currentOp.length === 1) {
        return {
          ...state,
          currentOp: null
        }
      }
      return {
        ...state,
        currentOp: state.currentOp.slice(0, -1)
      }

    case ACTIONS.EVAL:
      if (state.operation === null || state.currentOp === null || state.prevOp === null) {
        return state
      }
    return {
      ...state,
      overwrite: true,
      prevOp: null,
      operation: null,
      currentOp: evaluate(state)
    }
  }
}

function evaluate({currentOp, prevOp, operation}) {
  const prev = parseFloat(prevOp)
  const current = parseFloat(currentOp)

  if (isNaN(prev) || isNaN(current)) return ""
  let computation = ""
  switch (operation) {
    case "+":
      computation = prev + current
      break
    case "-":
      computation = prev - current
    case "/":
      computation = prev / current
    case "*":
      computation = prev * current
    case "-":
      computation = prev - current
  }
  return computation.toString()
}

const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,

})

function formatOperand(operand) {
  if (operand == null) return
  const [integer, decimal] = operand.split(".")
  if (decimal == null) return INTEGER_FORMATTER.format(integer)
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`
}

function App() {

  const [{currentOp, prevOp, operation}, dispatch] = useReducer(reducer, {})

  return (
    <div className="calculator-grid">
      <div className="output">
        <div className="prev-op">{formatOperand(prevOp)} {operation}</div>
        <div className="current-op">{formatOperand(currentOp)}</div>
      </div>
      <button className="span-two" onClick={()=> dispatch({ type: ACTIONS.CLS })}>AC</button>
      <button onClick={()=> dispatch({ type: ACTIONS.DEL })}>Del</button>
      <OperationButton operation="/" dispatch={dispatch} />
      <DigitButton digit="1" dispatch={dispatch} />
      <DigitButton digit="2" dispatch={dispatch} />
      <DigitButton digit="3" dispatch={dispatch} />
      <OperationButton operation="*" dispatch={dispatch} />
      <DigitButton digit="4" dispatch={dispatch} />
      <DigitButton digit="5" dispatch={dispatch} />
      <DigitButton digit="6" dispatch={dispatch} />
      <OperationButton operation="+" dispatch={dispatch} />
      <DigitButton digit="7" dispatch={dispatch} />
      <DigitButton digit="8" dispatch={dispatch} />
      <DigitButton digit="9" dispatch={dispatch} />
      <OperationButton operation="-" dispatch={dispatch} />
      <DigitButton digit="." dispatch={dispatch} />
      <DigitButton digit="0" dispatch={dispatch} />
      <button className="span-two" onClick={()=> dispatch({ type: ACTIONS.EVAL })}>=</button>
    </div>
  );
}

export default App;
