/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable eqeqeq */
import React, { useState, useEffect } from 'react';
import { Link } from '@reach/router';
import { FaReddit, FaTelegram, FaFacebook, FaTwitter, FaDiscord, FaYoutube, FaInstagram, FaLinkedin, FaLongArrowAltRight } from 'react-icons/fa';
import styled from 'styled-components' ;

const FooterPad = styled.div`
    background-color: ${props => props.theme.secBgColor};
    padding-top: 80px;

    @media (max-width: 1200px) {
        padding-top: 30px;
    }
`

const LinkSection = styled.div`
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
`

const SocialSection = styled.div`
    border-top: 1px solid ${props => props.theme.footerBorderColor};
    display: flex;
    justify-content: space-between;
    padding-top: 28px;
    flex-wrap: wrap;
    margin-top: 80px;

    @media (max-width: 1200px) {
        margin-top: 25px;
    }

    @media (max-width: 650px) {
        justify-content: center;
        flex-direction: column;
        align-items: center;
    }
`

const FooterContainer = styled.div`
`

const InfoSection = styled.div`
    @media (max-width: 1200px) {
        width: 100%;
        margin-bottom: 25px;
    }
`

const LinkGroup = styled.div`
    @media (max-width: 650px) and (min-width: 520px){
        width: 200px;
    }
    
    @media (max-width: 519px) {
        width: 150px;
    }

    @media (max-width: 1200px) {
        padding-bottom: 25px;
    }
`

const Logo = styled.div`
    margin-left: -8px;
`

const SimpleText = styled.div`
    color: ${props => props.theme.filterButtonColor};
    font-size: 17px;
    line-height: 17px;
    font-weight: 400;

    margin-top: 38px;

    padding-left: 12px;

    @media (max-width: 1200px) {
        margin-top: 10px;
        line-height: 25px;
    }
`

const MailBox = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 8px 15px;
    border: 1px solid ${props => props.theme.mailBorderColor};
    border-radius: 6px;
    background-color: ${props => props.theme.inputBoxColor};
    height: 51px;
    align-items: center;
    width: 500px;
    margin-top: 20px;
    
    @media (max-width: 1300px) {
        width: 450px;
    }

    @media (max-width: 1200px) {
        width: 100%;
        margin-top: 10px;
    }
`

const MailInput = styled.input`
    background-color: transparent;
    border-width: 0px;
    outline: none;
    flex: 1 1 0;

    font-size: 15px;
    font-weight: 400;

    height: 20px;
    line-height: 20px;
    
    color: ${props => props.theme.text};

    ::placeholder {
        color: ${({ theme }) => theme.footerEmailColor} ;
    }
`

const SendTo = styled.div`
    display: flex;
    cursor: pointer;
    color: ${props => props.theme.primaryColor};
    align-items: center;

    padding-left: 8px;
`

const Title = styled.div`
    color: ${props => props.theme.primaryColor};
    font-weight: 800;
    font-size: 18px;
    line-height: 18px;
`

const ItemList = styled.div`
    margin: 0px 0px 0px 0px;
`

const LinkItem = styled.div`
    margin-top: 18px;
`

const Text = styled.span`
    color: ${props => props.theme.footerLinkColor};
    font-size: 15px;
    line-height: 15px;
    font-weight: 400;
    text-align: left;
`

const CopyRight = styled.div`
    @media (max-width: 1070px) {
        width: 100%;
        text-align: center;
        margin-bottom: 26px;
    }

    @media (max-width: 650px) {
        margin-bottom: 10px;
    }
`   

const CopyRightText = styled.span`
    color: ${props => props.theme.primaryColor};
    font-weight: 400;
    font-size: 14px;
    line-height: 14px;
`

const SocialGroup = styled.div`
    display: flex;
    flex-wrap: wrap;
    @media (max-width: 1070px) {
        width: 100%;
        justify-content: center;
    }
    @media (max-width: 650px) {
        margin-bottom: 20px;
    }
`

const SocialLink = styled.div`
    margin: 0px 0px 28px 32px;

    @media (max-width: 650px) {
        margin: 10px 15px;
    }
`

const SocialIcon = styled.i`
    color: ${props => props.theme.primaryColor};
