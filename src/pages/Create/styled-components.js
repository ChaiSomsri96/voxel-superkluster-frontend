import styled from 'styled-components';
import { Button, Progress } from 'antd';

export const Container = styled.div`
  background-color: ${props => props.theme.primBgColor};
  padding-top: 136px;
  padding-bottom: 100px;
`;

export const FormSection = styled.div`
  margin: 0px auto;
  max-width: 1240px;
  background: ${props => props.theme.bannerSlideIconColor};
  box-shadow: 0px 0px 50px #0000001A;
  border-radius: 6px;
  padding: 40px;

  @media (max-width: 576px) {
    padding-left: 20px;
    padding-right: 20px;
  }  
`;

export const FormCollectionSection = styled.div`
  margin: 0px auto;
  max-width: 800px;
  background: ${props => props.theme.bannerSlideIconColor};
  box-shadow: 0px 0px 50px #0000001A;
  border-radius: 6px;
  padding: 40px;

  @media (max-width: 576px) {
    padding-left: 20px;
    padding-right: 20px;
  }
`;

export const Caption = styled.div`
  color: ${props => props.theme.primaryColor};
  font-size: 48px;
  line-height: 48px;
  font-weight: 800;
  margin-bottom: 50px;
`;

export const SubCaption = styled.div`
  color: ${props => props.theme.primaryColor};
  font-size: 16px;
  line-height: 16px;
  font-weight: 800;

  margin-bottom: 16px;
`;

export const Text = styled.div`
  color: ${props => props.theme.createPageTextColor};
  font-size: 15px;
  line-height: 21px;
  font-weight: 500;
  margin-bottom: 12px;
`;

export const ErrorLabel = styled.div`
  color: ${props => props.theme.createPageTextColor};
  font-size: 14px;
  font-weight: 500;
`;

export const imageUploaderStyleDark = {
    background: 'transparent',
    cursor: 'pointer',
    marginTop: 0,
    marginBottom: 0,
    border: '1px dashed #3B3B3B',
    borderRadius: 13,
    boxShadow: 'none'   
};

export const imageUploaderStyleLight = {
  background: '#ECEBEB',
  cursor: 'pointer',
  marginTop: 0,
  marginBottom: 0,
  border: '1px dashed #c4c4c4',
  borderRadius: 13,
  boxShadow: 'none'
}

export const iconBtnStyle = {
  cursor: "pointer", 
  fontSize: 18, 
  margin: '0px 3px 3px'
}

export const AddTraitBtn = styled.button`
  background: ${props => props.theme.traitBtnColor};
  color: ${props => props.theme.primaryColor};
  width: 51px;
  height: 51px;

  outline: 0;
  border-radius: 6px;
  font-size: 30px;
  font-weight: 400;

  border: ${props => props.theme.traitBtnBorder};
`;

export const TraitType = styled.div`
  color: ${props => props.theme.primaryColor};
  font-size: 16px;
  line-height: 21px;
  font-weight: 800;
`;

export const TraitDesc = styled.div`
  color: ${props => props.theme.createPageTextColor};
  font-size: 15px;
  line-height: 22px;
  font-weight: 500;
`;

export const TraitSection = styled.div`
  border-bottom: ${props => props.theme.traitSectionBorder};
`;

export const Span = styled.span`
  color: ${props => props.theme.createPageTextColor};
  font-size: 15px;
  line-height: 15px;
  font-weight: 500;
`;

export const ActionButton = styled(Button)`
    width: auto;
    height: 40px;
    color: white;
    background: #f70dff;
    padding: 0px 4%;
    border-color: #f70dff;
    border-radius: 10px;
    font-weight: bold;
    margin: 5px 10px;

    &:hover {
      color: white;
      background: #f70dff;
      border-color: #f70dff;
    }

    &:focus {
      color: white;
      background: #f70dff;
      border-color: #f70dff;
    }
`;

export const TraitValue = styled.div`
  color: ${props => props.theme.text};
  font-size: 16px;
  line-height: 16px;
  font-weight: 400;
`;

export const TraitVariable = styled.div`
  color: ${props => props.theme.createPageTextColor};
  font-size: 15px;
  line-height: 15px;
  font-weight: 400;
`;

export const TraitRarity = styled.div`
  color: ${props => props.theme.createPageTextColor};
  font-size: 11px;
  line-height: 11px;
  font-weight: 400;
`;


export const ItemRenderer = (properties ,inx) => {
  return (
    properties.name != "" &&
    <div className="properties-div" key={inx} style={{width:'178px'}}>
      <div className="properties-detail">
        <TraitVariable>{properties.type}</TraitVariable>
        <TraitValue>{properties.name}</TraitValue>
      </div>                              
    </div>
  )
}

export const ItemRendererLevel = (level ,inx) => {
  return (
    level.name != "" &&
    <div className="progress-div" key={inx}>
      <div className="progress-properties" style={{marginBottom: '5px'}}>
        <TraitValue>{level.name}</TraitValue>
        <TraitValue>{level.f_num} of {level.s_num}</TraitValue>
      </div>
      <Progress percent={level.f_num / level.s_num*100} strokeWidth	={12} showInfo={false} strokeColor="#f70dff" />
    </div>
  )
}

export const ItemRendererStat = (stat ,inx) => {
  return (
    stat.name != "" &&
    <div className="progress-div" key={inx}>
      <div className="progress-properties">
          <TraitValue>{stat.name}</TraitValue>
          <TraitValue>{stat.stat_f_num} of {stat.stat_s_num}</TraitValue>
        </div>
    </div>
  )
}