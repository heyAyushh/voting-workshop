import * as anchor from "@coral-xyz/anchor";
import { Keypair, PublicKey } from "@solana/web3.js";
import { BankrunProvider } from "anchor-bankrun";
import { startAnchor } from 'solana-bankrun';
import { Voting } from "../target/types/voting";

const IDL = require("../target/idl/voting.json");
const PROGRAM_ID = new PublicKey(IDL.address);

describe("Voting", () => {
  let provider: BankrunProvider;
  let votingProgram: anchor.Program<Voting>;
  let pollAddress: PublicKey;

  beforeAll(async () => {
    const context = await startAnchor('', [{ name: "voting", programId: PROGRAM_ID }], []);
    provider = new BankrunProvider(context);
    anchor.setProvider(provider);

    votingProgram = new anchor.Program<Voting>(
      IDL,
      provider
    );

    [pollAddress] = PublicKey.findProgramAddressSync(
      [new anchor.BN(1).toArrayLike(Buffer, "le", 8)],
      votingProgram.programId
    );
  });

  test("initializes a poll", async () => {
    try {
      const tx = await votingProgram.methods
        .initializePoll(
          new anchor.BN(1),
          "What is your favorite color?",
          new anchor.BN(100),
          new anchor.BN(1739370789)
        )
        .accounts({
          signer: provider.wallet.publicKey,
        })
        .rpc();

      console.log("Transaction signature:", tx);

      const poll = await votingProgram.account.poll.fetch(pollAddress);

      expect(poll.pollId.toNumber()).toBe(1);
      expect(poll.description).toBe("What is your favorite color?");
      expect(poll.pollStart.toNumber()).toBe(100);
      expect(poll.pollEnd.toNumber()).toBe(1739370789);
      expect(poll.candidateAmount.toNumber()).toBe(0);

      console.log("Poll account data:", poll);
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  });
});
