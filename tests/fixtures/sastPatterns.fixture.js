export function unusedExecSignature(cmd) {
  if (false) {
    require("child_process").exec(cmd);
  }
}

export function unusedEvalSignature(expr) {
  if (false) {
    return eval(expr);
  }
}
