import React, { memo, useState ,useEffect } from "react";
import { Collapse } from 'antd';
import styled, { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
`;

const Div = styled.div`
    align-items: center;
    margin: 5px 0px 30px;
`;

const EmailLink = styled.span`
    color: #f70dff;
    cursor: pointer;
`

const BorderLine = styled.hr`
margin: 0px;
margin-bottom: 10px;
border: 1px solid #5e5d6e;
height: 1px;
`
const informData = [
    { question: `Has SuperKluster been audited?`, answer: <div>SuperKluster has been audited by Certik.<br/><br/>  <a style={{color:'#f70dff'}} href="https://www.certik.com/projects/voxel-x-network" target="_blank">https://www.certik.com/projects/voxel-x-network</a> </div> },
    { question: `How do I turn off Explicit & Sensitive NFTs?`, answer: <div>Visit the edit profile page - Here you have the option to turn explicit content on and off.</div> },
    { question: `How do I turn off email notifications?`, answer: <div>Visit the edit profile page - Here you have the option to turn email notifications on and off.</div> },
    { question: `Who pays SuperKluster transaction fee?`, answer: <div>Buyers will pay for the gas and transaction fees when purchasing 'Buy Now' NFTs.<br/><br/>Sellers will pay the gas and transaction fees when accepting offers for their NFTs.</div> },
    { question: `How do auctions work on SuperKluster?`, answer: <div>Seller lists NFT auction items on SuperKluster with a reserve price.<br/><br/>The buyer places a bid, which must always be greater than the previous highest bid.<br/><br/>Once auction time ends, the seller has seven days to execute the seller transaction (seller will be liable for the gas fee), if they do not fulfill their responsibility, the seller will receive a negative badge rating against their name.<br/><br/>The buyer will have the option to execute to buy their item 48 hours before the auction item expires (buyer will be liable for the gas fee).</div> },
    { question: `My NFT is listed by someone else on SuperKluster`, answer: <div>Reach out to <a style={{color:'#f70dff', wordBreak:'keep-all'}} href="mailto:support@superkluster.io" target="_blank">support@superkluster.io</a> for help getting this resolved. You must be able to prove you are the original owner of the NFT.</div> },
    { question: `What are badge ratings?`, answer: <div>Badge ratings are to inform the community of buyers or sellers not playing by the rules.<br/><br/>Badge ratings will effectively play a big part in auctions.<br/><br/>If the buyer does not have sufficient VXL tokens for the seller to reasonably execute the sell transaction within the 7 days before expiry, they will receive a negative rating on their rating badge.<br/><br/>If the buyer receives another 5 warnings to their rating badge, their account will automatically be deactivated for 7 days.<br/><br/>If after the account is reactivated, the buyer receives another 5 warnings to their rating badge, their account will automatically be deactivated for 30 days.<br/><br/>If after the account is reactivated again, the buyer receives another 5 warnings to their rating badge, their account will automatically be deactivated for 365 days.</div> },
    { question: `Why do we not have an auction reserve price?`, answer: <div>At SuperKluster we believe in having a starting price only.<br/><br/>Why place an auction item if you're not willing to sell it unless it hits your reserved specified price.<br/><br/>Transparency is key, so make sure you place your minimum price you're willing to sell your NFT at.</div> },
    { question: `Why should I verify my profile?`, answer: <div>SuperKluster is a fully decentralized platform.<br/><br/>There is no requirement for you to verify your profile.<br/><br/>But if you would like to build confidence amongst buyers, then the option to verify your profile has been included.<br/><br/>Either list your project on Voxel X NFT, GameFi & Metaverse Partnerships or provide official KYC documentation</div> },
    { question: `Can I verify my collection?`, answer: <div>SuperKluster is a fully decentralized platform.<br/><br/>There is no requirement for you to verify your collection.<br/><br/>With the amount of scammers in the defi ecosystem, verifying your collection will add another layer of trust. This ensure buyers your collection is legit and trusted.</div> },
    { question: `Why can't I upload my 3D Model?`, answer: <div>Always make sure all files have been uploaded.<br/><br/>Before minting your 3D model, please ensure you verify and check your 3D model are displaying accurately at <a style={{color:'#f70dff'}} href="https:/3dviewer.net" target="_blank">http:/3dviewer.net</a> or <a style={{color:'#f70dff'}} href="https:/threejs.org/editor" target="_blank">https:/threejs.org/editor</a>.</div> },
    { question: `Which EVM chains can I mint on?`, answer: <div>SuperKluster accepts all the major EVM chains such as:<br/><br/>Ethereum, Binance Smart Chain, Polygon, Avalanche, Fantom and Arbitrum.</div>},
    { question: `Does SuperKluster accept Ether?`,answer:<div>You can only use ETH for 'Buy Now' status NFT items (won't be available for bids or auction items)<br/><br/>Note: Buyer will pay a gas fee to swap $ETH to $VXL which will then be transferred to your wallet.</div> },
    { question: `What is Lazy minting?`, answer: <div>Lazy minting means you will  pay a gas fee and the NFT will be minted only once you have placed your created NFT up for sale.</div> },
    { question: `How long can I list my NFT item?`, answer: <div>Fixed price items, max 360 days.<br/><br/>Timed Auction items, max 30 days.</div> },
    { question: `What happens if I don't provide an end date for a fixed priced item?`, answer: <div> Fixed priced items default end date will be set for a max of 90 days.<br/><br/>Timed Auction items default end date will be set for max 7 days.</div> } ,
    { question: `Why does the item history show different VXL and USD value for some transactions?`, answer: <div>You must consider VXL price will fluctuate against the $USD price ie $USD1 = $VXL100.<br/><br/>So at any specific date and time, the USD price will remain constant, while the VXL price will increase or decrease according the swap rate ie $USD1 = $VXL200.<br/><br/>For the exception of the final sold transaction, which is the actual sold amount based on the final live swap rate.</div> },
    { question: `How do I find items that I have placed bids/offers on or bids/offers have been placed on my items?`, answer: <div>You can visit your collection page, select activity, and then click on bids to see all current items or offers which you have placed or someone has placed on your items.</div> } ,
    { question: `Where can I see the bids I have placed?`, answer: <div>Visit 'My profile', select 'Bids', and you will find all items you have placed a bid on and will provide you the highest bid on that item too.</div> } ,
    { question: `Does SuperKluster accept any other payment besides $VXL Token? `, answer: <div>$VXL is the primary token for all payments.<br/><br/>However, you can select ETH when buying or selling items, which will swap ETH to VXL, and then purchase or sell the NFT item in VXL<br/><br/>For all other chains, we accept their native tokens ie BSC, MATIC, AVAX, Avalanche, FTM and Arbitrum for both to buy and sell<br/><br/>Bids can not be made in ETH, we will only accept VXL tokens, and for other accepted chains you must use their associated wrapped tokens ie WBNB</div> },
    { question: `How can I delete my profile?`, answer: <div>Reach out to <a style={{color:'#f70dff', wordBreak:'keep-all'}} href="mailto:support@superkluster.io" target="_blank">support@superkluster.io</a> and submit a request for your profile to be deleted. You must be able to prove you are the owner of the profile address in order to have your request granted.</div> },
    { question: `When do I pay gas fees?`, answer: <div>First time using SuperKluster with your wallet to approve tokens <br/> Accepting an offer for your item<br/>Transferring NFT to someone<br/>Purchasing an NFT<br/>Listing an item for sale for the first time<br/><br/><b>No gas fees are charged when:</b><br/><br/>Creating your NFT <br/>Creating your collection<br/>Reducing your NFT listing pricing<br/>Cancelling a bid<br/>Cancelling your NFT listing</div> },
    { question: `I am under 18, how can I use and list my NFTs SuperKluster?`, answer: <div>A parent or guardian can create an account on your behalf and maintain your profile.</div>},
    { question: `What is the cart function?`, answer: <div>The cart function is a simple but convenient function! That allows the the buyer to select multiple NFTs which they like and add to their cart to purchase all at once, while only paying one gas fee.</div>},
    { question: `Can I transfer multiple NFTs and to multiple wallets?`, answer: <div>Yes! We have even simplified this further by allowing multiple NFTs to be sent to different wallet addresses in a single transaction, saving time and gas.<br/><br/>In your account profile go to your "Collected" tab and select Items you wish to transfer.<br/><br/>You can easily send your NFTs to a maximum of three different wallet addresses by grouping the NFTs into different colour groups. Then finally nominating the wallet address for each colour group and then confirming the transaction after a final review.<br/><br/>Example: <br/>Select 3 Items with pink color<br/>Select 4 items  with green color<br/>Select 2 items with blue color<br/><br/>If you want send multiple items to one wallet, then use same color for every item.<br/><br/>Due to the “lazy mint” feature of SuperKluster. NFTs are minted off chain until the the NFTs are sold and then recorded on blockchain as a transaction. It is only after this, they can be transferred to a your non custodial wallet.</div>},
    { question: `Can I reserve an NFT for a specific wallet?`, answer: <div>Yes. When you place your NFT for sale. Select the option to “reserve an item to a specific buyer” then follow the on screen prompts to finalise the specific NFT for reserved sale.</div>},
    { question: `Follow/Unfollow`, answer: <div>Follow Collections or creators that you like on SuperKluster to keep up with their activity. Receive notifications on SupeKluster when logged into your account aswell as email notifications if they are enabled.</div>},
    { question: `Report malicious or harmful items`, answer: <div>You can report an Item that you suspect of suspicious or harmful activity. The SupeKluster team will look into reported items and take action accordingly.</div>},
    { question: `My item or collection has been wrongly flagged as a scam`, answer: <div>Reach out to <a style={{color:'#f70dff', wordBreak:'keep-all'}} href="mailto:support@superkluster.io" target="_blank">support@superkluster.io</a> for help getting this resolved. You must be able to prove you are the original owner of the NFT.</div>}
]

const { Panel } = Collapse;



const FaqPage = function ({colormodesettle}) {
    useEffect(()=>{
        localStorage.setItem('searchValue','') ;
    
      },[])
    return (
        <>
            <div>
                <GlobalStyles />

                <section className='custom-container'>
                    <Div className="row" style={{ margin: '50px 5vw 0px 5vw'}}>
                        <h2 style={{ textAlign: 'center', fontFamily:'Inter' }}>FAQ</h2>
                        <Div>
                            Learn answers to frequently asked questions on &nbsp;
                            <a style={{color:'#f70dff', wordBreak:'keep-all'}} target="_blank" href="mailto:support@superkluster.io">info@voxelxnetwork.com</a>
                        </Div>
                        <Collapse accordion defaultActiveKey={['0']} ghost >
                            {
                                informData.map((info , inx)=>(
                                    <Panel className="head_que"  header={info.question} key={inx}>
                                        <p className="coll_ans">{info.answer}</p>
                                    </Panel>
                                ))
                            }
                            
                        </Collapse>
                    </Div>
                </section>
            </div>
        </>
    );
}
export default memo(FaqPage);