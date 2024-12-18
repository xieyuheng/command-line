import ty from "@xieyuheng/ty"
import { CommandRunner } from "../command-runner/index.ts"
import { Command } from "../command.ts"
import { indent } from "../utils/indent.ts"
import { rightPad } from "../utils/rightPad.ts"

type Args = { name?: string }

export class CommonHelp extends Command<Args> {
  name = "help"

  description = "Display help for a command"

  args = { name: ty.optional(ty.string()) }

  help(runner: CommandRunner): string {
    const { blue } = this.colors

    return [
      `The ${blue(this.name)} command displays help for a given command.`,
      ``,
      blue(`  ${runner.name} help help`),
    ].join("\n")
  }

  async execute(argv: Args, runner: CommandRunner): Promise<void> {
    const { yellow } = this.colors

    if (argv["name"]) {
      this.helpCommand(argv["name"], runner)
    } else {
      this.usage()
      this.defaultCommand(runner)
      this.listCommands(runner)
      console.log()

      console.log(
        [
          //
          yellow(`Help:`),
          indent(this.help(runner), "  "),
        ].join("\n"),
      )
    }
  }

  helpCommand(name: string, runner: CommandRunner): void {
    const { yellow, blue } = this.colors

    const command = runner.commands.find((command) => command.name === name)

    if (command === undefined) {
      console.log(`  I do not know a command named: ${name}`)
      console.log()
      this.listCommands(runner)
      return
    }

    console.log(
      [
        //
        yellow(`Description:`),
        `  ${command.description}`,
        ``,
      ].join("\n"),
    )

    console.log(
      [
        //
        yellow(`Usage:`),
        `  ${blue(`${name} ${this.signature(command)}`)}`,
        ``,
      ].join("\n"),
    )

    if (Object.entries(command.opts).length > 0) {
      const options = Object.entries(command.opts)
        .map(([key, schema]) => blue(`--${key}`))
        .join("\n")

      console.log(
        [
          //
          yellow(`Options:`),
          indent(options, "  "),
          ``,
        ].join("\n"),
      )
    }

    if (command.help) {
      console.log(
        [
          //
          yellow(`Help:`),
          indent(command.help(runner), "  "),
        ].join("\n"),
      )
    }
  }

  usage(): void {
    const { yellow } = this.colors

    console.log(
      [
        //
        yellow(`Usage:`),
        `  command [arguments] [options]`,
        ``,
      ].join("\n"),
    )
  }

  defaultCommand(runner: CommandRunner): void {
    const { yellow, blue } = this.colors

    if (runner.defaultCommand) {
      const command = runner.defaultCommand

      console.log(
        [
          yellow(`Default command:`),
          `  ${blue(this.signature(command))}  ${command.description}`,
          ``,
        ].join("\n"),
      )
    }
  }

  listCommands(runner: CommandRunner): void {
    const { yellow, blue } = this.colors

    const size = Math.max(
      ...runner.commands.map(
        (command) => `${command.name} ${this.signature(command)}`.length,
      ),
    )

    console.log(yellow(`Commands:`))
    for (const command of runner.commands) {
      const head = `${command.name} ${this.signature(command)}`
      console.log(
        [
          //
          `  ${blue(rightPad(head, size))}  ${command.description}`,
        ].join("\n"),
      )
    }
  }

  signature(command: Command): string {
    return Object.keys(command.args)
      .map((key) => `[${key}]`)
      .join(" ")
  }
}
