#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF");

#[program]
pub mod voting {
  use super::*;

  pub fn initialize_poll(ctx: Context<InitializePoll>, poll_id: i64) -> Result<()> {
    Ok(())
  }

}
