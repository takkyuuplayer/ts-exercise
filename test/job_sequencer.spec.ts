import { describe, expect, test } from "vitest";

type SequenceNumber = number;

class JobSequencer {
  private sequence: SequenceNumber = 0;
  private nextSequenceToProcess: SequenceNumber = 0;
  private pendingJobs: Map<SequenceNumber, () => Promise<void>> = new Map();
  private isProcessing: boolean = false;

  generateSequenceNumber(): SequenceNumber {
    return this.sequence++;
  }

  process<T>(
    s: SequenceNumber,
    job: (s: SequenceNumber) => Promise<T>
  ): Promise<T> {
    if (s < this.nextSequenceToProcess) {
      throw new Error("Sequence number is already processed");
    }
    if (this.pendingJobs.has(s)) {
      throw new Error("Sequence number is already in process");
    }

    return new Promise<T>(async (resolve, reject) => {
      this.pendingJobs.set(s, async () => {
        try {
          const r = await job(s);
          this.pendingJobs.delete(this.nextSequenceToProcess);
          this.nextSequenceToProcess++;
          resolve(r);
        } catch (e) {
          this.pendingJobs.delete(this.nextSequenceToProcess);
          this.nextSequenceToProcess++;
          reject(e);
        }
      });

      if (this.isProcessing) {
        return;
      }

      this.isProcessing = true;
      while (this.pendingJobs.has(this.nextSequenceToProcess)) {
        await this.pendingJobs.get(this.nextSequenceToProcess)!();
      }
      this.isProcessing = false;
    });
  }
}

describe.concurrent("JobSequencer", () => {
  test.concurrent("basic", async () => {
    const sequencer = new JobSequencer();
    const processedOrder: Array<number> = [];
    const resolved: Array<number> = [];
    const rejected: Array<number> = [];

    const s0 = sequencer.generateSequenceNumber();
    sequencer
      .process(s0, async (sn) => {
        expect(sn).toEqual(s0);
        processedOrder.push(s0);
        return s0;
      })
      .then((r) => resolved.push(r))
      .catch((e) => rejected.push(e));

    const s1 = sequencer.generateSequenceNumber();
    sequencer
      .process(s1, () => {
        return new Promise<number>((resolve) => {
          setTimeout(() => {
            processedOrder.push(s1);
            resolve(s1);
          }, 100);
        });
      })
      .then((r) => resolved.push(r))
      .catch((e) => rejected.push(e));

    const s2 = sequencer.generateSequenceNumber();
    const s3 = sequencer.generateSequenceNumber();
    sequencer
      .process(s3, async () => {
        return new Promise<number>((_, reject) => {
          setTimeout(() => {
            processedOrder.push(s3);
            reject(s3);
          }, 100);
        });
      })
      .then((r) => resolved.push(r))
      .catch((e) => rejected.push(e));
    sequencer
      .process(s2, async () => {
        processedOrder.push(s2);
        throw s2;
      })
      .then((r) => resolved.push(r))
      .catch((e) => rejected.push(e));

    const s4 = sequencer.generateSequenceNumber();
    await sequencer.process(s4, async () => {
      expect(processedOrder).toEqual([s0, s1, s2, s3]);
    });

    expect(processedOrder).toEqual([s0, s1, s2, s3]);
    expect(resolved).toEqual([s0, s1]);
    expect(rejected).toEqual([s2, s3]);

    expect(sequencer["pendingJobs"].size).toEqual(0);
  });

  test.concurrent("sequence number duplication", async () => {
    const sequencer = new JobSequencer();
    sequencer.process(sequencer.generateSequenceNumber(), async () => {});

    const s = sequencer.generateSequenceNumber();
    const p = sequencer.process(s, async (s) => {
      return new Promise<number>((resolve) => {
        setTimeout(() => {
          resolve(s);
        }, 200);
      });
    });

    expect(() => sequencer.process(s, async () => {})).toThrowError(
      new Error("Sequence number is already in process")
    );

    await p;

    expect(() => sequencer.process(s, async () => {})).toThrowError(
      new Error("Sequence number is already processed")
    );
  });
});
