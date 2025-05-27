#[test_only]
module nft_minter::nft_minter_tests {
    use sui::test_scenario;
    use nft_minter::nft_minter::{MintState, TestnetNFT};
    use std::ascii;
    use std::vector; 

    #[test]
    fun test_mint_success() {
        let addr = @0xA;
        let mut scenario = test_scenario::begin(addr); // Declared as mutable

        // Initialize the MintState for testing
        {
            nft_minter::nft_minter::create_mint_state(test_scenario::ctx(&mut scenario)); // Use test-only function
        };

        test_scenario::next_tx(&mut scenario, addr);
        {
            let mut mint_state = test_scenario::take_shared<MintState>(&mut scenario); // Declared as mutable and scenario is mutable
            nft_minter::nft_minter::mint_to_sender(
                &mut mint_state, // Passed as mutable reference
                b"MyNFT",
                b"3D Model",
                b"https://example.com/model.glb",
                test_scenario::ctx(&mut scenario)
            );
            test_scenario::return_shared(mint_state);
        };

        test_scenario::next_tx(&mut scenario, addr);
        {
            let nft = test_scenario::take_from_sender<TestnetNFT>(&scenario);
            let mint_state = test_scenario::take_shared<MintState>(&scenario);
            assert!(nft_minter::nft_minter::remaining_supply(&mint_state) == 1110, 0);
            assert!(*nft_minter::nft_minter::name(&nft) == ascii::string(b"MyNFT"), 0);
            test_scenario::return_to_sender(&scenario, nft);
            test_scenario::return_shared(mint_state);
        };

        test_scenario::end(scenario);
    }

    #[test]
    #[expected_failure]
    fun test_mint_exceed_supply() {
        let addr = @0xA;
        let mut scenario = test_scenario::begin(addr); // Declared as mutable

        // Initialize the MintState for testing
        {
            nft_minter::nft_minter::create_mint_state(test_scenario::ctx(&mut scenario)); // Use test-only function
        };

        test_scenario::next_tx(&mut scenario, addr);
        {
            let mut mint_state = test_scenario::take_shared<MintState>(&mut scenario); // Declared as mutable and scenario is mutable
            let mut i = 0; // Declared as mutable
            while (i < 1111) {
                nft_minter::nft_minter::mint_to_sender(
                    &mut mint_state, // Passed as mutable reference
                    b"MyNFT",
                    b"3D Model",
                    b"https://example.com/model.glb",
                    test_scenario::ctx(&mut scenario)
                );
                i = i + 1; 
            };
            // This mint call should fail as supply is exhausted
            nft_minter::nft_minter::mint_to_sender(
                &mut mint_state, // Passed as mutable reference
                b"MyNFT",
                b"3D Model",
                b"https://example.com/model.glb",
                test_scenario::ctx(&mut scenario)
            );
            test_scenario::return_shared(mint_state);
        };

        test_scenario::end(scenario);
    }

    #[test]
    #[expected_failure]
    fun test_invalid_url_length() {
        let addr = @0xA;
        let mut scenario = test_scenario::begin(addr); // Declared as mutable

        // Initialize the MintState for testing
        {
            nft_minter::nft_minter::create_mint_state(test_scenario::ctx(&mut scenario)); // Use test-only function
        };

        test_scenario::next_tx(&mut scenario, addr);
        {
            let mut mint_state = test_scenario::take_shared<MintState>(&mut scenario); // Declared as mutable and scenario is mutable
            let mut long_url = vector::empty<u8>(); // Declared as mutable
            let mut i = 0; // Declared as mutable
            while (i < 2049) {
                vector::push_back(&mut long_url, 65); 
                i = i + 1; 
            };
            // This mint call should fail due to invalid URL length
            nft_minter::nft_minter::mint_to_sender(
                &mut mint_state, // Passed as mutable reference
                b"MyNFT",
                b"3D Model",
                long_url, // long_url is now a vector<u8>
                test_scenario::ctx(&mut scenario)
            );
            test_scenario::return_shared(mint_state);
        };

        test_scenario::end(scenario);
    }
}