`


const Footer = ({colormodesettle}) => {

    const [account, setAccount] = useState('');

    useEffect(() => {
        const acc = localStorage.getItem('account');
        setAccount(acc);
    }, [])

    return (
        <FooterPad>
            <FooterContainer className="footer-container">

                <LinkSection>

                    <InfoSection>
                        <Logo>
                            <Link to='/'>
                                <img  src={colormodesettle.ColorMode == true ? "/image/logo/logo.PNG" : "/image/logo/logo2.png"} className="img-fluid" alt="" width="300" style={{ height:'74px', width:'361px' }} />
                            </Link>
                        </Logo>
                        <SimpleText>Get informed & updated with SuperKluster newsletter.</SimpleText>
                        <MailBox>
                            <MailInput type='text' placeholder='Your Email Address' /> 
                            <SendTo>
                                <i><FaLongArrowAltRight size={18} /></i>
                            </SendTo>
                        </MailBox>
                    </InfoSection>

                    <LinkGroup>
                        <Title>SuperKluster</Title>
                        <ItemList>
                            <LinkItem><Link to="/home"><Text>Home</Text></Link></LinkItem>
                            <LinkItem><Link to="/explore"><Text>Explorer</Text></Link></LinkItem>
                            <LinkItem><Link to="/ranking"><Text>Ranking</Text></Link></LinkItem>
                            <LinkItem><Link to={account ? "/create" : "/wallet"}><Text>Create</Text></Link></LinkItem>
                        </ItemList>
                    </LinkGroup>

                    <LinkGroup>
                        <Title>Resources</Title>
                        <ItemList>
                            <LinkItem><a href="https://t.me/VoxelXNetwork_Official " target="_blank"><Text>Telegram</Text></a></LinkItem>
                            <LinkItem><a href="https://discord.com/invite/voxelxnetwork " target="_blank"><Text>Discord</Text></a></LinkItem>
                            <LinkItem><Link to="/Faq"><Text>FAQ</Text></Link></LinkItem>
                        </ItemList>
                    </LinkGroup>

                    <LinkGroup>
                        <Title>My Account</Title>
                        <ItemList>
                            <LinkItem><Link to={localStorage.getItem('account') ? "/collection" : "/wallet"}><Text>My Collections</Text></Link></LinkItem>
                            <LinkItem><Link to={localStorage.getItem('account') ? `/author/${localStorage.getItem('account')}` : '/wallet'}><Text>My Profile</Text></Link></LinkItem>
                        </ItemList>
                    </LinkGroup>

                    <LinkGroup>
                        <Title>Voxel X Network</Title>
                        <ItemList>
                            <LinkItem><a href="https://shibaswap.com/#/swap?outputCurrency=0x16CC8367055aE7e9157DBcB9d86Fd6CE82522b31" target="_blank"><Text>Buy $VXL</Text></a></LinkItem>
                            <LinkItem><a href="https://www.voxelxnetwork.com/" target="_blank"><Text>Voxel X Website</Text></a></LinkItem>
                            <LinkItem><Link to='/privacy-policy'><Text>Privacy Policy</Text></Link></LinkItem>
                            <LinkItem><Link to='/terms-of-service'><Text>Terms of Service</Text></Link></LinkItem>
                        </ItemList>
                    </LinkGroup>

                </LinkSection>

                <SocialSection>

                    <CopyRight>
                        <CopyRightText> &copy; Copyright 2022 SuperKluster.io - Powered by Voxel X Network</CopyRightText>
                    </CopyRight>

                    <SocialGroup>
                        <SocialLink><a href="https://www.facebook.com/VoxelXnetwork" target="_blank"><SocialIcon><FaFacebook size={24} /></SocialIcon></a></SocialLink>
                        <SocialLink><a href="https://twitter.com/superkluster" target="_blank"><SocialIcon><FaTwitter size={24} /></SocialIcon></a></SocialLink>
                        <SocialLink><a href="https://www.instagram.com/voxelxnetwork" target="_blank"><SocialIcon><FaInstagram size={24} /></SocialIcon></a></SocialLink>
                        <SocialLink><a href="https://www.youtube.com/voxelxnetwork" target="_blank"><SocialIcon><FaYoutube size={24} /></SocialIcon></a></SocialLink>
                        <SocialLink><a href="https://www.linkedin.com/company/voxel-x-network/" target="_blank"><SocialIcon><FaLinkedin size={25} /></SocialIcon></a></SocialLink>
                        <SocialLink><a href="https://t.me/VoxelXNetwork_Official" target="_blank"><SocialIcon><FaTelegram size={24} /></SocialIcon></a></SocialLink>
                        <SocialLink><a href="https://discord.com/invite/voxelxnetwork" target="_blank"><SocialIcon><FaDiscord size={24} /></SocialIcon></a></SocialLink>
                        <SocialLink><a href="https://www.reddit.com/r/VoxelXnetwork/" target="_blank"><SocialIcon><FaReddit size={24} /></SocialIcon></a></SocialLink>
                    </SocialGroup>
                    
                </SocialSection>

            </FooterContainer>
        </FooterPad>
    );
}
export default Footer;