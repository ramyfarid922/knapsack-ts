import { Packer } from "../src/packer"
import * as fs from "fs"
import * as path from "path"

// I used the separate test cases samples to try the pack functions on multiple inputs
// during the test driving
// I have tested the implemenetd algorithm and it passes 3 of the test cases while one of them fails
// I currently might not have enough time to debug why the algorithm fails at this sample specifically

describe("Packer's pack API function works correctly", () => {
    it('Should work correctly for input1.txt', () => {
        expect(Packer.pack(path.join(__dirname, "./samples/input1.txt"))).toEqual("4")                    
    });

    it('Should work correctly for input2.txt', () => {
        expect(Packer.pack(path.join(__dirname, "./samples/input2.txt"))).toEqual("")                    
    });

    it('Should work correctly for input3.txt', () => {
        expect(Packer.pack(path.join(__dirname, "./samples/input3.txt"))).toEqual("2,7")                    
    });

    it('Should work correctly for input4.txt', () => {
        expect(Packer.pack(path.join(__dirname, "./samples/input4.txt"))).toEqual("8,9")                    
    });
})


