import { DualExpression, Expression, intervalExpr, rangeExpr, StringLiteral, SyntaxNode } from "@/syntax";
import { toStringNode } from "@/syntax/cron/SyntaxNode";

/**
 * Expression input. Each field is optional and defaults to * to reduce boilerplate, however be mindful of the resultant side effect.
 *
 * second and year fields are only used by Quartz parser.
 */
export interface CronixExpression {
  minute?: string;
  hour?: string;
  dayOfMonth?: string;
  month?: string;
  dayOfWeek?: string;
  year?: string;
  second?: string;
}

/**
 * Modes supported by Cronix.
 */
export enum CronixMode {
  CRONTAB = "Crontab",
  QUARTZ = "Quartz",
  JENKINS = "Jenkins"
}

/**
 * Options passed to the parser.
 */
export interface CronixOptions {
  mode: CronixMode;
}

/**
 * Represents an expression as a Node or its string value.
 */
export type StringNode<T extends SyntaxNode = SyntaxNode> = string | T;

/**
 * Generate a step expression. Step expression is triggered at a set time specified by the left expression, but repeated according to the interval specified by the right expression.
 * The left expression can be a simple, range or union expression, while the right expression must be a single integer.
 *
 * @param time The trigger time. If a string is provided, it must be a single value
 * @param interval The trigger interval. Must be a single value
 */
export function step(time: StringNode, interval: StringNode<StringLiteral>): DualExpression {
  return intervalExpr(toStringNode(time), toStringNode(interval));
}

/**
 * Generate a range expression. A range expression is triggered for every time in between the set bounds. Each bound must be a simple expression.
 * @param start The start expression. Must be a simple expression or a string expressing one
 * @param end The end expression. Must be a simple expression with a value superior to the start
 */
export function range(start: StringNode, end: StringNode): DualExpression {
  return rangeExpr(toStringNode(start), toStringNode(end));
}

/**
 * Generate a union expression. A union is triggered for every expression it contains, and it can be any combination of simple and range expressions.
 * @param values The children expressions
 */
export function union(...values: StringNode[]): Expression {
  return new Expression(values.map(toStringNode));
}