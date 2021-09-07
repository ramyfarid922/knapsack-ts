import * as fs from "fs";
import { ApiError } from "./error";

export class Packer {
  // I have tried to keep the style of coding immutable as much as possible by not keeping a state
  // for the class (since we are going to invoke only static functions on it)
  // For that you will see that the class functions process the data and pass it around
  // to each other instead of trying to mutate class variables.

  // I have wraped each method code in a try catch block to throw ther errors
  // if the constraints of input are not met

  constructor() {}

  private static maxOf(val1: number, val2: number): number {
    if (val1 > val2) {
      return val1;
    } else return val2;
  }

  static pack(inputFile: string): string {
    try {
      // Packer.prepareSamples() parses the input file path and extracts the test samples into
      // array of strings each representing a test case
      let samples: string[] = Packer.prepareSamples(inputFile);
      // The samples array get passed to Packer.solveSamples() to handle iterating over
      // each test case and solve each one and returning array of results
      let results: string[] = Packer.solveSamples(samples);
      // The returned array of results is joined by newlines into an output string
      return results.join("\n");
    } catch (error) {
      throw error;
    }
  }

  private static prepareSamples(inputFile: string): string[] {
    try {
      let samples = fs.readFileSync(inputFile).toString();
      return samples.split("\n");
    } catch (error) {
      throw error;
    }
  }

  private static solveSamples(samples): string[] {
    try {
      let results: string[] = [];
      samples.forEach((sample) => {
        let result: string = Packer.solveSample(sample);
        results.push(result);
      });
      return results;
    } catch (error) {
      throw error;
    }
  }

  private static solveSample(sample: string): string {
    try {
      let capacity: number = 0;

      // Adding zero in the array start to let array indices
      // correspond to items indices
      let weights: number[] = [0];
      let values: number[] = [0];

      // Parse the sample string to obtain capacity and item knowledge
      let sampleParts: string[] = sample.split(":");

      capacity = parseInt(sampleParts[0]);

      if (capacity > 100) {
        let error = new ApiError("Max capacity exceeded!");
        throw error;
      }

      // Multiplying the capacity by 100 to remove the decimal point
      // because later, we will have to multiply the weights as well
      capacity = capacity * 100;

      let items: string[] = sampleParts[1].trim().split(" ");
      if (items.length > 15) {
        let error = new ApiError("Max items length exceeded!");
        throw error;
      }

      // Reset the state arrays from input of previous sample
      weights = [0];
      values = [0];
      // Iterate over the items of the next sample and fill the state arrays
      items.forEach((item) => {
        item = item.replace(/[()]/g, "");
        let itemParts: string[] = item.split(",");
        let id: number = parseInt(itemParts[0]);
        let weight: number = parseFloat(itemParts[1]);
        let value: number = parseInt(itemParts[2].replace(/[€]/g, ""));
        if (weight > 100 || value > 100) {
          let error = new ApiError("Max weight/cost exceeded!");
          throw error;
        }
        // Notice here that I am multiplying the weight by 100 to remove the fraction
        // to suit the algorithm which works on whole weights problem
        weights.push(weight * 100);
        values.push(value);
      });

      let result: string;
      result = Packer.packagingAlgo(capacity, items.length, weights, values);
      return result;
    } catch (error) {
      throw error;
    }
  }

  private static packagingAlgo(
    capacity: number,
    size: number,
    weights: number[],
    values: number[]
  ) {
    // Constructing a table for the bottom-up dynamic programming approach using
    // tabulation method for solving the packaging problem
    // which is a slight variation of the knapsack problem
    var table: number[][] = [];
    let result: number[] = [];

    // The next procedure is to fill the a table where we ask ourselves at each
    // specific assumed capacity, what items can we take to have max cost
    // We consider an ascending number of items
    // i.e if we had one item at this capacity, what should we do?
    for (let i = 0; i <= size; i++) {
      let row: number[] = [];
      table.push(row);
      for (let w = 0; w <= capacity; w++) {
        if (i == 0 || w == 0) {
          table[i].push(0);
        } else if (weights[i] <= w) {
          table[i].push(
            Packer.maxOf(
              values[i] + table[i - 1][w - weights[i]],
              table[i - 1][w]
            )
          );
        } else {
          table[i].push(table[i - 1][w]);
        }
      }
    }

    // The next procedue is scanning the table from end to beginning
    // to decide which indices of items result in new values of high cost
    // appearing in the table
    // By which procedure, we can determine which items will be taken with us
    // The indices of the taken items will be pushed to result
    let i: number = size;
    let j: number = capacity;
    while (i > 0 && j > 0) {
      if (table[i][j] == table[i - 1][j]) {
        i--;
      } else {
        result.push(i);
        i--;
        j = j - weights[i];
      }
    }
    return result.reverse().join(",");
  }
}
