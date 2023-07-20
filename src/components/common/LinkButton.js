import styled from 'styled-components';

const Button = styled.div`
    border-radius: 6px;
    background: #f60cfe;
    padding: 20px 30px;
    width: fit-content;
    margin: auto;
`

const Text = styled.div`
    font-family: "inter";
    font-size: 16px;
    font-weight: 400;
    font-style: normal;
    text-align: center;
    color: #ffffff;
`

const LinkButton = ({url, text}) => {
    return(
        <Button>
            <a href={url}>
                <Text>{text}</Text>
            </a>
        </Button>
    )
}

export default LinkButton;