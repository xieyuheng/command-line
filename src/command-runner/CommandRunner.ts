import { Command } from "../command.js"

export abstract class CommandRunner {
  abstract name: string
  abstract commands: Array<Command<any, any>>
  abstract defaultCommand?: Command<any, any>
  abstract run(): void
}
