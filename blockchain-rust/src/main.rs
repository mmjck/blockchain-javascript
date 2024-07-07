use cli::Cli;
use errors::Response;

mod block;
mod errors;
mod blockchain;
mod cli;
mod transaction;
mod tx;
mod wallet;

fn main() -> Response<()>{
    let mut cli = Cli::new()?;
    
    cli.run()?;
    
    Ok(())
}
