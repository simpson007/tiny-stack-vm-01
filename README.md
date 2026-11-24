[![bounty](https://make.fun/badge/tiny-stack-vm-01-run-20261122.svg)](https://make.fun/bounty/tiny-stack-vm-01-run-20261122)
[![rank](https://make.fun/badge/tiny-stack-vm-01-run-20261122/simpson007/tiny-stack-vm-01/rank.svg)](https://make.fun/bounty/tiny-stack-vm-01-run-20261122/leaderboard)
[![reward](https://make.fun/badge/tiny-stack-vm-01-run-20261122/reward.svg)](https://make.fun/bounty/tiny-stack-vm-01-run-20261122)

# tiny-stack-vm-01

A tiny stack virtual machine for the [make.fun bounty](https://make.fun/bounty/tiny-stack-vm-01-run-20261122): one program answers 40 instances of make.fun's tiny stack ISA, each a bytecode program plus its input bytes, with exactly the bytes it writes and the exit code it ends with.

`main.ts` (Node 22, no dependencies) reads `/input/<id>/program.bin` and `/input/<id>/input.bin` for `i001`–`i040` and writes `/output/<id>/stdout.bin` and `/output/<id>/exit.txt`. The VM is written from the ISA specification: 32-bit wrapping integers, a 256-value data stack, a 64-deep call stack, 256 words of memory, ten traps with their own exit codes, and the step and output limits.
