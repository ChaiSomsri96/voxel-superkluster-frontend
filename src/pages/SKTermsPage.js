import React, { memo, useEffect } from "react";
import styled, { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
`;

const Div = styled.div`
    align-items: center;
    margin: 5px 0px;
`;

const SKTermsPage = function ({colormodesettle}) {
    useEffect(()=>{
        localStorage.setItem('searchValue','') ;
      },[])
    return (
        <>
            <div>
                <GlobalStyles />

                <section className='custom-container'>
                    <Div className="row" style={{ margin: '50px 5vw 0px 5vw', wordBreak:'keep-all'}}>
                        <h1 className="termHeader" style={{textAlign: 'center', wordBreak:'keep-all', fontSize:'28px', fontFamily:'Inter'}}>TERMS OF SERVICE</h1>
                        <span>Last revised: 22.7.2022</span> <br/><br/>
                        <Div style={{ fontSize: 18 }}>
                        THESE TERMS SET FORTH THE LEGALLY BINDING TERMS AND CONDITIONS
                        THAT GOVERN YOUR USE OF SUPERKLUSTER.  BY ACCESSING OR USING SUPERKLUSTER, SERVICES, OR SMART CONTRACTS YOU ARE ACCEPTING THESE
                        TERMS (ON BEHALF OF YOURSELF OR THE ENTITY THAT YOU REPRESENT), AND
                        YOU REPRESENT AND WARRANT THAT YOU HAVE THE RIGHT, AUTHORITY, AND
                        CAPACITY TO ENTER INTO THESE TERMS (ON BEHALF OF YOURSELF OR THE
                        ENTITY THAT YOU REPRESENT).  IF YOU DO NOT AGREE WITH ALL OF THE
                        PROVISIONS OF THESE TERMS, YOU ARE PROHIBITED FROM ACCESSING, USING,
                        OR TRANSACTING ON SUPERKLUSTER.  YOU FURTHER REPRESENT AND
                        WARRANT THAT YOU ARE OTHERWISE LEGALLY PERMITTED TO USE THE
                        SERVICES IN YOUR JURISDICTION AND THAT THE COMPANY IS NOT LIABLE FOR
                        YOUR COMPLIANCE WITH SUCH APPLICABLE LAWS.

                        </Div>
                        <Div>
                            <p>Certain features of the Site are subject to other guidelines, terms, or rules, which are located on the Site in connection with such features.  All such additional terms, guidelines, and rules are hereby incorporated by reference into these Terms and expressly agreed to and acknowledged by the User.</p>

                            <h3>Platform</h3>
                            <p>1. Requirement to Use MetaMask.</p>
                            <p>To most easily access and use SuperKluster, you should first install the Google Chrome browser. Once you have installed Google
                            Chrome, you will need to install a browser extension called MetaMask.
                            MetaMask is an electronic wallet, which allows you to purchase (via third-party sites),
                            store and engage in transactions using the native Ethereum cryptocurrency.
                            SuperKluster will only recognize you as a User, and you will only
                            be able to interact with SuperKluster if your digital wallet is connected and unlocked
                            through your MetaMask account. There is no other way to sign up as a User or to interact directly with SuperKluster.
                            </p>

                            <p>2. Transactions Recorded on Blockchain.</p> 
                            <p>Transactions that take place on SuperKluster are managed and confirmed via the Ethereum Mainnet(“Network”). You understand that your Network public address will be made publicly visible whenever you engage in a transaction on SuperKluster.  We neither own nor control the Networks or any other third-party site, product, or service that you might access, visit, or use for the purpose of enabling you to use the various features of SuperKluster. We will not be liable for the acts or omissions of any such third parties, nor will we be liable for any damage that you may suffer as a result of your transactions or any other interaction with any such third parties.</p>

                            <p>3. Ownership.</p>
                            <p> You acknowledge and agree that we (or, as applicable, our licensors) own all legal rights, title, and interests in and to all elements of SuperKluster. The graphics, design, systems, methods, information, computer code, software, services, “look and feel”, organization, a compilation of the content, code, data, and all other elements of SuperKluster (collectively, the “Content”) are owned by Voxel X Network, and are protected by copyright, trade dress, patent, and trademark laws, international conventions, other relevant intellectual property and proprietary rights, and applicable laws. 
                            </p><p>All Content is the copyrighted property of Voxel X Network or its licensors, and all trademarks, service marks, and trade names contained in the Content are proprietary to Voxel X Network or its licensors. Except as expressly set forth herein, your use of SuperKluster does not grant you ownership of or any other rights with respect to any content, code, data, or other materials that you may access on or through SuperKluster. We reserve all rights in and to the Content not expressly granted to you in the Terms. You may not use any metatags or other “hidden text” utilizing “Voxel X Network or SuperKluster” or any other name, trademark or product or
                            service-name of Voxel X Network or our affiliates without our prior written permission.
                            </p><p>Not-with-standing anything to the contrary in these Terms, SuperKluster and Content may include software components provided by Voxel X Network or its affiliates or a third party that are subject to separate license terms, in which case those license terms will govern such software components. All other trademarks, registered trademarks, product names, Voxel X Networks' and SuperKlusters' names or logos mentioned on SuperKluster are the property of their respective owners and may not be copied, imitated or used, in whole or in part, without the permission of the applicable trademark holder. Reference to any products, services, processes or other information by name, trademark, manufacturer, supplier or otherwise
                            does not constitute or imply endorsement, sponsorship, or recommendation by
                            SuperKluster.
                            </p>
                             
                            <p>4. Comments, Feedback and Other Submissions.</p>
                            <p>(a) If, at our request, you send certain specific submissions (for example contest
                                entries) or without a request from us you send creative ideas, suggestions,
                                proposals, plans, or other materials, whether online, by email, by postal mail, or
                                otherwise (collectively, ‘comments’), you agree that we may, at any time, without
                                restriction, edit, copy, publish, distribute, translate and otherwise use in any
                                medium any comments that you forward to us. We are and shall be under no
                                obligation to: (i) maintain any comments in confidence; (ii) pay compensation for
                                any comments; or (iii) respond to any comments.
                            </p>

                            <p>(b) We reserve the right to, monitor, edit or remove content that we
                                determine in our sole discretion are unlawful, offensive, threatening, libelous,
                                defamatory, pornographic, obscene or otherwise objectionable, or violates any
                                party’s intellectual property or these Terms of Use.
                            </p>

                            <p>(c) You agree that your comments will not violate any right of any third-party,
                                including copyright, trademark, privacy, personality, or other personal or
                                proprietary right. You further agree that your comments will not contain libelous
                                or otherwise unlawful, abusive, or obscene material, or contain any computer
                                virus or other malware that could in any way affect the operation of SuperKluster
                                or any related website. You may not use a false e-mail address, pretend to be
                                someone other than yourself, or otherwise mislead us or third-parties as to the
                                origin of any comments. You are solely responsible for any comments you make
                                and their accuracy. We take no responsibility and assume no liability for any
                                comments posted by you or any third-party.
                            </p>
                             
                            <p>5. External Sites.</p> 
                            <p>SuperKluster may include hyperlinks to other websites or resources
                                (collectively, “External Sites”), which are provided solely as a convenience to our users.
                                We have no control over any External Sites.  You acknowledge and agree that we are not responsible for the availability of any External Sites and that we do not endorse any advertising, products, or other materials on or made available from any External Sites. Furthermore, you acknowledge and agree that we are not liable for any loss or damage which may be incurred as a result of the availability or unavailability of the External Sites, or as a result of any reliance placed by you upon the completeness, accuracy, or existence of any advertising, products, or other materials on, or made available from, any External Sites. We are not liable for any harm or damages related to the purchase or use of goods, services, resources, content, or any other transactions made in connection with any External Sites. Please review carefully the External Site’s policies and practices and make sure you understand them before you engage in any transaction. Complaints, claims, concerns, or questions regarding third-party products should be directed to the third-party.
                            </p>
                             
                            <p>6. Links to Platform.</p>
                            <p> You are granted a limited, non-exclusive, non-transferable right to create a text hyperlink to SuperKluster, provided that such link does not portray
                                SuperKluster or our affiliates or any of our products or services in a false, misleading,
                                derogatory, or otherwise defamatory manner, and provided further that the linking site
                                does not contain any adult or illegal material or any material that is offensive, harassing,
                                or otherwise objectionable. This limited right may be revoked at any time. You may not
                                use a logo or other proprietary graphic of SuperKluster to link to SuperKluster or Content
                                without our express written permission.
                            </p>
                            
                            <h3>User Accounts and Security</h3>

                            <p>7. Accurate Information.</p>
                            <p> The User must provide accurate and complete registration
                                information when you create an account to access SuperKluster (“Account”). By creating an Account, you agree to provide accurate, current, and complete information about yourself, and to maintain and promptly update as necessary your Account information.
                            </p>

                            <p>8. Age of User.</p>
                            <p> By opening an Account, you affirm that you are over the age of 18, as SuperKluster is not intended for children under 18.</p>
                            <p>Minors may only use SuperKluster through a parent or guardian’s account whilst under their supervision.</p>

                            <p>9. Account Security.</p>
                            <p> You are solely responsible for the security of your Account and any other wallets and accounts you may otherwise use to engage with or use SuperKluster. You agree to undertake to maintain at all times adequate security and control of all of your account details, passwords, personal identification numbers or any other codes that you use to access SuperKluster. You must ensure that the account(s) registered under your name will not be used by any other person. You must notify us immediately of any breach of security, loss, theft, or unauthorized use of your username, password, or security information at <a style={{color:'#f70dff'}} target="_blank" href="https://info@voxelxnetwork.com">info@voxelxnetwork.com</a></p>

                            <p>10. Hacked Accounts.</p>
                            <p> SuperKluster reserves the right to terminate, suspend, or restrict your access to any Account(s) if there is reasonable suspicion by us that the person logged into your Account(s) is not you or if we suspect that the Account(s) have been or will be used for any illegal, fraudulent, or unauthorized purposes. Under no circumstances shall SuperKluster or indemnified persons in accordance with these Terms be responsible or liable for any direct or indirect losses (including loss of profits, business, or opportunities), damages, or costs suffered by you or any other person or entity due to any such termination, suspension, or restriction of access to any Account(s).</p>
                            <h3>Marketplace</h3>

                            <p>11. Description.</p>
                            <p>SuperKluster facilitates a peer-to-peer digital marketplace and auction house where Artists and other Users can sell, purchase, list for auction, make offers for, and bid on SuperKluster Items (the “Marketplace”). A SuperKluster Item (also referred to as an “Item” or “NFT”) is a unique cryptographic token that represents a selected artwork (“Art”, “Work(s)”, or “Artwork(s)”) on SuperKluster and is exclusively created (“Minted”) on SuperKluster with the permission of the owner of the Art (the “Artist”). Users can obtain Items on SuperKluster by making an offer accepted by the Artist, purchasing at an established List Price, or bidding on Items available in one of our auctions. SuperKluster Items are forever tracked and stored on one of the Networks, providing the Collector of a SuperKluster Item with a permanent record of authenticity and ownership of the SuperKluster Item. Only Artists invited and approved by SuperKluster are able to sell SuperKluster Items on SuperKluster.  Artwork for which SuperKluster Items may be Minted and sold on SuperKluster includes, but is not limited to: visual works, audiovisual works, animations, audio, photographs, 3D works, GIFs, and other creative digital works.</p>

                            <p>12. Purchasing SuperKluster Items</p>

                            <p>(a) SuperKluster Items may be offered for immediate acceptance at a list price
                                established by the Artist and SuperKluster (“List Price”).  Collectors can purchase
                                SuperKluster Items with a List Price through the Site by interacting with the buy button – to initiate a transfer of the SuperKluster Item, plus any additional fees and/or taxes.
                            </p>
                            
                            <p>(b) SuperKluster Items may also be offered for purchase through an auction hosted on SuperKluster (“Auction”). The seller establishes a specific start and end time for
                                each Auction. An Auction may be canceled prior to the start of the auction, i.e., when it is counting down to finalize, in the sole discretion of SuperKluster. After the auction begins, it cannot be stopped, canceled,
                                or undone. Timing is not a simple or exact thing on the blockchain; Auction
                                timers are not exact and only represent an estimate as to the start or end time
                                remaining for a particular Auction. Participants should get their bids in as early as
                                possible to ensure that they are processed by the Auction Smart Contract before
                                the close of the Auction.
                            </p>
                                (c) All underlying tokens for the purchase of SuperKluster listed items will remain in the custody of the buyer, until settlement, at which point the buyer must execute the transfer.
                             <p>

                            </p>
                            <p>13. Offers.</p>
                            <p> Users can make offers on all listed SuperKluster Items through the Site. Offers on the SuperKluster Marketplace are legally binding, revocable offers to purchase the Item capable of immediate acceptance by the Owner. </p>
                             
                            <p>14. Collection and Disbursement of Fees by the Smart Contracts.</p> 
                            <p>The User agrees and
                                understands that all fees, commissions, taxes and royalties are transferred, processed, or
                                initiated directly through one or more of the Smart Contracts on one of the Networks.
                                Initial and secondary market sales of SuperKluster Items are respectively subject to
                                commissions and royalties. In connection with the initial sale of a SuperKluster Item,
                                SuperKluster generally collects a commission based on a percentage of the total sale price for the SuperKluster Item. In connection with a subsequent sale of a SuperKluster Item, the Artist and SuperKluster will receive a royalty based on a percentage of the total sale price for the SuperKluster Item. These commissions and royalties are disclosed in the metadata of the Smart Contracts governing the sale of the SuperKluster Item and are automatically delivered and/or deducted to the relevant party on the execution of the Smart Contract. By transacting on SuperKluster and by using the Smart Contracts, the User hereby acknowledges, consents to, and accepts all automated fees, commissions, taxes and royalties for the sale of Items on the SuperKluster Platform. The User hereby consents to and agrees to be bound by the Smart Contracts’ execution and distribution of the fees, commissions, and royalties.  Users hereby waive any entitlement to royalties, commissions, or fees paid to another by operation of the Smart Contracts. The User also consents to the automated collection and disbursement to Artists of royalties for secondary market sales of SuperKluster Items. The User hereby waives any first sale defence or argument with respect to activities resulting in royalties being payable to an
                                Artist.
                            </p>

                            <p>15. No Representations on Price or Value.</p>
                            <p> Users acknowledge and consent to the risk that the price of an Item purchased on the Marketplace may have been influenced by User activity outside of the control of SuperKluster. SuperKluster does not represent, guarantee, or warrant the accuracy or fairness of the price of any SuperKluster Item sold or offered for sale on or off of the Marketplace. The User agrees and acknowledges that SuperKluster is not a fiduciary nor owes any duties to any User of SuperKluster, including the duty to ensure fair pricing of SuperKluster Items or to police User behavior on the Marketplace.</p>

                            <p>16. Gas Fees.</p>
                            <p> User transactions on SuperKluster, including, without limitation, Minting,
                                tokenizing, bidding, listing, offering, purchasing, or confirming, may be facilitated by
                                Smart Contracts that exist on a Network. A Network may require the payment of a
                                transaction fee (“Gas Fee”) for transactions that occur on the Network. The value of the Gas Fee changes, often unpredictably, and is entirely outside of the control of SuperKluster. The User acknowledges that under no circumstances will a contract, agreement, offer, sale, bid, or other transaction on SuperKluster be invalidated, revocable, retractable, or otherwise unenforceable on the basis that the Gas Fee for the given transaction was unknown, too high, or otherwise unacceptable to a User. Users also acknowledge and agree that Gas Fees are non-refundable under all circumstances.
                                </p><p>Buyer will pay a gas fee to swap $ETH to $VXL which is then transferred to your wallet
                                Buyers will pay gas and transaction fee when purchasing “buy now” items
                                Sellers will pay gas and transaction fee when accepting “offers” for their items
                            </p>

                            <p>17. Taxes.</p>
                            <p> Users are responsible to pay any and all sales, goods, use, value-added, and other taxes, duties, and assessments now or hereafter claimed or imposed by any governmental authority, associated with their use of SuperKluster (including, without limitation, any taxes that may become payable as the result of their ownership, transfer, purchase, sale, or creation of any SuperKluster Items).</p>

                            <p>18. Use of Smart Contracts.</p>

                            <p>(a) To initiate a transaction on the Marketplace, a User must voluntarily invoke one
                                or more Smart Contract operations from a digital wallet. All transactions on the Marketplace, including but not limited to transfers, offers, bids, listings, sales, or
                                purchases of SuperKluster Items are initiated through one or more Smart Contracts
                                at the sole discretion and at the complete risk of the Users. The Smart Contracts
                                are configured to facilitate the execution of a voluntary User offer, an acceptance
                                of an offer, or other confirmation to purchase, sell, bid on, list, or transfer a
                                SuperKluster Item. The User acknowledges the risk of Smart Contracts and agrees
                                to be bound by the outcome of any Smart Contract operation by invoking, calling,
                                requesting, or otherwise engaging with the Smart Contract, whether or not the
                                Smart Contract behaves as the User expects.
                            </p>

                            <p>(b) SuperKluster Marketplace transactions, including but not limited to primary sales,
                                secondary market sales, listings, offers, bids, acceptances, and other operations
                                through SuperKluster utilize experimental Smart Contract and blockchain
                                technology, including NFTs, digital currencies, consensus algorithms, and
                                decentralized or peer-to-peer networks and systems. Users acknowledge and agree
                                that such technologies are experimental, speculative, and inherently risky. Users
                                acknowledge and agree that the SuperKluster Smart Contracts may be subject to
                                bugs, malfunctions, timing errors, hacking and theft, or changes to the protocol
                                rules of a Network (i.e., "forks"), which can adversely affect the Smart Contracts
                                and may expose you to a risk of a total loss, forfeiture of your cryptocurrency or
                                SuperKluster Items or lost opportunities to buy or sell SuperKluster Items.
                                SuperKluster assumes no liability or responsibility for any such Smart Contract or
                                related failures, risks, or uncertainties.
                            </p>

                            <p>(c) Users hereby acknowledge and assume the risk of initiating, interacting with,
                                participating in Marketplace or Auction transactions and take full responsibility
                                and liability for the outcome of any transaction they initiate, whether or not the
                                Smart Contracts, SuperKluster, or other market participants behave as expected or
                                intended. Users hereby represent that they are knowledgeable, experienced and
                                sophisticated in using blockchain technology and in initiating cryptocurrency-
                                based transactions.
                            </p>

                            <p>(d) Users are forbidden from engaging in any attack, hack, denial-of-service attack,
                                interference, or exploit of any Smart Contract. Operations performed by a User
                                that is technically permitted by a Smart Contract may nevertheless be a violation
                                of our Terms and the law.
                            </p>

                            <p>(e) SuperKluster makes no representations or warranties, express or implied, written or oral, made by or on behalf of SuperKluster in connection with the use of Smart
                                Contracts on SuperKluster, including any representations or warranties of title,
                                non-infringement, functionality, merchantability, usage, security, suitability or
                                fitness for any particular purpose, workmanship or technical quality of any
                                SuperKluster Item, Smart Contract code, or software.
                            </p>

                            <p>(f) SuperKluster reserves the right, in its sole and absolute discretion, to amend,
                                modify, alter or supplement these Terms and the Smart Contracts accessible
                                through SuperKluster at its discretion.
                            </p>
                            
                            <p>(g) All Marketplace transactions are executed by one or more Smart Contracts
                                processed on a Network and not under any direct control by SuperKluster or any
                                other third party. The User acknowledges and agrees that SuperKluster is not a
                                party to any agreement or transaction between any Users involving the purchase,
                                offer, sale, auction, or transfer of SuperKluster Items, whether or not a commission
                                or fee is received by SuperKluster as a consequence of the transaction. Items listed
                                for sale on the Marketplace are not offered on consignment or held in trust on
                                behalf of any Artist, Collector, Owner, or User. SuperKluster reserves the right to
                                execute Smart Contract transactions on the Marketplace as a Collector of
                                SuperKluster Items.
                            </p>

                            <p>19. Prohibited Uses.</p>

                            <p>(a) You agree to use SuperKluster only for purposes that are legal, proper, and in
                                accordance with these Terms and any applicable laws or regulations. Without
                                limitation, you may not, and may not allow any third party to: (i) send, upload,
                                distribute or disseminate any unlawful, defamatory, harassing, abusive,
                                fraudulent, obscene, or otherwise objectionable content; (ii) undertake any
                                unlawful activity which would violate, or assist in the violation of, any law, statute,
                                the ordinance, or regulation, sanctions program administered in any relevant country,
                                or which would involve proceeds of any unlawful activity; (iii) distribute viruses,
                                worms, defects, Trojan horses, corrupted files, hoaxes, or any other items of a
                                destructive or deceptive nature; (iv) impersonate another person (via the use of an
                                email address or otherwise); (v) upload, post, transmit or otherwise make
                                available through SuperKluster any content that infringes the intellectual
                                proprietary rights of any party, including, without limitation, through the delivery
                                of NFTs which may, or may link to or may in any other way whatsoever infringe
                                upon or violate our intellectual property rights or the intellectual property rights of
                                others; (vi) operate to defraud SuperKluster, other users, or any other person or
                                provide false, inaccurate or misleading information; (vii) use SuperKluster to
                                violate the legal rights (such as rights of privacy and publicity) of others; (viii)
                                engage in, promote, or encourage illegal activity (including, without limitation,
                                terrorism, tax evasion or money laundering); (ix) interfere with another
                                individual’s or entity’s access to or use of SuperKluster; (x) defame, abuse, extort,
                                harass, stalk, threaten or otherwise violate or infringe the legal rights (such as, but
                                not limited to, rights or privacy, publicity and intellectual property) of others; (xi)
                                incite, threaten, facilitate, promote, or encourage hate, racial intolerance or violent
                                acts against others; (xii) harvest or otherwise collect information from the
                                Platform about others, including without limitation email addresses, without
                                proper consent; (xiii) exploit SuperKluster for any unauthorized commercial
                                purpose; (xiv) modify, adapt, translate, or reverse engineer any portion of the
                                Platform; (xv) remove any copyright, trademark or other proprietary rights notices
                                contained in or on SuperKluster or any part of it; (xvi) reformat or frame any
                                portion of SuperKluster; (xvii) display any content on SuperKluster that contains
                                any hate-related or violent content or contains any other material, products or
                                services that violate or encourage conduct that would violate any criminal laws,
                                any other applicable laws, or any third party rights; (xviii) use any robot, spider,
                                site search/retrieval application, or another device to retrieve or index any portion of
                                SuperKluster or the Content, or to collect information about its Users for any
                                unauthorized purpose; (xix) create user accounts by automated means or under
                                false or fraudulent pretences; (xx) access or use SuperKluster for the purpose of
                                creating a product or service that is competitive with any of our products or
                                services; (xxi) create, sell or deliver (in any manner whatsoever) counterfeit
                                items; (xxii) attempt to circumvent any content-filtering techniques we employ, or
                                attempt to access any feature or area of SuperKluster that you are not authorized to
                                access; (xxiii) use data collected from our Platform to contact individuals,
                                companies, or other persons or entities; (xxiv) use data collected from our
                                Platform for any direct marketing activity (including without limitation, email
                                marketing, SMS marketing, telemarketing, and direct marketing); (xxv) bypass or
                                ignore instructions that control all automated access to SuperKluster; (xxvi) spam
                                listings for the purpose of causing a listing to appear at the top of the search
                                results; (xxvii) engage in behaviors that have the intention or the effect of
                                artificially distorting metrics that SuperKluster might use to sort search results;
                                (xxviii) use SuperKluster to carry out any financial activities subject to registration
                                or licensing, including but not limited to creating, listing, or buying securities,
                                options, real estate, or debt instruments; or (xxx) use SuperKluster to participate
                                in fundraising for a business, protocol, or platform. Users agree to report
                                the suspicious market activity of other Users.  If a User suspects that one or more
                                Users are in violation of these Terms, the User should promptly inform the
                                SuperKluster team at <a style={{color:'#f70dff'}} target="_blank" href="https://info@voxelxnetwork.com">info@voxelxnetwork.com</a>. SuperKluster hereby reserves the
                                right to completely or partially restrict or revoke a User’s access to the Site for
                                violating these Terms.
                                </p>

                            <p>(b) Without limiting the foregoing, Users are expressly forbidden from: (i) accepting,
                                soliciting, offering, bidding, engaging with the Smart Contracts, or otherwise
                                transacting on or off of SuperKluster with the intent to artificially devalue, inflate,
                                or otherwise deceptively influence, misrepresent, or cause to be misrepresented
                                price of a SuperKluster Item, groups of SuperKluster Items, or SuperKluster Items
                                created by particular Artists; (ii) bidding, purchasing, or making offers on their
                                own listed or offered SuperKluster Items, especially for the purpose of artificially
                                influencing the price of the listed Item(s); (iii) engaging in any deceptive conduct
                                that may prevent competitive or fair bidding, artificially inflate or deflate the price
                                of a work, simulate demand for work (i.e., “wash trading”), or any other anti-
                                competitive bidding conduct such as but not limited to “puffing,” “chill bidding,”
                                “shill bidding,” “sham bidding,” or “sock puppet bidding”; (iv) selling works,
                                listing items for Auction, making bids during an auction, purchasing a SuperKluster
                                Item, or engaging in any other Marketplace transaction for the purpose of concealing economic activity, laundering money, or financing terrorism. Users
                                agree to report suspicious market activity of other Users. If a User suspects that
                                one or more Users are in violation of these Terms, the User should promptly
                                inform the SuperKluster team at <a style={{color:'#f70dff'}} target="_blank" href="https://info@voxelxnetwork.com">info@voxelxnetwork.com</a>. SuperKluster hereby
                                reserves the right to completely or partially restrict or revoke a User’s access to
                                the Site for violating these Terms. SuperKluster reserves the right to amend, rectify,
                                edit, or otherwise alter Marketplace transaction data to mitigate the harm caused by a
                                User’s violation of these terms.
                            </p>

                            <p>(c) The User irrevocably releases, acquits, and forever discharges SuperKluster and its
                                subsidiaries, affiliates, officers, and successors for and against any and all past or
                                future causes of action, suits, or controversies arising out of another User’s
                                violation of these Terms.
                            </p>
                            
                            <h3>Ownership</h3>

                            <p>20. License</p>
                            
                            <p>(a) Unless specifically and explicitly stated otherwise on the webpage used for the
                                listing of a SuperKluster Item on SuperKluster, all works Minted on SuperKluster
                                are subject to a license (the “License”). The terms of the License governing a
                                SuperKluster items are described in the terms of sale and use, which each Collector
                                will be required to accept and acknowledge prior to purchasing such SuperKluster
                                Item.
                            </p>

                            <p>(b) Where it is specifically and explicitly stated on the webpage used for the listing of
                                a SuperKluster Item, a User may acquire a SuperKluster Item that is not subject to
                                the conditions of the License. In such instances, and only in such instances, will:
                                (i) the Artist irrevocably grant and assign to the Collector, subject to the license
                                described below in Section 20(c), all right, title, and interest (and so far as may be
                                appropriate by way of immediate assignment of future copyright) in and to the Art
                                underlying the SuperKluster Item, including, without limitation, all intellectual
                                property rights therein, throughout the world in perpetuity, including renewal and
                                extension periods, if any, whether then or thereafter known or created, free from
                                all restrictions and limitations, and the rights generally known as the “moral rights
                                of authors” and, to the extent such “moral rights of authors” may not be granted or
                                assigned, to the maximum extent possible, the Artist shall expressly waive in
                                perpetuity, including renewal and extension periods, if any, any and all rights
                                which either of them may have or claim to have under any law relating to “moral
                                rights of authors” or any similar law throughout the world, or as a result of any
                                alleged violation of such rights. In such instances, and only in such instances: (i)
                                the Artist agrees not to institute any action on the ground that any changes,
                                deletions, additions, or other use of such results, product and proceeds violate
                                such rights; and (ii) the completion of the purchase and sale of the SuperKluster
                                Item through SuperKluster and the associated transfer of funds shall evidence the
                                occurrence of the grant and assignment contemplated by this Section.
                                Not-with-standing the foregoing, the Collector agrees that it may not, nor permit
                                any third party, to do or attempt to do any of the foregoing: (A) modify, distort,
                                mutilate, or perform any other modification to the work underlying a SuperKluster
                                Item which would be prejudicial to the Artist’s honor or reputation; (B) use the
                                work underlying a SuperKluster Item in connection with images, videos, or other
                                forms of media that depict hatred, intolerance, violence, cruelty, or anything else
                                that could reasonably be found to constitute hate speech or otherwise infringe
                                upon the rights of others; (C) attempt to Mint, tokenize, or create an additional
                                cryptographic token representing the same work, whether on or off of the
                                Platform; or (D) falsify or misrepresent the authorship of the work underlying a
                                SuperKluster Item or the SuperKluster Item. For greater certainty, the purchase of a
                                SuperKluster Item described in this Section 20(b) shall be subject to terms of sale
                                and use which each Collector will be required to accept and acknowledge prior to
                                purchasing such SuperKluster Item.
                            </p>

                            <p>(c) Not-with-standing the provisions of Section 20(b), the grant and assignment of the art underlying the SuperKluster Item contemplated thereunder shall be subject to a non-exclusive, worldwide, assignable, sub-licensable and royalty-free license
                                granted to SuperKluster to make copies of, prepare derivative works of, display,
                                perform, reproduce, and distribute copies of the art underlying such SuperKluster
                                Item on any media whether now known or later discovered for the broad purposes
                                of operating, promoting, sharing, developing, marketing, and advertising the
                                Platform or any other purpose related to SuperKluster, which license shall include,
                                without limitation, the express right to: (i) display or perform the Art on the
                                Platform, a third party platform, social media posts, blogs, editorials, advertising,
                                market reports, virtual galleries, museums, virtual environments, editorials or to
                                the public; (ii) create and distribute digital or physical derivative works based on
                                the Art, including without limitation, compilations, collective works and
                                anthologies; (iii) indexing the Art in electronic databases, indexes, catalogues,
                                smart contracts or ledgers; and (iv) hosting, storing, distributing and reproducing
                                one or more copies of the Art or causing, directing or soliciting others to do so.
                                SuperKluster has the right to grant sublicenses of the rights granted under this
                                Section in its sole and exclusive discretion, including with respect to (A) the
                                identity of any sublicensee, (B) the applicable license fees or royalty rates, if
                                any, and (C) other terms and conditions of the sublicense. SuperKluster shall have
                                the rights to use or exploit the Art and to exercise its rights under this Agreement
                                through any of its employees, agents, and independent contractors.
                            </p>

                            <p>21. Release</p>

                            <p>(a) The Artist and all Users irrevocably release, acquit, and forever discharge
                                SuperKluster and its subsidiaries, affiliates, officers, and successors of any liability
                                for direct or indirect copyright or trademark infringement for SuperKluster’s use of
                                a Work in accordance with these Terms, including, without limitation,
                                SuperKluster’s solicitation, encouragement, or request for Users or third parties to
                                host the Work for the purpose of operating a distributed database and SuperKluster’s deployment or distribution of an NFT, a reward, a token, or any
                                other digital asset to Users or third parties for hosting Works on a distributed
                                database.
                            </p>
                            
                            <h3>Copyright Infringement Complaints</h3>

                            <p>22. Copyright Infringement Policy.</p>

                            <p>(a) We take claims of copyright infringement seriously. We will respond to notices of
                                alleged copyright infringement that complies with applicable law. If you believe
                                any materials accessible on or from SuperKluster infringe your copyright, you may
                                request a notice of claimed infringement, so that we send a notice to the alleged
                                infringer by submitting a written notification.
                            </p>

                            <p>(b) The written notice (the “Notice”) must include the following: (i) your name and
                                address, and any other particulars prescribed by regulation that enable
                                communication with the claimant that we may advise you from time to time; (ii)
                                identification of the copyrighted work you believe to have been infringed or, if the
                                claim involves multiple works on SuperKluster, a representative list of such
                                works; (iii) a statement describing your interest or right with respect to the
                                copyright in the work or other subject matter; (iv) identification of the location of
                                material you believe to be infringing in a sufficiently precise manner to allow us
                                to locate that material (e.g., a link to the infringing material); (v) a description of
                                the infringement that is claimed; (vi) a statement specifying the date and time of
                                the alleged infringement; (vii) any other information that may be prescribed by
                                regulation that we may advise you of from time-to-time. Please be aware that if
                                you knowingly materially misrepresent that material or activity on SuperKluster is
                                infringing your copyright, you may be held liable for damages (including costs
                                and all legal fees, disbursements, and charges).
                            </p>

                            <p>(c) The Notice may not contain any of the following: (i) an offer to settle the claimed
                                infringement; (ii) a request or demand relating to the claimed infringement for
                                payment or for personal information; (iii) a reference, including by way of
                                hyperlink, to such an offer, request, or demand; or (iv) any other information that
                                may be prescribed by regulation that we may advise you of from time-to-time
                                (collectively, “Prohibited Content”). A Notice containing Prohibited Content will
                                not be considered a valid Notice under the Terms (see Copyright Act, R.S.C.,
                                1985, c. C-42, s. 41.25(3).)
                            </p>

                            <p>(d) If we receive a Notice in the prescribed form, we will, as soon as feasible, forward
                                the Notice electronically to the person to whom the electronic location identified
                                by the location data in the Notice belongs and inform you of our doing so. If, for
                                some reason, it is not possible for us to forward the Notice to such person, we will
                                confirm with you the reasons therefore.
                            </p>

                            <p>(e) We will retain records of Notices in compliance with our obligations under
                               applicable laws and regulations.
                            </p>

                            <p>23. Right to Remove Allegedly Infringing Content.</p>
                            <p> SuperKluster reserves the right to remove any Content that allegedly infringes another person's copyright or trademark rights, thereby restricting access to or visibility of a Work on SuperKluster and restricting the Owner's ability to sell, access, or view the associated SuperKluster Item on SuperKluster. All transactions involving SuperKluster Items are conducted with the knowledge and assumption of the risk that the Item may subsequently be removed from SuperKluster as a consequence of a dispute or a User’s violation of these Terms. SuperKluster shall not be liable to a Collector or Artist of an Item that was subsequently taken down by SuperKluster due to alleged infringement of a person’s copyright or trademark rights. We may at any time, without prior notice and in our sole discretion, remove material and/or terminate a User’s Account for submitting material in violation of our Terms.</p>

                            <p>24. Infringers May Be Liable.</p>
                            <p> Artists expressly agree to refund to the Collector and/or
                                SuperKluster the entire portion of ETH received from the sale of a SuperKluster Item that was subsequently removed from SuperKluster pursuant to a copyright infringement claim including any royalties received on secondary sales. SuperKluster will not be held liable under any circumstance to any Collector or User for removing allegedly infringing works from SuperKluster or otherwise fulfilling its legal
                                obligations.
                            </p>

                            <p>25. User Agree to Cooperate with SuperKluster.</p>
                            <p> Artist, Collectors, and all Users expressly agree to cooperate and respond in a timely manner to SuperKluster’s investigations, requests, and inquiries related to copyright disputes or allegations of infringement. Users agree to SuperKluster’s initiating a “burn” transaction upon SuperKluster’s request for SuperKluster Items that have been permanently removed from SuperKluster pursuant to a valid copyright infringement claim, or that are otherwise alleged to be infringing.</p>
                            
                            <h3>Disclaimers and Limitations on Our Liability</h3>

                            <p>26. Disclaimers of Warranty.</p>

                            <p>((a) YOU UNDERSTAND AND AGREE THAT YOUR USE OF SUPERKLUSTER,
                                ITS CONTENT, AND ANY SERVICES OR ITEMS FOUND OR ATTAINED
                                THROUGH THE FOREGOING IS AT YOUR OWN RISK. SUPERKLUSTER,
                                ITS CONTENT, AND ANY SERVICES OR ITEMS FOUND OR ATTAINED
                                THROUGH THE FOREGOING ARE PROVIDED ON AN “AS IS” AND “AS
                                AVAILABLE” BASIS, WITHOUT ANY WARRANTIES OR CONDITIONS
                                OF ANY KIND, EITHER EXPRESS OR IMPLIED INCLUDING, BUT NOT
                                LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY,
                                FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT. THE
                                FOREGOING DOES NOT AFFECT ANY WARRANTIES THAT CAN NOT BE
                                EXCLUDED OR LIMITED UNDER APPLICABLE LAW.
                            </p>

                            <p>(b) NEITHER SUPERKLUSTER NOR ITS SUBSIDIARIES, AFFILIATES, OR
                                THEIR RESPECTIVE DIRECTORS, OFFICERS, EMPLOYEES, AGENTS,
                                SERVICE PROVIDERS, CONTRACTORS, LICENSORS, LICENSEES,
                                SUPPLIERS, OR SUCCESSORS MAKE ANY WARRANTY,
                                REPRESENTATION, OR ENDORSEMENT WITH RESPECT TO THE
                                COMPLETENESS, SECURITY, RELIABILITY, SUITABILITY, ACCURACY,
                                CURRENCY, OR AVAILABILITY OF SUPERKLUSTER OR ITS
                                CONTENTS. WITHOUT LIMITING THE FOREGOING, NEITHER
                                SUPERKLUSTER NOR ITS SUBSIDIARIES, AFFILIATES OR ITS AND THEIR
                                RESPECTIVE DIRECTORS, OFFICERS, EMPLOYEES, AGENTS, SERVICE
                                PROVIDERS, CONTRACTORS, LICENSORS, LICENSEES, SUPPLIERS, OR
                                SUCCESSORS REPRESENT OR WARRANT THAT SUPERKLUSTER, ITS
                                CONTENT, OR ANY SERVICES OR ITEMS FOUND OR ATTAINED
                                THROUGH THE FOREGOING WILL BE ACCURATE, RELIABLE, ERROR-
                                FREE, OR UNINTERRUPTED, THAT DEFECTS WILL BE CORRECTED,
                                THAT OUR PLATFORM OR THE SERVER THAT MAKES THEM
                                AVAILABLE ARE FREE OF VIRUSES OR OTHER HARMFUL
                                COMPONENTS.
                            </p>

                            <p>(c) WE CAN NOT AND DO NOT GUARANTEE OR WARRANT THAT FILES
                                OR DATA AVAILABLE FOR DOWNLOADING FROM THE INTERNET OR
                                SUPERKLUSTER WILL BE FREE OF VIRUSES OR OTHER DESTRUCTIVE
                                CODE. YOU ARE SOLELY AND ENTIRELY RESPONSIBLE FOR YOUR
                                USE OF SUPERKLUSTER AND YOUR COMPUTER, INTERNET, AND
                                DATA SECURITY. TO THE FULLEST EXTENT PROVIDED BY LAW, WE
                                WILL NOT BE LIABLE FOR ANY LOSS OR DAMAGE CAUSED BY
                                DENIAL-OF-SERVICE ATTACKS, DISTRIBUTED DENIAL-OF-SERVICE
                                ATTACKS, OVERLOADING, FLOODING, MAILBOMBING, OR
                                CRASHING, VIRUSES, TROJAN HORSES, WORMS, LOGIC BOMBS, OR
                                OTHER TECHNOLOGICALLY HARMFUL MATERIAL THAT MAY
                                INFECT YOUR COMPUTER EQUIPMENT, COMPUTER PROGRAMS,
                                DATA, OR OTHER PROPRIETARY MATERIAL DUE TO YOUR USE OF
                                SUPERKLUSTER OR ANY SERVICES OR ITEMS FOUND OR ATTAINED
                                THROUGH SUPERKLUSTER OR TO YOUR DOWNLOADING OF ANY
                                MATERIAL POSTED ON IT, OR ON ANY WEBSITE LINKED TO IT.
                            </p>

                            <p>27. Limitation on Liability.</p>

                            <p>(a) EXCEPT WHERE SUCH EXCLUSIONS ARE PROHIBITED BY LAW,
                                UNDER NO CIRCUMSTANCE WILL SUPERKLUSTER (INCLUDING OUR
                                SUBSIDIARIES AND AFFILIATES, AND OUR AND THEIR OFFICERS,
                                DIRECTORS, AGENTS, EMPLOYEES, SERVICE PROVIDERS,
                                CONTRACTORS, LICENSORS, LICENSEES, SUPPLIERS, OR
                                SUCCESSORS) BE LIABLE TO YOU OR ANY THIRD PARTY UNDER ANY
                                CLAIM AT LAW OR IN EQUITY FOR ANY CONSEQUENTIAL DAMAGES
                                OR LOSSES (INCLUDING, BUT NOT LIMITED TO, LOSS OF MONEY,
                                GOODWILL OR REPUTATION, PROFITS, OTHER INTANGIBLE LOSSES,
                                OR ANY SPECIAL, INDIRECT, OR CONSEQUENTIAL DAMAGES), AND
                                ALL SUCH DAMAGES OR LOSSES ARE EXPRESSLY EXCLUDED BY
                                THIS AGREEMENT WHETHER OR NOT THEY WERE FORESEEABLE OR
                                SUPERKLUSTER WAS ADVISED OF SUCH DAMAGES OR LOSSES.
                                WITHOUT LIMITING THE GENERALITY OF THE FOREGOING, WE
                                (INCLUDING OUR SUBSIDIARIES AND AFFILIATES, AND OUR AND
                                THEIR OFFICERS, DIRECTORS, AGENTS, EMPLOYEES, SERVICE
                                PROVIDERS, CONTRACTORS, LICENSORS, LICENSEES, SUPPLIERS, OR
                                SUCCESSORS) ARE NOT LIABLE AND YOU AGREE NOT TO HOLD US
                                RESPONSIBLE, FOR ANY DAMAGES OR LOSSES (INCLUDING, BUT
                                NOT LIMITED TO, LOSS OF MONEY, GOODWILL OR REPUTATION,
                                PROFITS, OR OTHER INTANGIBLE LOSSES OR ANY SPECIAL,
                                INDIRECT, OR CONSEQUENTIAL DAMAGES) RESULTING DIRECTLY
                                OR INDIRECTLY FROM: (A) THE CONTENT YOU PROVIDE (DIRECTLY
                                OR INDIRECTLY) USING SUPERKLUSTER; (B) YOUR USE OF OR YOUR
                                INABILITY TO USE SUPERKLUSTER; (C) DELAYS OR DISRUPTIONS ON
                                SUPERKLUSTER; (D) VIRUSES OR OTHER MALICIOUS SOFTWARE
                                OBTAINED BY ACCESSING OR LINKING TO SUPERKLUSTER; (E)
                                GLITCHES, BUGS, ERRORS, OR INACCURACIES OF ANY KIND ON THE
                                PLATFORM; (F) DAMAGE TO YOUR HARDWARE DEVICE(S) OR LOSS
                                OF DATA THAT RESULTS FROM THE USE OF SUPERKLUSTER; (G) THE
                                CONTENT, ACTIONS, OR INACTIONS OF THIRD PARTIES, INCLUDING
                                IN RESPECT OF SUPERKLUSTER ITEMS LISTED USING SUPERKLUSTER;
                                (H) A SUSPENSION OR OTHER ACTION TAKEN WITH RESPECT TO
                                YOUR ACCOUNT; (I) THE DURATION OR MANNER IN WHICH A
                                LISTING APPEARS IN SEARCH RESULTS; OR (J) YOUR NEED TO
                                MODIFY PRACTICES, CONTENT, OR BEHAVIOUR OR YOUR LOSS OF
                                OR INABILITY TO DO BUSINESS, AS A RESULT OF CHANGES TO THE
                                TERMS, SUPERKLUSTER OR ANY OF OUR OTHER POLICIES.
                            </p>

                            <p>(b) Some jurisdictions do not allow the disclaimer of warranties or exclusion of
                                damages, so such disclaimers and exclusions may not apply to you. Regardless of
                                the previous paragraphs, if we are found to be liable, our liability to you or to any
                                third party is limited to the greater of: (i) the total amount of all proceeds received
                                by SuperKluster from you in connection with your activities on SuperKluster in the
                                12 months prior to the action giving rise to the liability, or (ii) $100.
                            </p>
                            
                            <h3>Assumption of the Risk</h3>

                            <p>28. Cryptocurrency and Smart Contracts Risk.</p>
                            <p> YOU HEREBY ACKNOWLEDGE AND
                                AGREE THAT YOU UNDERSTAND AND ARE WILLING TO ACCEPT THE RISKS
                                ASSOCIATED WITH CRYPTOGRAPHIC SYSTEMS SUCH AS THE SMART
                                CONTRACTS, WITH EVM CHAIN, AND
                                NFTS. WE WILL NOT BE RESPONSIBLE OR LIABLE TO YOU FOR ANY LOSSES
                                YOU INCUR AS THE RESULT OF YOUR USE OF THE ETHEREUM OR ANY BLOCKCHAIN-COMPATIBLE BROWSER OR WALLET, INCLUDING, BUT NOT LIMITED TO, ANY LOSSES, DAMAGES, OR CLAIMS ARISING FROM: (A) USER ERROR, SUCH AS FORGOTTEN PASSWORDS OR INCORRECTLY CONSTRUED SMART CONTRACTS OR
                                OTHER TRANSACTIONS; (B) SERVER FAILURE OR DATA LOSS; (C)
                                CORRUPTED WALLET FILES; (D) UNAUTHORIZED ACCESS OR ACTIVITIES
                                BY THIRD PARTIES, INCLUDING BUT NOT LIMITED TO THE USE OF
                                VIRUSES, PHISHING, BRUTE-FORCING OR OTHER MEANS OF ATTACK
                                AGAINST SUPERKLUSTER, ETHEREUM, FANTOM OR SYSCOIN NETWORKS,
                                OR BLOCKCHAIN-COMPATIBLE BROWSER OR WALLET.
                            </p>

                            <p>29. No Responsibility for Technical Errors.</p>
                            <p> SUPERKLUSTER IS NOT RESPONSIBLE FOR
                                LOSSES DUE TO TECHNICAL ERRORS OF BLOCKCHAINS, ANY FEATURES OF
                                EVM CHAINS OR ANY BLOCKCHAIN-COMPATIBLE BROWSER OR WALLET, INCLUDING BUT NOT LIMITED TO LATE REPORTS BY DEVELOPERS OR REPRESENTATIVES (OR NO REPORT AT ALL) OF ANY ISSUES WITH THE BLOCKCHAIN SUPPORTING THE ETHEREUM, FANTOM OR SYSCOIN NETWORKS, INCLUDING FORKS, UPGRADES, TECHNICAL NODE ISSUES, OR ANY OTHER ISSUES HAVING
                                FUND LOSSES AS A RESULT.
                            </p>

                            <p>30. Risks of SuperKluster.</p>
                            <p> You acknowledge that SuperKluster is subject to flaws and
                                acknowledge that you are solely responsible for evaluating any code provided by the
                                Platform. This warning and others provided in the Terms by SuperKluster in no way
                                evidence or represent an ongoing duty to alert you to all of the potential risks of utilizing or accessing SuperKluster. SuperKluster may experience sophisticated cyber-attacks, unexpected surges in activity, or other operational or technical difficulties that may cause interruptions to or delays on SuperKluster.  You agree to accept the risk of SuperKluster failure resulting from unanticipated or heightened technical difficulties, including those resulting from sophisticated attacks, and you agree not to hold us accountable for any related losses.  We will not bear any liability, whatsoever, for any damage or interruptions caused by any viruses that may affect your computer or other equipment, or any phishing, spoofing, or other attacks.
                            </p>

                            <p>31. No Guarantee of Value or Title of SuperKluster Items The prices of blockchain assets are extremely volatile.</p>
                            <p> Fluctuations in the price of other digital assets could materially and adversely affect the value of your SuperKluster Items, which may also be subject to significant price volatility. A lack of use or public interest in the creation and development of distributed ecosystems could negatively impact the development of the SuperKluster ecosystem, and therefore the potential utility or value of SuperKluster Items. SuperKluster, digital currencies, and digital assets could be impacted by one or more regulatory inquiries regulatory actions, or legislative policies which could impede or limit the ability of SuperKluster to continue to develop SuperKluster, or which could impede or
                                limit your ability to access or use SuperKluster or the Networks. SuperKluster Items may be encumbered by actual or possible copyright or trademark claims against the Item.
                            </p>
                             
                            <p>32. Copyright Infringement Risk.</p>
                            <p> SuperKluster reserves the right to remove any Content that allegedly infringes another person's copyright or trademark rights, thereby restricting access to or visibility of a Work on SuperKluster and restricting the Owner's ability to sell, access, or view the associated SuperKluster Item on SuperKluster. All transactions involving SuperKluster Items are conducted with the knowledge and assumption of the risk that the Item may subsequently be removed from SuperKluster as a consequence of a dispute or a User’s violation of these Terms. SuperKluster shall not be liable to a Collector or Artist of an Item that was subsequently taken down by SuperKluster due to alleged infringement of a person’s copyright or trademark rights. We may at any time, without prior notice and in our sole discretion, remove material and/or terminate a User’s Account for submitting material in violation of our Terms.</p>
                             
                            <p>33. Financial Risk of Digital Assets. </p>
                            <p>Use of SuperKluster, including the creating, buying,
                                selling, or trading of digital assets, may carry financial risk. Digital assets are, by their
                                nature, highly experimental, risky, and volatile, and transactions carried through the
                                Platforms are irreversible, final, and non-refundable.  You acknowledge and agree that
                                you will access and use SuperKluster at your own risk.  The risk of loss in trading digital assets can be substantial.  You should, therefore, carefully consider whether creating, buying, selling, or trading digital assets is suitable for you in light of your circumstances and financial resources. By using SuperKluster, you represent, warrant and covenant that you have been, are, and will be solely responsible for making your own independent appraisal and investigations into the risks of a given transaction and the underlying digital assets. You represent that you have sufficient knowledge, market sophistication, professional advice, and experience to make your own evaluation of the merits and risks of any transaction conducted via SuperKluster or any underlying digital asset. You accept all consequences of using SuperKluster, including the risk that you may lose access to your digital assets indefinitely.  All transaction decisions are made solely by you. Not-with-standing anything in this Agreement, we accept no responsibility whatsoever for and will in no circumstances be liable to you in connection with the use of SuperKluster for performing digital asset transactions. Under no circumstances will the operation of all or any portion of SuperKluster be deemed to create a relationship that includes the provision or tendering of investment advice.
                            </p>
                            
                            <h3>Governing Law and Choice of Forum</h3>

                            <p>34. Governing Law.</p>
                            <p> SuperKluster, the Site and these Terms will be governed by and
                                construed in accordance with the laws of the Province of Panama and the federal laws of the Central Americas applicable therein, without giving effect to any choice or conflict of law provision, principle, or rule (whether of the laws of the Province of Panama or any other jurisdiction) and not-with-standing your domicile, residence, or physical location.
                            </p>
                             
                            <p>35. Choice of Forum.</p>
                            <p> Any action or proceeding arising out of or relating to your use of SuperKluster and under these Terms will be instituted in the courts of the Province of Panama, and each party irrevocably submits to the exclusive jurisdiction of such courts in any such action or proceeding. You waive any and all objections to the exercise of jurisdiction over you by such courts and to the venue of such courts.</p>
                            
                            <h3>Miscellaneous Terms</h3>

                            <p>36. Terms May Change.</p>
                            <p> These Terms may be discretionarily modified or replaced by
                                SuperKluster at any time. The most current version of this Agreement will be posted on the Site with the “Last Revised” date at the top of the Agreement changed. Any changes or modifications will be effective immediately upon posting the revisions to the Site. You shall be responsible for reviewing and becoming familiar with any such modifications. You waive any right you may have to receive specific notice of such changes or modifications. Use of SuperKluster by you after any modification to the Agreement constitutes your acceptance of the Agreement as modified. If you do not agree to the Agreement in effect when you access or use SuperKluster, you must discontinue your use of SuperKluster. We may, at any time and without liability or prior notice, modify or discontinue all or part of SuperKluster (including access to SuperKluster via any third-party links).
                            </p>

                            <p>37. Smart Contracts May Change.</p>
                            <p> The User acknowledges that SuperKluster may modify, change, amend, or replace one or more of the Smart Contracts from time to time.  The User agrees that a modification to one or more of the Smart Contracts does not alter any right or obligation conferred by these Terms.</p>

                            <p>38. Confidentiality of Communications.</p>
                            <p> Users may voluntarily contact SuperKluster to report serious misuses of SuperKluster including, for example, suspicious market activity, hate speech, or other serious violations of these Terms. User agrees to keep confidential all private correspondence with SuperKluster pertaining to another member’s alleged violation of these Terms or other inquiries about SuperKluster’s policies.</p>

                            <p>39. Indemnification.</p>
                            <p> You agree to indemnify, defend and hold harmless SuperKluster and our subsidiaries, affiliates, partners, officers, directors, agents, contractors, licensors, service providers, subcontractors, suppliers, interns, and employees harmless from any claim or demand, including reasonable attorneys’ fees, made by any third-party due to or arising out of your breach of these Terms or the documents they incorporate by reference, or your violation of any law or the rights of a third-party, including, without limitation and for greater certainty, the intellectual property rights of a third-party.</p>

                            <p>40. Severability.</p>
                            <p> In the event that any provision of these Terms is determined to be unlawful, void or unenforceable, such provision shall nonetheless be enforceable to the fullest extent permitted by applicable law, and the unenforceable portion shall be deemed to be severed from these Terms, and such determination shall not affect the validity and enforceability of any other remaining provisions.</p>

                            <p>41. Termination.</p>
                            <p> You may terminate these Terms at any time by canceling your account on SuperKluster and discontinuing your access to and use of SuperKluster.  You will not receive any refunds and you will remain liable for all amounts due up to and including the date of termination if you cancel your Account or otherwise terminate these Terms.  You agree that we, in our sole discretion and for any or no reason, may terminate these Terms and suspend and/or terminate your account(s) for SuperKluster. You agree that any suspension or termination of your access to SuperKluster may be without prior notice and that we will not be liable to you or to any third party for any such suspension or termination. If we terminate these Terms or suspend or terminate your access to or use of SuperKluster due to your breach of these Terms or any suspected fraudulent, abusive, or illegal activity, then termination of these Terms will be in addition to any other remedies we may have at law or in equity. Upon any termination or expiration of these Terms, whether by you or us, you may no longer have access to information that you have posted on SuperKluster or that is related to your account, and you acknowledge that we will have
                                no obligation to maintain any such information in our databases or to forward any such information to you or to any third party. The obligations and liabilities of the parties incurred prior to the termination date shall survive the termination of this agreement for all purposes.
                            </p>

                            <p>42. No Assignment of the Terms.</p>
                            <p> Neither party may assign or transfer any rights or
                                obligations under this Agreement without the prior written consent of the other party,
                                provided that SuperKluster may assign this Agreement without your prior consent to any of SuperKluster's affiliates, or to its successors in the interest of any business associated with the services provided by SuperKluster. This Agreement shall be binding upon the permitted assigns or transferees of each party.
                            </p>

                            <p>43. Waiver.</p>
                            <p> No failure to exercise, or delay in exercising, any right, remedy, power, or
                                privilege arising from these Terms operates, or may be construed, as a waiver thereof;
                                and no single or partial exercise of any right, remedy, power, or privilege hereunder
                                precludes any other or further exercise thereof or the exercise of any other right, remedy, power, or privilege.
                            </p>

                            <p>44. Entire Agreement.</p>
                            <p> Except for Artists who have entered into NFT License and Marketing Agreements, these Terms and any policies or operating rules posted by us on SuperKluster constitute the entire agreement and understanding between you and us and govern your use of SuperKluster and the Site, superseding any prior or contemporaneous agreements, communications and proposals, whether oral or written, between you and us (including, but not limited to, any prior versions of the Terms of Service).</p>

                            <p>45. Ambiguities.</p>
                            <p> Any ambiguities in the interpretation of these Terms of Service shall not be construed against the drafting party.</p>
                            <p>46 Badge Ratings.</p>
                            <p>To inform SuperKluster users of buyers and sellers not adhering to the platform's rules. If a buyer does not have sufficient $VXL tokens for the seller to reasonably execute the sell transaction within 7 days before expiration, the buyer will receive a negative rating on their badge. If the buyer receives 5 warnings to their rating badge, their account will be temporally suspended for 7 days. Once reactivated, if another 5 negative badges are received the account will be suspended for 30 days. Thereafter once reactivated if the account receives another 5 negative badges the account will be suspended for 365 days. </p>

                            <h3>SuperKluster Verification</h3>
                            <p>47. KYC Verification Disclaimer</p>
                            <p>We take no responsibility for any third parties whose information they hold against you. SuperKluster will however, to the best of its capability verify KYC verification against third parties.
                            It is the responsibility of the creators & partners to provide and maintain accurate information when completing this process with third parties verification services.</p>
                        </Div>
                    </Div>
                </section>
            </div>
        </>
    );
}
export default memo(SKTermsPage);