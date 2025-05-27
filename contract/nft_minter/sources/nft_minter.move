module nft_minter::nft_minter {
    use sui::url; 
    use sui::event; 
    use std::ascii;
    use std::vector; 

    // === Constants ===
    // Maximum supply: 1111 NFTs
    const TOTAL_SUPPLY: u64 = 1111;
    // Maximum allowed URL length
    const MAX_URL_LENGTH: u64 = 2048;
    // Error code for supply exhaustion
    const E_SUPPLY_EXHAUSTED: u64 = 0;
    // Error code for invalid URL
    const E_INVALID_URL: u64 = 1;

    // === Structs ===
    /// An example NFT that can be minted by anybody, limited to 1111
    public struct TestnetNFT has key, store {
        id: sui::object::UID,
        name: ascii::String,
        description: ascii::String,
        url: sui::url::Url,
    }

    /// Tracks the number of minted NFTs
    public struct MintState has key {
        id: sui::object::UID,
        minted: u64,
    }

    // === Events ===
    public struct NFTMinted has copy, drop {
        object_id: sui::object::ID,
        creator: address,
        name: ascii::String,
    }

    // === Test-only Functions ===
    // This function is for testing purposes only. It creates and shares a MintState object.
    // It's declared `public(package)` so that the test module can call it.
    #[test_only]
    public(package) fun create_mint_state(ctx: &mut sui::tx_context::TxContext) {
        let mint_state = MintState {
            id: sui::object::new(ctx),
            minted: 0,
        };
        sui::transfer::share_object(mint_state);
    }

    // === Public view functions ===
    public fun name(nft: &TestnetNFT): &ascii::String {
        &nft.name
    }

    public fun description(nft: &TestnetNFT): &ascii::String {
        &nft.description
    }

    public fun url(nft: &TestnetNFT): &sui::url::Url {
        &nft.url
    }

    public fun remaining_supply(state: &MintState): u64 {
        TOTAL_SUPPLY - state.minted
    }

    // === Entrypoints ===
    /// Initialize the contract with a shared MintState.
    /// This function is automatically called once when the module is published.
    /// It must be internal (no public or public(package)) as required by Sui.
    fun init(ctx: &mut sui::tx_context::TxContext) {
        let mint_state = MintState {
            id: sui::object::new(ctx),
            minted: 0,
        };
        sui::transfer::share_object(mint_state);
    }

    /// Create a new NFT, limited to 1111
    public entry fun mint_to_sender(
        state: &mut MintState,
        name: vector<u8>,
        description: vector<u8>,
        url: vector<u8>,
        ctx: &mut sui::tx_context::TxContext,
    ) {
        // Validate supply limit
        assert!(state.minted < TOTAL_SUPPLY, E_SUPPLY_EXHAUSTED);
        // Validate URL length
        assert!(vector::length(&url) <= MAX_URL_LENGTH, E_INVALID_URL);

        let sender = sui::tx_context::sender(ctx);
        state.minted = state.minted + 1;

        let nft = TestnetNFT {
            id: sui::object::new(ctx),
            name: ascii::string(name),
            description: ascii::string(description),
            url: sui::url::new_unsafe(ascii::string(url)),
        };

        sui::event::emit(NFTMinted {
            object_id: sui::object::id(&nft),
            creator: sender,
            name: nft.name,
        });

        sui::transfer::public_transfer(nft, sender);
    }

    /// Transfer NFT to recipient
    public entry fun transfer(
        nft: TestnetNFT,
        recipient: address,
        _: &mut sui::tx_context::TxContext
    ) {
        sui::transfer::public_transfer(nft, recipient)
    }
}