module nft_minter::nft_minter_v2 {
    use sui::url::{Self, Url};
    use sui::event;
    use std::ascii;

    // === Constants ===
    const TOTAL_SUPPLY: u64 = 1111;
    const MAX_URL_LENGTH: u64 = 2048;

    const E_SUPPLY_EXHAUSTED: u64 = 0;
    const E_INVALID_URL: u64 = 1;

    // === Structs ===
    public struct TestnetNFT has key, store {
        id: UID,
        name: ascii::String,
        description: ascii::String,
        image_url: Url,
        model_url: Url,
    }

    /// Tracks the number of minted NFTs
    public struct MintState has key {
        id: UID,
        minted: u64,
    }

    // === Events ===
    public struct NFTMinted has copy, drop {
        object_id: ID,
        creator: address,
        name: ascii::String,
        image_url: Url,
    }

    // === Test-only Functions ===
    #[test_only]
    public(package) fun create_mint_state(ctx: &mut TxContext) {
        let mint_state = MintState {
            id: object::new(ctx),
            minted: 0,
        };
        transfer::share_object(mint_state);
    }

    // === Public view functions ===
    public fun name(nft: &TestnetNFT): &ascii::String { &nft.name }
    public fun description(nft: &TestnetNFT): &ascii::String { &nft.description }
    public fun image_url(nft: &TestnetNFT): &Url { &nft.image_url }
    public fun model_url(nft: &TestnetNFT): &Url { &nft.model_url }

    public fun remaining_supply(state: &MintState): u64 {
        TOTAL_SUPPLY - state.minted
    }

    // === Entrypoints ===
    fun init(ctx: &mut TxContext) {
        let mint_state = MintState {
            id: object::new(ctx),
            minted: 0,
        };
        transfer::share_object(mint_state);
    }

    /// Create a new NFT, limited to 1111
    public entry fun mint_to_sender(
        state: &mut MintState,
        name_bytes: vector<u8>,
        description_bytes: vector<u8>,
        image_url_bytes: vector<u8>,
        model_url_bytes: vector<u8>,
        ctx: &mut TxContext,
    ) {
        // Validate supply limit
        assert!(state.minted < TOTAL_SUPPLY, E_SUPPLY_EXHAUSTED);
        assert!(vector::length(&image_url_bytes) <= MAX_URL_LENGTH, E_INVALID_URL);
        assert!(vector::length(&model_url_bytes) <= MAX_URL_LENGTH, E_INVALID_URL);

        let sender = tx_context::sender(ctx);
        state.minted = state.minted + 1;

        let nft_name = ascii::string(name_bytes);
        let nft_description = ascii::string(description_bytes);
        let nft_image_url = url::new_unsafe(ascii::string(image_url_bytes));
        let nft_model_url = url::new_unsafe(ascii::string(model_url_bytes));

        let nft = TestnetNFT {
            id: object::new(ctx),
            name: nft_name,
            description: nft_description,
            image_url: nft_image_url,
            model_url: nft_model_url,
        };

        event::emit(NFTMinted {
            object_id: object::id(&nft),
            creator: sender,
            name: nft.name,
            image_url: nft.image_url, 
        });

        transfer::public_transfer(nft, sender);
    }

    /// Transfer NFT to recipient
    public entry fun transfer(
        nft: TestnetNFT,
        recipient: address,
    ) {
        transfer::public_transfer(nft, recipient)
    }
}