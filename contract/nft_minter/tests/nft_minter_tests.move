#[test_only]
module nft_minter::nft_minter_tests {
    use sui::test_scenario::{Self as test_scenario};
    use nft_minter::nft_minter_v2::{Self as nft_minter_v2, MintState, TestnetNFT};
    use std::ascii;

    // === Constants ===
    const TOTAL_SUPPLY: u64 = 1111;

    #[test]
    fun test_basic_mint_and_ownership() {
        let addr1 = @0xA; 
        let mut scenario = test_scenario::begin(addr1);

        // 1. Initialize MintState
        test_scenario::next_tx(&mut scenario, addr1);
        {
            nft_minter_v2::create_mint_state(test_scenario::ctx(&mut scenario));
        };

        // 2. Mint NFT to addr1 & Verify Supply Tracking 
        test_scenario::next_tx(&mut scenario, addr1);
        {
            let mut mint_state = test_scenario::take_shared<MintState>(&scenario);
            nft_minter_v2::mint_to_sender(
                &mut mint_state,
                b"My First NFT",
                b"A simple test NFT",
                b"https://example.com/first.webp",
                b"https://example.com/first.glb",
                test_scenario::ctx(&mut scenario)
            );
            // Check Supply: remains 1110 (from 1111)
            assert!(nft_minter_v2::remaining_supply(&mint_state) == TOTAL_SUPPLY - 1, 0);
            test_scenario::return_shared(mint_state);
        };

        // 3. Verify NFT Ownership 
        test_scenario::next_tx(&mut scenario, addr1); 
        {
            let nft_at_addr1 = test_scenario::take_from_sender<TestnetNFT>(&scenario);

            assert!(*nft_minter_v2::name(&nft_at_addr1) == ascii::string(b"My First NFT"), 0);
            test_scenario::return_to_sender(&scenario, nft_at_addr1);
        };

        test_scenario::end(scenario);
    }
}