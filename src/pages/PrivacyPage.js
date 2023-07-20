import React, { memo, useEffect } from "react";
import styled, { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
`;

const Div = styled.div`
    align-items: center;
    margin: 5px 0px;
`;

const BorderLine = styled.hr`
margin: 0px;
margin-bottom: 10px;
border: 1px solid #5e5d6e;
height: 1px;
`
const informData = [
    { id: 0, content: 'The personal data we will collect' },
    { id: 1, content: 'Use of collected data' },
    { id: 2, content: 'Who has access to the data collected' },
    { id: 3, content: 'The rights of Site users; and' },
    { id: 4, content: "The Site's cookie policy" }
]
const PrivacyPage = function ({colormodesettle}) {
    useEffect(()=>{
        localStorage.setItem('searchValue','') ;
    
      },[])
    return (
        <>
            <div>
                <GlobalStyles />

                <section className='custom-container'>
                    <Div className="row" style={{ margin: '50px 5vw 0px 5vw', paddingLeft:'vw', wordBreak:'keep-all'}}>
                        <h2 style={{ textAlign: 'center', wordBreak:'keep-all', fontSize:'28px', fontFamily:'Inter'}}>SuperKluster.io Privacy Policy</h2>
                        <Div>
                            <span>Last revised: 22.7.2022</span> <br/><br/>
                            SuperKluster.io (the "Site") is owned and operated by Voxel X Network. Voxel X Network is the ultimate data controller and can be contacted at:<br />
                            <a style={{color:'#f70dff'}} target="_blank" href="mailto:info@voxelxnetwork.com">info@voxelxnetwork.com</a>

                            <br/><br/>
                            Voxel X Network (“SuperKluster”, “we”, “us”, or “our”) is committed to protecting your privacy and we have prepared this Privacy Policy to describe to you our best practices regarding personal data we use to collect, and share with the SuperKluster website, app and other software provided on or in connection with our services, as described in our Terms of Service. <br/><br/>
                            “NFT” in this Privacy Policy means a non-fungible token or similar digital item implemented on a blockchain (such as Ethereum blockchain), which uses smart contracts to link or otherwise be associated with certain content or data. <br/><br/>
                        </Div>
                            <Div>
                            <h3 style={{ marginBottom: 5 }}>Purpose</h3>
                            <BorderLine style={{ width: 85 }}/>
                            <Div>
                                The purpose of this privacy policy (this "Privacy Policy") is to inform users of our Site of the following:
                            </Div>
                            <Div>
                                <ul>
                                    {
                                        informData.map(item => 
                                            <li key={item.id}>{item.content}</li>)
                                    }
                                </ul>
                            </Div>
                            <Div>
                                This Privacy Policy applies in addition to the terms and conditions of our Site.
                            </Div>
                        </Div>
                        <Div>
                            <h3 style={{ marginBottom: 5 }}>Consent</h3>
                            <BorderLine style={{ width: 90 }}/>
                            <Div>By using our Site users agree that they consent to:</Div>
                            <ui>
                                <li>The conditions are set out in this Privacy Policy.</li>
                            </ui>
                        </Div>
                        <Div>
                            <h3 style={{ marginBottom: 5 }}>Legal Basis for Processing</h3>
                            <BorderLine style={{ width: 280 }}/>
                            <Div>We collect and process personal data about users.</Div>
                            <br/>
                        </Div>
                        <Div>
                            <h3 style={{ marginBottom: 5 }}>Personal Data We Collect</h3>
                            <BorderLine style={{ width: 280 }}/>
                            <Div>We only collect data that helps us achieve the purpose set out in this Privacy Policy. We will not collect any additional data beyond the data listed below without notifying you first.</Div>
                            <br/>
                            <Div>
                                <h5>Data Collected in a Non-Automatic Way</h5>
                                <Div>
                                We may also collect the following data when you perform certain functions on our Site:
                                </Div>
                                <ui>
                                    <li>Age;</li>
                                    <li>Date of birth;</li>
                                    <li>Email address; and</li>
                                    <li>Payment information</li>
                                </ui>
                                <Div>
                                This data may be collected using the following methods:
                                </Div>
                                <ui>
                                    <li>User enters information</li>
                                </ui>
                                <Div>
                                    When you use our Service, update your account profile, or contact us, we may collect Personal Data from you, such as email address, first and last name, user name, and other information you provide. We also collect your blockchain address, which may become associated with Personal Data when you use our Service.
                                </Div>
                                <Div>
                                <Div>
                                    Our Service lets you store preferences like how your content is displayed, notification settings, and favorites. We may associate these choices with your ID, browser, or mobile device.
                                </Div>
                                </Div>
                                <Div>
                                If you provide us with feedback or contact us, we will collect your name and contact information, as well as any other content included in the message.
                                    We may also collect Personal Data at different points in our Service where you voluntarily provide it or where we state that Personal Data is being collected.
                                </Div>
                            </Div>
                        </Div>
                        <Div>
                            <h3 style={{ marginBottom: 5 }}>How We Use Personal Data</h3>
                            <BorderLine style={{ width: 300 }}/>
                            <Div>
                            Data collected on our Site will only be used for the purposes specified in this Privacy Policy or indicated on the relevant pages of our Site. We will not use your data beyond what we disclose in this Privacy Policy.
                            </Div>
                            <br/>
                            <Div>
                                The data we collect when the user performs certain functions may be used for the following purposes:        
                            </Div>
                            <ui>
                                <li>To maintain user profiles on SuperKluster</li>
                            </ui>
                            <ui>
                                <li>We process your Personal Data to run our business, provide the Service, personalize your experience on the Service, and improve the Service. Specifically, we use your Personal Data to:</li>
                                <ol>1.	facilitate the creation of and secure your account;</ol>
                                <ol>2.	identify you as a user in our system;</ol>
                                <ol>3.	provide you with our Service, including, but not limited to, helping you view, explore, and create NFTs using our tools and, at Your discretion, connect directly with others to purchase, sell, or transfer NFTs on public blockchains;</ol>
                                <ol>4.	improve the administration of our Service and quality of experience when you interact with our Service, including, but not limited to, analyzing how you and other users find and interact with the Service;</ol>
                                <ol>5.	provide customer support and respond to your requests and inquiries;</ol>
                                <ol>6.	investigate and address conduct that may violate our Terms of Service;</ol>
                                <ol>7.	detect, prevent, and address fraud, violations of our terms or policies, and/or other harmful or unlawful activity;</ol>
                                <ol>8.	display your username next to the NFTs currently or previously accessible in your third-party wallet, and next to NFTs on which you have interacted;</ol>
                                <ol>9.	send you a welcome email to verify ownership of the email address provided when your account was created;</ol>
                                <ol>10.	send you administrative notifications, such as security, support, and maintenance advisories;</ol>
                                <ol>11.	send you notifications related to actions on the Service, including notifications of offers on your NFTs;</ol>
                                <ol>12.	send you newsletters, promotional materials, and other notices related to our Services or third parties goods and services;</ol>
                                <ol>13.	respond to your inquiries related to employment opportunities or other requests;</ol>
                                <ol>14.	comply with applicable laws, cooperate with investigations by law enforcement or other authorities of suspected violations of law, and/or to pursue or defend against legal threats and/or claims; and</ol>
                                <ol>15.	act in any other way we may describe when you provide the Personal Data.</ol>
                            </ui>
                            <ui>
                                <li>We may create Anonymous Data records from Personal Data. We use this Anonymous Data to analyze request and usage patterns so that we may improve our Services and enhance Service navigation. We reserve the right to use Anonymous Data for any purpose and to disclose Anonymous Data to third parties without restriction.</li>
                            </ui>
                        </Div>
                        <Div>
                            <h3 style={{ marginBottom: 5 }}>Who We Share Personal Data With</h3>
                            <BorderLine style={{ width: 375 }}/>
                            <Div>
                                <h5>Employees</h5>
                                <Div>
                                    We may disclose user data to any member of our organization who reasonably needs access to user data to achieve the purposes set out in this Privacy Policy.
                                </Div>
                                <br/>
                                <h5>Other Disclosures</h5>
                                <Div>
                                    We will not sell or share your data with other third parties, except in the following cases:
                                </Div>
                                <ui>
                                    <li>If the law requires it;</li>
                                    <li>If it is required for any legal proceeding;</li>
                                    <li>To prove or protect our legal rights;</li>
                                    <li>To buyers or potential buyers of this company in the event that we seek to sell the company.</li>
                                </ui>
                                <br/>
                                <Div>
                                    If you follow hyperlinks from our Site to another Site, please note that we are not responsible for and have no control over their privacy policies and practices.
                                </Div>
                                <br/>
                                <Div>
                                    Legal Rights. Regardless of any choices you make regarding your Personal Data (as described below), SuperKluster may disclose Personal Data if it believes in good faith that such disclosure is necessary: (a) in connection with any legal investigation; (b) to comply with relevant laws or to respond to subpoenas, warrants, or other legal process served on SuperKluster; (c) to protect or defend the rights or property of SuperKluster or users of the Service; and/or (d) to investigate or assist in preventing any violation or potential violation of the law, this Privacy Policy, or our Terms of Service.
                                </Div>
                            </Div>
                        </Div>
                        <Div>
                            <h3 style={{ marginBottom: 5 }}>How Long We Store Personal Data</h3>
                            <BorderLine style={{ width: 375 }}/>
                            <Div>
                                User data will be stored until the purpose the data was collected for has been achieved.
                            </Div>
                            <br/>
                            <Div>You will be notified if your data is kept for longer than this period.</Div>
                            <br/>
                            <Div>Data Retention. We may retain your Personal Data as long as you continue to use the Service, have an account with us, or for as long as is necessary to fulfill the purposes outlined in this Privacy Policy. We may continue to retain your Personal Data even after you deactivate your account and/or cease to use the Service if such retention is reasonably necessary to comply with our legal obligations, resolve disputes, prevent fraud and abuse, enforce our Terms or other agreements, and/or protect our legitimate interests. Where your Personal Data is no longer required for these purposes, we will delete it.</Div>
                        </Div>
                        <Div>
                            <h3 style={{ marginBottom: 5 }}>How We Protect Your Personal Data</h3>
                            <BorderLine style={{ width: 390 }}/>
                            <Div>
                                In order to protect your security, we use the strongest available browser encryption and store all of our data on servers in secure facilities. All data is only accessible to our employees. Our employees are bound by strict confidentiality agreements and a breach of this agreement would result in the employee's termination.                        </Div>
                            <br/>
                            <Div>
                                While we take all reasonable precautions to ensure that user data is secure and that users are protected, there always remains the risk of harm. The Internet as a whole can be insecure at times and therefore we are unable to guarantee the security of user data beyond what is reasonably practical.
                            </Div>
                            <br/>
                            <Div>
                                We care about the security of your information and use physical, administrative, and technological safeguards to preserve the integrity and security of information collected through our Service. However, no security system is impenetrable and we cannot guarantee the security of our systems. In the event that any information under our custody and control is compromised as a result of a breach of security, we will take steps to investigate and remediate the situation and, in accordance with applicable laws and regulations, notify those individuals whose information may have been compromised.
                            </Div>
                            <ul>
                                <li>You are responsible for the security of your digital wallet, and we urge you to take steps to ensure it is and remains secure. If you discover an issue related to your wallet, please contact your wallet provider.</li>
                            </ul>
                        </Div>
                        <Div>
                            <h3 style={{ marginBottom: 5 }}>Your Rights as a User</h3>
                            <BorderLine style={{ width: 225 }}/>
                            <Div>
                                you have the following rights:
                            </Div>
                            <ul>
                                <li>Right to be informed</li>
                                <li>Right of access</li>
                                <li>Right to rectification</li>
                                <li>Right to erasure</li>
                                <li>Right to restrict processing</li>
                                <li>Right to data portability</li>
                                <li>Right to object</li>
                            </ul>
                        </Div>
                        <Div>
                            <h3 style={{ marginBottom: 5 }}>Children</h3>
                            <BorderLine style={{ width: 85 }}/>
                            <Div>
                                The minimum age to use our website is 18 years of age. We do not knowingly collect or use personal data from children under 16 years of age. If we learn that we have collected personal data from a child under 16 years of age, the personal data will be deleted as soon as possible. If a child under 16 years of age has provided us with personal data their parent or guardian may contact our privacy officer.
                                <br/>
                                <br/>
                                These Terms may be discretionarily modified or replaced by SuperKluster at any time. The most current version of this Agreement will be posted on the Site with the “Last Revised” date at the top of the Agreement changed.
                            </Div>
                        </Div>
                        <Div>
                            <h3 style={{ marginBottom: 5 }}>Cookie Policy</h3>
                            <BorderLine style={{ width: 140 }}/>
                            <Div>
                                A cookie is a small file, stored on a user's hard drive by a website. Its purpose is to collect data relating to the user's browsing habits. You can choose to be notified each time a cookie is transmitted. You can also choose to disable cookies entirely in your internet browser, but this may decrease the quality of your user experience.
                            </Div>
                            <br/>
                            <Div>
                                We use the following types of cookies on our Site:
                            </Div>
                            <ul>
                                <li>
                                    <h5>Functional cookie</h5>
                                    <Div>Functional cookies are used to remember the selections you make on our Site so that your selections are saved for your next visits and</Div>
                                </li>
                                <li>
                                    <h5>Analytical cookie</h5>
                                    <Div>
                                        Analytical cookies allow us to improve the design and functionality of our Site by collecting data on how you access our Site, for example data on the content you access, how long you stay on our Site, etc.
                                    </Div>
                                </li>
                            </ul>
                        </Div>
                        <Div>
                            <h3 style={{ marginBottom: 5 }}>Modifications</h3>
                            <BorderLine style={{ width: 140 }}/>
                            <Div>
                                This Privacy Policy may be amended from time to time in order to maintain compliance with the law and to reflect any changes to our data collection process. When we amend this Privacy Policy, we will update the "Effective Date" at the top of this Privacy Policy. We recommend that our users periodically review our Privacy Policy to ensure that they are notified of any updates. If necessary, we may notify users by email of changes to this Privacy Policy.
                            </Div>
                        </Div>
                        <Div>
                            <h3 style={{ marginBottom: 5 }}>Contact Information</h3>
                            <BorderLine style={{ width: 222 }}/>
                            <Div>
                            If you have any questions, concerns, or complaints, you can contact our privacy officer at: <br />
                            <a style={{color:'#f70dff'}} target="_blank" href="mailto:info@voxelxnetwork.com">info@voxelxnetwork.com</a>
                            </Div>
                        </Div>
                    </Div>
                </section>
            </div>
        </>
    );
}
export default memo(PrivacyPage);