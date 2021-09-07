import * as path from "path"
import { Packer } from "./packer"

let result:string = Packer.pack(path.join(__dirname, "../data/input.txt"))

console.log(result)


